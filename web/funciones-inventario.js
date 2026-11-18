// ===== GESTIÓN DE INVENTARIO =====

let inventarioActual = [];
let proveedoresActuales = [];
let registrosCotizadorCompatibilidadActuales = [];

/**
 * Cargar lista de productos del inventario
 */
function normalizarClaveCompatibilidad(valor) {
    return String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function obtenerCompatibilidadesProducto(producto) {
    return String(producto.compatibilidad || '').split(/[,;|/\n\r]+/).map(valor => normalizarClaveCompatibilidad(valor)).filter(Boolean);
}

function obtenerFuentesCompatibilidadProducto(producto) {
    return String(producto.compatibilidad_fuentes || '').split(/[\n\r]+/).map(valor => {
        const fuente = valor.trim();
        if (/^Cotizador:\s*\S/i.test(fuente)) return fuente;
        try {
            const url = new URL(fuente);
            return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
        } catch {
            return '';
        }
    }).filter(Boolean);
}

function esUrlCompatibilidad(fuente) {
    try {
        const url = new URL(fuente);
        return ['http:', 'https:'].includes(url.protocol);
    } catch {
        return false;
    }
}

function obtenerEtiquetaNivelCompatibilidad(nivel) {
    return ({ catalogo: 'Listado de proveedor', foro: 'Reporte de foro', prueba: 'Prueba de taller' })[nivel] || 'Sin evidencia';
}

function compatibilidadTieneEvidencia(producto) {
    return ['catalogo', 'foro', 'prueba'].includes(producto.compatibilidad_nivel) && obtenerFuentesCompatibilidadProducto(producto).length > 0;
}

function obtenerRegistrosCompatibilidadCotizador() {
    return ['pw_cotizador_refacciones', 'pw_cotizador_iphone_refacciones'].flatMap(clave => {
        try {
            return JSON.parse(localStorage.getItem(clave) || '[]')
                .filter(item => String(item.compatibilidad || '').trim())
                .map(item => ({ ...item, clave_cotizador: clave }));
        } catch {
            return [];
        }
    });
}

function aplicarCompatibilidadDesdeCotizador(indice, idCompatibilidad, idFuentes, idNivel) {
    const registro = registrosCotizadorCompatibilidadActuales[Number(indice)];
    if (!registro) return;
    const campoCompatibilidad = document.getElementById(idCompatibilidad);
    const campoFuentes = document.getElementById(idFuentes);
    const campoNivel = document.getElementById(idNivel);
    if (campoCompatibilidad) campoCompatibilidad.value = String(registro.compatibilidad || '').split(/[,;|/\n\r]+/).map(modelo => modelo.trim()).filter(Boolean).join(', ');
    if (campoNivel) campoNivel.value = 'catalogo';
    if (campoFuentes) {
        const anteriores = campoFuentes.value.split(/\r?\n/).filter(fuente => !/^Cotizador:/i.test(fuente.trim()));
        const origen = `Cotizador: ${registro.proveedor || 'Proveedor no identificado'} · ${registro.archivo_proveedor || 'archivo no identificado'} · ${registro.descripcion_proveedor || registro.modelo || registro.id}`;
        campoFuentes.value = [...anteriores, origen].filter(Boolean).join('\n');
    }
}

async function cargarInventario(filtro = '', filtroCompatibilidad = '') {
    try {
        inventarioActual = ipc ? await ipc.invoke('get-inventario') : JSON.parse(localStorage.getItem('pw_inventario') || '[]');
        
        let productos = inventarioActual;
        
        // Filtrar por nombre o SKU
        if (filtro.trim()) {
            const busqueda = filtro.toLowerCase();
            productos = productos.filter(p => 
                p.nombre.toLowerCase().includes(busqueda) || 
                (p.sku && p.sku.toLowerCase().includes(busqueda)) ||
                (p.categoria && p.categoria.toLowerCase().includes(busqueda)) ||
                (p.compatibilidad && p.compatibilidad.toLowerCase().includes(busqueda))
            );
        }

        const modeloBuscado = normalizarClaveCompatibilidad(filtroCompatibilidad);
        if (modeloBuscado) {
            productos = productos.filter(producto => Number(producto.stock) > 0 && compatibilidadTieneEvidencia(producto) && obtenerCompatibilidadesProducto(producto).includes(modeloBuscado));
        }
        
        const contenedor = document.getElementById('inventario-tabla');
        if (!contenedor) return;
        
        if (productos.length === 0) {
            contenedor.innerHTML = `<div class="text-center text-slate-400 py-8">${modeloBuscado ? 'No hay coincidencias compatibles con stock.' : 'No hay productos registrados.'}</div>`;
            return;
        }
        
        contenedor.innerHTML = `
            <div class="overflow-x-auto">
                <table class="w-full text-xs">
                    <thead class="bg-[#0d131f] border-b border-slate-700 sticky top-0">
                        <tr>
                            <th class="px-3 py-2 text-left font-bold">Producto</th>
                            <th class="px-3 py-2 text-left font-bold">SKU</th>
                            <th class="px-3 py-2 text-left font-bold">Categoría</th>
                            <th class="px-3 py-2 text-left font-bold">Ubicación</th>
                            <th class="px-3 py-2 text-left font-bold">Compatibilidad declarada</th>
                            <th class="px-3 py-2 text-left font-bold">Evidencia</th>
                            <th class="px-3 py-2 text-right font-bold">Stock Actual</th>
                            <th class="px-3 py-2 text-right font-bold">Mínimo</th>
                            <th class="px-3 py-2 text-right font-bold">Costo Unit.</th>
                            <th class="px-3 py-2 text-right font-bold">Venta Unit.</th>
                            <th class="px-3 py-2 text-right font-bold">Utilidad</th>
                            <th class="px-3 py-2 text-center font-bold">Estado</th>
                            <th class="px-3 py-2 text-center font-bold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productos.map(producto => {
                            const margenUtilidad = producto.precio_venta - producto.precio_costo;
                            const porcentajeUtilidad = producto.precio_costo > 0 ? ((margenUtilidad / producto.precio_costo) * 100).toFixed(0) : 0;
                            const estado = producto.stock > producto.minimo ? 'OK' : producto.stock > 0 ? 'BAJO' : 'AGOTADO';
                            const colorEstado = estado === 'OK' ? 'text-emerald-400' : estado === 'BAJO' ? 'text-amber-400' : 'text-red-400';
                            
                            return `
                                <tr class="border-b border-slate-800 hover:bg-[#131c2e] transition">
                                    <td class="px-3 py-2 text-white font-semibold">${escaparHTML(producto.nombre)}</td>
                                    <td class="px-3 py-2 text-slate-400">${escaparHTML(producto.sku || '-')}</td>
                                    <td class="px-3 py-2 text-slate-400">${escaparHTML(producto.categoria || '-')}</td>
                                    <td class="px-3 py-2 text-slate-400">${escaparHTML(producto.ubicacion || '-')}</td>
                                    <td class="px-3 py-2 text-slate-400">${escaparHTML(producto.compatibilidad || '-')}</td>
                                    <td class="px-3 py-2 text-slate-400"><span>${escaparHTML(obtenerEtiquetaNivelCompatibilidad(producto.compatibilidad_nivel))}</span><div class="flex flex-wrap gap-2">${obtenerFuentesCompatibilidadProducto(producto).map((fuente, index) => esUrlCompatibilidad(fuente) ? `<a href="${escaparHTML(fuente)}" target="_blank" rel="noopener noreferrer" class="text-cyan-300 underline">Fuente ${index + 1}</a>` : `<span>${escaparHTML(fuente)}</span>`).join('')}</div></td>
                                    <td class="px-3 py-2 text-right text-white font-bold">${producto.stock}</td>
                                    <td class="px-3 py-2 text-right text-slate-400">${producto.minimo}</td>
                                    <td class="px-3 py-2 text-right text-slate-300">$${Number(producto.precio_costo).toFixed(2)}</td>
                                    <td class="px-3 py-2 text-right text-[#00ff66]">$${Number(producto.precio_venta).toFixed(2)}</td>
                                    <td class="px-3 py-2 text-right ${margenUtilidad > 0 ? 'text-emerald-400' : 'text-red-400'}">
                                        $${Math.abs(margenUtilidad).toFixed(2)} (${porcentajeUtilidad}%)
                                    </td>
                                    <td class="px-3 py-2 text-center">
                                        <span class="px-2 py-1 rounded text-xs font-bold bg-opacity-20 ${colorEstado} ${colorEstado.replace('text-', 'bg-').replace('-400', '-900')}">
                                            ${estado}
                                        </span>
                                    </td>
                                    <td class="px-3 py-2 text-center flex gap-1 justify-center">
                                        <button onclick="abrirEditarProducto(${producto.id})" class="text-blue-400 hover:text-blue-300" title="Editar">✎</button>
                                        <button onclick="abrirMovimientos(${producto.id})" class="text-amber-400 hover:text-amber-300" title="Movimientos">📊</button>
                                        <button onclick="eliminarProductoConfirm(${Number(producto.id)})" class="text-red-400 hover:text-red-300" title="Eliminar">🗑️</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error cargando inventario:', error);
    }
}

/**
 * Crear nuevo producto
 */
async function crearNuevoProducto() {
    proveedoresActuales = ipc ? await ipc.invoke('get-proveedores') : JSON.parse(localStorage.getItem('pw_proveedores') || '[]');
    registrosCotizadorCompatibilidadActuales = obtenerRegistrosCompatibilidadCotizador();
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-[#0d131f] border border-slate-800 rounded-2xl p-6 w-full max-w-md my-8">
            <h3 class="text-lg font-bold text-white mb-4">Nuevo Producto</h3>
            
            <div class="space-y-3">
                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1">Nombre *</label>
                    <input id="prod-nombre" type="text" placeholder="Ej: Pantalla LCD iPhone 12" 
                        class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                </div>
                
                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1">Descripción</label>
                    <textarea id="prod-descripcion" placeholder="Detalles del producto" 
                        class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm h-16"></textarea>
                </div>

                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1" for="prod-compatibilidad">Modelos compatibles (separados por coma)</label>
                    <textarea id="prod-compatibilidad" placeholder="Samsung Galaxy A55, Xiaomi Redmi Note 13" class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm h-16"></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <label class="text-xs font-bold text-slate-300">Nivel de evidencia<select id="prod-compatibilidad-nivel" class="mt-1 w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm"><option value="">Sin evidencia</option><option value="catalogo">Listado de proveedor</option><option value="foro">Reporte de foro</option><option value="prueba">Prueba de taller</option></select></label>
                    <label class="text-xs font-bold text-slate-300">Fuentes (URL o cotizador, una por línea)<textarea id="prod-compatibilidad-fuentes" placeholder="https://sitio.example/repuesto" class="mt-1 w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm h-16"></textarea></label>
                </div>
                <select id="prod-compatibilidad-cotizador" onchange="aplicarCompatibilidadDesdeCotizador(this.value, 'prod-compatibilidad', 'prod-compatibilidad-fuentes', 'prod-compatibilidad-nivel')" class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm">
                    <option value="">Usar compatibilidad del cotizador</option>
                    ${registrosCotizadorCompatibilidadActuales.map((item, indice) => `<option value="${indice}">${escaparHTML(item.modelo || item.descripcion_proveedor || 'Refacción')} · ${escaparHTML(item.compatibilidad)} · ${escaparHTML(item.proveedor || 'Proveedor')}</option>`).join('')}
                </select>
                
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="text-xs font-bold text-slate-300 block mb-1">SKU</label>
                        <input id="prod-sku" type="text" placeholder="SKU123" 
                            class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                    <div>
                        <label class="text-xs font-bold text-slate-300 block mb-1">Categoría</label>
                        <input id="prod-categoria" type="text" placeholder="Pantallas" 
                            class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                </div>

                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1" for="prod-ubicacion">Ubicación física</label>
                    <input id="prod-ubicacion" type="text" maxlength="120" placeholder="Ej. Gabinete A · cajón 2" class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                </div>
                
                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1">Proveedor</label>
                    <select id="prod-proveedor" class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm">
                        <option value="">-- Sin proveedor --</option>
                        ${proveedoresActuales.map(p => `<option value="${Number(p.id)}">${escaparHTML(p.nombre)}</option>`).join('')}
                    </select>
                </div>
                
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="text-xs font-bold text-slate-300 block mb-1">Precio Costo *</label>
                        <input id="prod-costo" type="number" placeholder="0.00" min="0" step="0.01"
                            class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                    <div>
                        <label class="text-xs font-bold text-slate-300 block mb-1">Precio Venta *</label>
                        <input id="prod-venta" type="number" placeholder="0.00" min="0" step="0.01"
                            class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="text-xs font-bold text-slate-300 block mb-1">Stock Inicial</label>
                        <input id="prod-stock" type="number" placeholder="0" min="0" value="0"
                            class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                    <div>
                        <label class="text-xs font-bold text-slate-300 block mb-1">Stock Mínimo</label>
                        <input id="prod-minimo" type="number" placeholder="5" min="0" value="5"
                            class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                </div>
            </div>
            
            <div class="flex gap-2 mt-6">
                <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-slate-700 text-white py-2 rounded-lg text-xs hover:bg-slate-600">
                    Cancelar
                </button>
                <button onclick="guardarNuevoProducto()" class="flex-1 bg-[#00e65c] text-black font-bold py-2 rounded-lg text-xs hover:bg-[#00ff66]">
                    Crear Producto
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('prod-nombre').focus();
}

/**
 * Guardar nuevo producto
 */
async function guardarNuevoProducto() {
    const nombre = document.getElementById('prod-nombre')?.value.trim();
    const descripcion = document.getElementById('prod-descripcion')?.value.trim();
    const compatibilidad = document.getElementById('prod-compatibilidad')?.value.trim();
    const compatibilidad_nivel = document.getElementById('prod-compatibilidad-nivel')?.value || '';
    const compatibilidad_fuentes = document.getElementById('prod-compatibilidad-fuentes')?.value.trim() || '';
    const sku = document.getElementById('prod-sku')?.value.trim();
    const categoria = document.getElementById('prod-categoria')?.value.trim();
    const ubicacion = document.getElementById('prod-ubicacion')?.value.trim() || '';
    const proveedor_id = document.getElementById('prod-proveedor')?.value;
    const precio_costo = Number(document.getElementById('prod-costo')?.value || 0);
    const precio_venta = Number(document.getElementById('prod-venta')?.value || 0);
    const stock = Number(document.getElementById('prod-stock')?.value || 0);
    const minimo = Number(document.getElementById('prod-minimo')?.value || 0);
    
    if (!nombre || precio_costo < 0 || precio_venta < 0) {
        alert('Nombre y precios válidos son obligatorios');
        return;
    }
    if (compatibilidad && (!compatibilidad_nivel || !obtenerFuentesCompatibilidadProducto({ compatibilidad_fuentes }).length)) {
        alert('Agrega una fuente válida y clasifica la evidencia antes de declarar compatibilidad.');
        return;
    }
    
    try {
        const producto = { nombre, descripcion, compatibilidad, compatibilidad_fuentes, compatibilidad_nivel, sku, categoria, ubicacion, proveedor_id: proveedor_id || null, precio_costo, precio_venta, stock, minimo };
        
        if (ipc) {
            await ipc.invoke('add-producto', producto);
        } else {
            const productos = JSON.parse(localStorage.getItem('pw_inventario') || '[]');
            producto.id = Math.max(0, ...productos.map(p => p.id || 0)) + 1;
            producto.fecha_registro = new Date().toISOString();
            productos.push(producto);
            localStorage.setItem('pw_inventario', JSON.stringify(productos));
        }
        
        document.querySelector('.fixed').remove();
        await cargarInventario();
        alert('Producto guardado exitosamente');
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

/**
 * Abrir modal de edición de producto
 */
async function abrirEditarProducto(productoId) {
    const producto = inventarioActual.find(p => p.id === productoId);
    if (!producto) {
        alert('Producto no encontrado');
        return;
    }
    
    proveedoresActuales = ipc ? await ipc.invoke('get-proveedores') : JSON.parse(localStorage.getItem('pw_proveedores') || '[]');
    registrosCotizadorCompatibilidadActuales = obtenerRegistrosCompatibilidadCotizador();
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-[#0d131f] border border-slate-800 rounded-2xl p-6 w-full max-w-md my-8">
            <h3 class="text-lg font-bold text-white mb-4">Editar Producto</h3>
            
            <div class="space-y-3">
                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1">Nombre</label>
                    <input id="edit-nombre" type="text" value="${escaparHTML(producto.nombre)}" 
                        class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                </div>
                
                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1">Descripción</label>
                    <textarea id="edit-descripcion" class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm h-12">${escaparHTML(producto.descripcion || '')}</textarea>
                </div>

                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1" for="edit-compatibilidad">Modelos compatibles (separados por coma)</label>
                    <textarea id="edit-compatibilidad" class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm h-16">${escaparHTML(producto.compatibilidad || '')}</textarea>
                </div>

                <select id="edit-compatibilidad-cotizador" onchange="aplicarCompatibilidadDesdeCotizador(this.value, 'edit-compatibilidad', 'edit-compatibilidad-fuentes', 'edit-compatibilidad-nivel')" class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm">
                    <option value="">Usar compatibilidad del cotizador</option>
                    ${registrosCotizadorCompatibilidadActuales.map((item, indice) => `<option value="${indice}">${escaparHTML(item.modelo || item.descripcion_proveedor || 'Refacción')} · ${escaparHTML(item.compatibilidad)} · ${escaparHTML(item.proveedor || 'Proveedor')}</option>`).join('')}
                </select>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <label class="text-xs font-bold text-slate-300">Nivel de evidencia<select id="edit-compatibilidad-nivel" class="mt-1 w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm"><option value="">Sin evidencia</option><option value="catalogo" ${producto.compatibilidad_nivel === 'catalogo' ? 'selected' : ''}>Listado de proveedor</option><option value="foro" ${producto.compatibilidad_nivel === 'foro' ? 'selected' : ''}>Reporte de foro</option><option value="prueba" ${producto.compatibilidad_nivel === 'prueba' ? 'selected' : ''}>Prueba de taller</option></select></label>
                    <label class="text-xs font-bold text-slate-300">Fuentes (URL o cotizador, una por línea)<textarea id="edit-compatibilidad-fuentes" class="mt-1 w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm h-16">${escaparHTML(producto.compatibilidad_fuentes || '')}</textarea></label>
                </div>
                
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="text-xs font-bold text-slate-300 block mb-1">SKU</label>
                        <input id="edit-sku" type="text" value="${escaparHTML(producto.sku || '')}" 
                            class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                    <div>
                        <label class="text-xs font-bold text-slate-300 block mb-1">Categoría</label>
                        <input id="edit-categoria" type="text" value="${escaparHTML(producto.categoria || '')}" 
                            class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                </div>

                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1" for="edit-ubicacion">Ubicación física</label>
                    <input id="edit-ubicacion" type="text" maxlength="120" value="${escaparHTML(producto.ubicacion || '')}" placeholder="Ej. Gabinete A · cajón 2" class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                </div>
                
                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1">Proveedor</label>
                    <select id="edit-proveedor" class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm">
                        <option value="">-- Sin proveedor --</option>
                        ${proveedoresActuales.map(p => `<option value="${Number(p.id)}" ${p.id === producto.proveedor_id ? 'selected' : ''}>${escaparHTML(p.nombre)}</option>`).join('')}
                    </select>
                </div>
                
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="text-xs font-bold text-slate-300 block mb-1">Precio Costo</label>
                        <input id="edit-costo" type="number" value="${producto.precio_costo}" min="0" step="0.01"
                            class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                    <div>
                        <label class="text-xs font-bold text-slate-300 block mb-1">Precio Venta</label>
                        <input id="edit-venta" type="number" value="${producto.precio_venta}" min="0" step="0.01"
                            class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                </div>
                
                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1">Stock Mínimo</label>
                    <input id="edit-minimo" type="number" value="${producto.minimo}" min="0"
                        class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                </div>
            </div>
            
            <div class="flex gap-2 mt-6">
                <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-slate-700 text-white py-2 rounded-lg text-xs hover:bg-slate-600">
                    Cancelar
                </button>
                <button onclick="guardarProductoEditado(${productoId})" class="flex-1 bg-amber-500 text-white font-bold py-2 rounded-lg text-xs hover:bg-amber-600">
                    Actualizar
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

/**
 * Guardar producto editado
 */
async function guardarProductoEditado(productoId) {
    const nombre = document.getElementById('edit-nombre')?.value.trim();
    if (!nombre) {
        alert('Nombre es obligatorio');
        return;
    }
    
    try {
        const productoActualizado = {
            nombre,
            descripcion: document.getElementById('edit-descripcion')?.value.trim() || '',
            compatibilidad: document.getElementById('edit-compatibilidad')?.value.trim() || '',
            compatibilidad_nivel: document.getElementById('edit-compatibilidad-nivel')?.value || '',
            compatibilidad_fuentes: document.getElementById('edit-compatibilidad-fuentes')?.value.trim() || '',
            sku: document.getElementById('edit-sku')?.value.trim() || '',
            categoria: document.getElementById('edit-categoria')?.value.trim() || '',
            ubicacion: document.getElementById('edit-ubicacion')?.value.trim() || '',
            proveedor_id: document.getElementById('edit-proveedor')?.value || null,
            precio_costo: Number(document.getElementById('edit-costo')?.value || 0),
            precio_venta: Number(document.getElementById('edit-venta')?.value || 0),
            minimo: Number(document.getElementById('edit-minimo')?.value || 0)
        };

        if (productoActualizado.compatibilidad && (!productoActualizado.compatibilidad_nivel || !obtenerFuentesCompatibilidadProducto(productoActualizado).length)) {
            alert('Agrega una fuente válida y clasifica la evidencia antes de declarar compatibilidad.');
            return;
        }
        
        if (ipc) {
            await ipc.invoke('update-producto', productoId, productoActualizado);
        } else {
            let productos = JSON.parse(localStorage.getItem('pw_inventario') || '[]');
            const idx = productos.findIndex(p => p.id === productoId);
            if (idx >= 0) {
                productos[idx] = { ...productos[idx], ...productoActualizado };
                localStorage.setItem('pw_inventario', JSON.stringify(productos));
            }
        }
        
        document.querySelector('.fixed').remove();
        await cargarInventario();
        alert('Producto actualizado');
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

/**
 * Eliminar producto con confirmación
 */
function eliminarProductoConfirm(productoId) {
    const nombre = inventarioActual.find(producto => Number(producto.id) === Number(productoId))?.nombre || 'este producto';
    if (!confirm(`¿Deseas eliminar "${nombre}"?`)) return;
    eliminarProducto(productoId, nombre);
}

/**
 * Eliminar producto
 */
async function eliminarProducto(productoId, nombre) {
    try {
        if (ipc) {
            await ipc.invoke('delete-producto', productoId);
        } else {
            let productos = JSON.parse(localStorage.getItem('pw_inventario') || '[]');
            productos = productos.filter(p => p.id !== productoId);
            localStorage.setItem('pw_inventario', JSON.stringify(productos));
        }
        
        await cargarInventario();
        alert(`"${nombre}" eliminado`);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

/**
 * Abrir modal de movimientos de inventario
 */
async function abrirMovimientos(productoId) {
    const producto = inventarioActual.find(p => p.id === productoId);
    if (!producto) return;
    
    const movimientos = ipc ? await ipc.invoke('get-movimientos', productoId) : [];
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-[#0d131f] border border-slate-800 rounded-2xl p-6 w-full max-w-2xl my-8">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h3 class="text-lg font-bold text-white">${escaparHTML(producto.nombre)}</h3>
                    <p class="text-xs text-slate-400">Stock actual: ${producto.stock} | Mínimo: ${producto.minimo}</p>
                </div>
                <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div class="bg-[#131c2e] border border-slate-700 rounded-lg p-4 mb-4">
                <h4 class="text-sm font-bold text-white mb-3">Registrar Movimiento</h4>
                <div class="grid grid-cols-3 gap-2 mb-3">
                    <select id="mov-tipo" class="bg-[#0d131f] border border-slate-700 rounded-lg p-2 text-white text-xs">
                        <option value="entrada">Entrada (+)</option>
                        <option value="salida">Salida (-)</option>
                        <option value="ajuste">Ajuste</option>
                    </select>
                    <input id="mov-cantidad" type="number" placeholder="Cantidad" min="1" value="1"
                        class="bg-[#0d131f] border border-slate-700 rounded-lg p-2 text-white text-xs" />
                    <input id="mov-motivo" type="text" placeholder="Motivo" 
                        class="bg-[#0d131f] border border-slate-700 rounded-lg p-2 text-white text-xs" />
                </div>
                <button onclick="guardarMovimiento(${productoId})" class="w-full bg-[#00ff66] text-black font-bold py-2 rounded-lg text-xs hover:bg-[#00e65c]">
                    Registrar Movimiento
                </button>
            </div>
            
            <div>
                <h4 class="text-sm font-bold text-white mb-3">Historial (últimas 50)</h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${movimientos.length ? movimientos.slice(0, 50).map(mov => `
                        <div class="bg-[#131c2e] border border-slate-700 rounded-lg p-2 text-xs">
                            <div class="flex justify-between">
                                <span class="font-bold ${mov.tipo === 'entrada' ? 'text-emerald-400' : mov.tipo === 'salida' ? 'text-red-400' : 'text-amber-400'}">
                                    ${mov.tipo.toUpperCase()} ${mov.cantidad > 0 ? '+' : ''}${mov.cantidad}
                                </span>
                                <span class="text-slate-400">${new Date(mov.fecha).toLocaleString('es-MX')}</span>
                            </div>
                            <p class="text-slate-500">${mov.motivo || 'Sin motivo'}</p>
                        </div>
                    `).join('') : '<p class="text-slate-400 text-center py-4">Sin movimientos</p>'}
                </div>
            </div>
            
            <button onclick="this.closest('.fixed').remove()" class="w-full bg-slate-700 text-white py-2 rounded-lg text-xs mt-4 hover:bg-slate-600">
                Cerrar
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

/**
 * Guardar movimiento de inventario
 */
async function guardarMovimiento(productoId) {
    const tipo = document.getElementById('mov-tipo')?.value;
    const cantidad = Number(document.getElementById('mov-cantidad')?.value || 0);
    const motivo = document.getElementById('mov-motivo')?.value.trim() || 'Movimiento manual';
    
    if (cantidad <= 0) {
        alert('Cantidad debe ser mayor a 0');
        return;
    }
    
    try {
        const movimiento = { producto_id: productoId, tipo, cantidad: tipo === 'salida' ? -cantidad : cantidad, motivo };
        
        if (ipc) {
            await ipc.invoke('registrar-movimiento', movimiento);
        } else {
            // Actualizar stock local
            let productos = JSON.parse(localStorage.getItem('pw_inventario') || '[]');
            const idx = productos.findIndex(p => p.id === productoId);
            if (idx >= 0) {
                if (tipo === 'entrada') productos[idx].stock += cantidad;
                else if (tipo === 'salida') productos[idx].stock = Math.max(0, productos[idx].stock - cantidad);
                else productos[idx].stock = cantidad;
                localStorage.setItem('pw_inventario', JSON.stringify(productos));
            }
        }
        
        await cargarInventario();
        alert('Movimiento registrado');
        document.querySelector('.fixed').remove();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

/**
 * Buscar productos en tiempo real
 */
function buscarInventario(event) {
    const filtro = event.target.value;
    cargarInventario(filtro, document.getElementById('inventario-compatibilidad')?.value || '');
}

function buscarCompatibilidadInventario(event) {
    const filtroCompatibilidad = event.target.value;
    cargarInventario(document.getElementById('inventario-buscar')?.value || '', filtroCompatibilidad);
}

/**
 * Cargar alertas de stock bajo
 */
async function cargarAlertasStockBajo() {
    try {
        const productos = ipc ? await ipc.invoke('get-stock-bajo') : inventarioActual.filter(p => p.stock <= p.minimo);
        
        const contenedor = document.getElementById('alertas-stock-bajo');
        if (!contenedor) return;
        
        if (productos.length === 0) {
            contenedor.innerHTML = '<div class="text-slate-400 text-xs text-center py-3">✓ Todos los productos con stock adecuado</div>';
            return;
        }
        
        contenedor.innerHTML = `
            <div class="bg-red-900/20 border border-red-700 rounded-lg p-3">
                <div class="flex items-start gap-2">
                    <div class="text-red-400 text-lg">⚠️</div>
                    <div class="flex-1">
                        <p class="font-bold text-red-400 text-xs">${productos.length} producto(s) con stock bajo</p>
                        <div class="mt-2 space-y-1">
                            ${productos.map(p => `
                                <p class="text-xs text-slate-300">
                                    • <strong>${escaparHTML(p.nombre)}</strong> - Stock: ${Number(p.stock)}, Mínimo: ${Number(p.minimo)}
                                </p>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error cargando alertas:', error);
    }
}

// Hook para cargar inventario cuando se abre la sección
window.cargarInventarioFunc = async function() {
    await cargarInventario();
    await cargarAlertasStockBajo();
};

async function abrirRecepcionMercancia() {
    try {
        inventarioActual = ipc ? await ipc.invoke('get-inventario') : JSON.parse(localStorage.getItem('pw_inventario') || '[]');
        proveedoresActuales = ipc ? await ipc.invoke('get-proveedores') : JSON.parse(localStorage.getItem('pw_proveedores') || '[]');
        const recepciones = ipc ? await ipc.invoke('get-recepciones-mercancia') : JSON.parse(localStorage.getItem('pw_compras') || '[]');
        const opcionesProductos = inventarioActual.map(producto => `<option value="${Number(producto.id)}">${escaparHTML(producto.nombre)}${producto.sku ? ` · ${escaparHTML(producto.sku)}` : ''}</option>`).join('');
        const opcionesProveedores = proveedoresActuales.map(proveedor => `<option value="${Number(proveedor.id)}">${escaparHTML(proveedor.nombre)}</option>`).join('');
        const filasRecepcion = recepciones.slice(0, 20).map(recepcion => {
            const detalles = Array.isArray(recepcion.detalles) ? recepcion.detalles : JSON.parse(recepcion.detalles || '[]');
            const proveedor = proveedoresActuales.find(item => Number(item.id) === Number(recepcion.proveedor_id));
            const fecha = new Date(recepcion.fecha).toLocaleString('es-MX');
            return `<tr class="border-b border-slate-800"><td class="px-3 py-2">${escaparHTML(fecha)}</td><td class="px-3 py-2">${escaparHTML(recepcion.referencia || 'Sin referencia')}</td><td class="px-3 py-2">${escaparHTML(proveedor?.nombre || 'Sin proveedor')}</td><td class="px-3 py-2 text-right">${detalles.reduce((suma, item) => suma + Number(item.cantidad || 0), 0)}</td><td class="px-3 py-2 text-right">$${Number(recepcion.total || 0).toFixed(2)}</td></tr>`;
        }).join('');
        const modal = document.createElement('div');
        modal.id = 'modal-recepcion-mercancia';
        modal.dataset.syncId = crypto.randomUUID();
        modal.className = 'fixed inset-0 z-[120] overflow-y-auto bg-black/80 p-4';
        modal.innerHTML = `
            <section role="dialog" aria-modal="true" aria-labelledby="titulo-recepcion-mercancia" class="mx-auto my-6 w-full max-w-5xl overflow-hidden rounded-xl border border-slate-700 bg-[#0d131f] shadow-2xl">
                <header class="flex items-start justify-between gap-4 border-b border-slate-800 p-5">
                    <div><h2 id="titulo-recepcion-mercancia" class="text-lg font-bold text-white">Recepción de mercancía</h2><p class="mt-1 text-xs text-slate-400">Registra proveedor, referencia y costo de entrada. El stock se actualiza al confirmar.</p></div>
                    <button type="button" onclick="cerrarRecepcionMercancia()" class="rounded border border-slate-700 px-2 py-1 text-xs text-slate-400" title="Cerrar">Esc</button>
                </header>
                <div class="space-y-5 p-5">
                    ${inventarioActual.length ? '' : '<p class="rounded border border-amber-700/50 bg-amber-950/30 p-3 text-xs text-amber-200">Registra al menos un producto antes de recibir mercancía.</p>'}
                    <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <label class="text-xs font-semibold text-slate-300">Proveedor<select id="recepcion-proveedor" class="mt-1 w-full rounded border border-slate-700 bg-[#131c2e] p-2.5 text-white"><option value="">Sin proveedor</option>${opcionesProveedores}</select></label>
                        <label class="text-xs font-semibold text-slate-300 md:col-span-2">Referencia de factura / compra<input id="recepcion-referencia" maxlength="120" class="mt-1 w-full rounded border border-slate-700 bg-[#131c2e] p-2.5 text-white" placeholder="Ej. FAC-2026-001"></label>
                    </div>
                    <div class="overflow-x-auto rounded border border-slate-800">
                        <div class="flex items-center justify-between border-b border-slate-800 p-3"><h3 class="text-sm font-bold text-white">Artículos</h3><button type="button" onclick="agregarLineaRecepcion()" ${inventarioActual.length ? '' : 'disabled'} class="flex items-center gap-1 rounded border border-slate-700 px-3 py-1.5 text-xs text-slate-200 disabled:opacity-40"><i data-lucide="plus" class="h-4 w-4"></i> Agregar artículo</button></div>
                        <div id="recepcion-lineas" class="space-y-2 p-3"></div>
                        <div class="flex justify-end border-t border-slate-800 px-3 py-2 text-sm font-bold text-emerald-300">Total de compra: <span id="recepcion-total" class="ml-2">$0.00</span></div>
                    </div>
                    <label class="block text-xs font-semibold text-slate-300">Notas<textarea id="recepcion-notas" maxlength="1000" rows="2" class="mt-1 w-full rounded border border-slate-700 bg-[#131c2e] p-2.5 text-white" placeholder="Condición, lote u observaciones"></textarea></label>
                    <div class="flex justify-end gap-2"><button type="button" onclick="cerrarRecepcionMercancia()" class="rounded border border-slate-700 px-4 py-2 text-xs text-slate-300">Cancelar</button><button type="button" onclick="guardarRecepcionMercancia()" ${inventarioActual.length ? '' : 'disabled'} class="flex items-center gap-2 rounded bg-[#00e65c] px-4 py-2 text-xs font-bold text-black disabled:opacity-40"><i data-lucide="save" class="h-4 w-4"></i> Confirmar recepción</button></div>
                    <div><h3 class="mb-2 text-sm font-bold text-white">Recepciones recientes</h3><div class="overflow-x-auto rounded border border-slate-800"><table class="w-full text-left text-xs"><thead class="text-slate-400"><tr><th class="px-3 py-2">Fecha</th><th class="px-3 py-2">Referencia</th><th class="px-3 py-2">Proveedor</th><th class="px-3 py-2 text-right">Piezas</th><th class="px-3 py-2 text-right">Total</th></tr></thead><tbody>${filasRecepcion || '<tr><td colspan="5" class="px-3 py-4 text-center text-slate-500">Sin recepciones registradas</td></tr>'}</tbody></table></div></div>
                </div>
            </section>`;
        document.body.appendChild(modal);
        agregarLineaRecepcion();
        if (window.lucide) lucide.createIcons();
    } catch (error) {
        alert(`No se pudo abrir la recepción: ${error.message}`);
    }
}

function cerrarRecepcionMercancia() {
    document.getElementById('modal-recepcion-mercancia')?.remove();
}

function agregarLineaRecepcion() {
    const contenedor = document.getElementById('recepcion-lineas');
    if (!contenedor) return;
    const productos = inventarioActual.map(producto => `<option value="${Number(producto.id)}">${escaparHTML(producto.nombre)}${producto.sku ? ` · ${escaparHTML(producto.sku)}` : ''}</option>`).join('');
    const fila = document.createElement('div');
    fila.className = 'recepcion-linea grid grid-cols-1 items-end gap-2 border-b border-slate-800 pb-2 md:grid-cols-[minmax(0,1fr)_110px_140px_40px]';
    fila.innerHTML = `<label class="text-[11px] font-semibold text-slate-400">Producto<select class="recepcion-producto mt-1 w-full rounded border border-slate-700 bg-[#131c2e] p-2 text-xs text-white" onchange="actualizarCostoRecepcion(this)"><option value="">Seleccionar producto</option>${productos}</select></label><label class="text-[11px] font-semibold text-slate-400">Cantidad<input class="recepcion-cantidad mt-1 w-full rounded border border-slate-700 bg-[#131c2e] p-2 text-xs text-white" type="number" min="1" step="1" value="1" oninput="recalcularTotalRecepcion()"></label><label class="text-[11px] font-semibold text-slate-400">Costo unitario<input class="recepcion-costo mt-1 w-full rounded border border-slate-700 bg-[#131c2e] p-2 text-xs text-white" type="number" min="0" step="0.01" value="0" oninput="recalcularTotalRecepcion()"></label><button type="button" onclick="this.closest('.recepcion-linea').remove(); recalcularTotalRecepcion()" class="mb-1 rounded border border-slate-700 p-2 text-slate-300" title="Quitar artículo"><i data-lucide="x" class="h-4 w-4"></i></button>`;
    contenedor.appendChild(fila);
    if (window.lucide) lucide.createIcons({ nodes: [fila] });
}

function actualizarCostoRecepcion(select) {
    const producto = inventarioActual.find(item => Number(item.id) === Number(select.value));
    const costo = select.closest('.recepcion-linea')?.querySelector('.recepcion-costo');
    if (producto && costo) costo.value = Number(producto.precio_costo || 0).toFixed(2);
    recalcularTotalRecepcion();
}

function recalcularTotalRecepcion() {
    const total = [...document.querySelectorAll('#recepcion-lineas .recepcion-linea')].reduce((suma, fila) => {
        const cantidad = Number(fila.querySelector('.recepcion-cantidad')?.value || 0);
        const costo = Number(fila.querySelector('.recepcion-costo')?.value || 0);
        return suma + (Number.isFinite(cantidad * costo) ? cantidad * costo : 0);
    }, 0);
    const salida = document.getElementById('recepcion-total');
    if (salida) salida.textContent = `$${total.toFixed(2)}`;
}

async function guardarRecepcionMercancia() {
    const modal = document.getElementById('modal-recepcion-mercancia');
    if (!modal) return;
    const items = [...modal.querySelectorAll('.recepcion-linea')].map(fila => ({
        producto_id: Number(fila.querySelector('.recepcion-producto')?.value),
        cantidad: Number(fila.querySelector('.recepcion-cantidad')?.value),
        precio_costo: Number(fila.querySelector('.recepcion-costo')?.value)
    }));
    if (!items.length || items.some(item => !Number.isInteger(item.producto_id) || item.producto_id <= 0 || !Number.isInteger(item.cantidad) || item.cantidad <= 0 || !Number.isFinite(item.precio_costo) || item.precio_costo < 0)) {
        alert('Selecciona un producto e indica una cantidad entera positiva y un costo válido en cada renglón.');
        return;
    }
    const recepcion = {
        sync_id: modal.dataset.syncId,
        proveedor_id: document.getElementById('recepcion-proveedor')?.value || null,
        referencia: document.getElementById('recepcion-referencia')?.value.trim() || '',
        notas: document.getElementById('recepcion-notas')?.value.trim() || '',
        items
    };
    try {
        if (ipc) {
            await ipc.invoke('registrar-recepcion-mercancia', recepcion);
        } else {
            const compras = JSON.parse(localStorage.getItem('pw_compras') || '[]');
            if (!compras.some(item => item.sync_id === recepcion.sync_id)) {
                const productos = JSON.parse(localStorage.getItem('pw_inventario') || '[]');
                const detalles = items.map(item => {
                    const producto = productos.find(actual => Number(actual.id) === item.producto_id);
                    if (!producto) throw new Error('Un producto seleccionado ya no está disponible en esta sucursal.');
                    return { producto_id: producto.id, nombre: producto.nombre, sku: producto.sku || '', cantidad: item.cantidad, precio_costo: item.precio_costo, subtotal: item.cantidad * item.precio_costo };
                });
                detalles.forEach(detalle => {
                    const producto = productos.find(actual => Number(actual.id) === Number(detalle.producto_id));
                    producto.stock = Number(producto.stock || 0) + detalle.cantidad;
                    producto.precio_costo = detalle.precio_costo;
                });
                const total = detalles.reduce((suma, item) => suma + item.subtotal, 0);
                const guardada = { ...recepcion, id: Math.max(0, ...compras.map(item => Number(item.id) || 0)) + 1, total, detalles, usuario: 'local', fecha: new Date().toISOString() };
                localStorage.setItem('pw_inventario', JSON.stringify(productos));
                localStorage.setItem('pw_compras', JSON.stringify([guardada, ...compras]));
            }
        }
        cerrarRecepcionMercancia();
        await cargarInventario();
        await cargarAlertasStockBajo();
        alert('Recepción registrada y stock actualizado.');
    } catch (error) {
        alert(`No se pudo registrar la recepción: ${error.message}`);
    }
}

function exportarInventarioCSV() {
    if (!inventarioActual.length) {
        alert('No hay productos de esta sucursal para exportar.');
        return;
    }
    const escaparCelda = valor => {
        let texto = String(valor ?? '');
        if (/^[=+\-@\t\r]/.test(texto)) texto = `'${texto}`;
        return `"${texto.replace(/"/g, '""')}"`;
    };
    const encabezados = ['Producto', 'SKU', 'Categoría', 'Ubicación', 'Compatibilidad', 'Nivel de evidencia', 'Fuentes', 'Existencia', 'Stock mínimo', 'Costo unitario', 'Precio de venta'];
    const filas = inventarioActual.map(producto => [
        producto.nombre,
        producto.sku,
        producto.categoria,
        producto.ubicacion,
        producto.compatibilidad,
        obtenerEtiquetaNivelCompatibilidad(producto.compatibilidad_nivel),
        producto.compatibilidad_fuentes,
        Number(producto.stock || 0),
        Number(producto.minimo || 0),
        Number(producto.precio_costo || 0).toFixed(2),
        Number(producto.precio_venta || 0).toFixed(2)
    ]);
    const csv = '\uFEFF' + [encabezados, ...filas].map(fila => fila.map(escaparCelda).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `inventario-sucursal-${sesionActual?.sucursal_id || 'local'}.csv`;
    enlace.click();
    URL.revokeObjectURL(url);
}
