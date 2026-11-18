// ===== TÉCNICOS Y USUARIOS =====
async function crearTecnico(datos) {
    const tecnicos = await leerModulo('tecnicos');
    const salt = crypto.randomUUID();
    const passwordHash = await hashPasswordWeb(datos.password, salt);
    const tecnico = {
        id: Date.now(),
        nombre: datos.nombre.trim(),
        usuario: datos.usuario.trim().toLowerCase(),
        email: datos.email.trim(),
        especialidad: datos.especialidad || 'General',
        rol: 'tecnico',
        salt,
        passwordHash,
        activo: true,
        fecha_creacion: new Date().toISOString()
    };
    tecnicos.push(tecnico);
    modulosBD.tecnicos = tecnicos;
    await guardarModulo('tecnicos');
    return tecnico;
}

async function cargarTecnicos() {
    const tecnicos = await leerModulo('tecnicos');
    const contenedor = document.getElementById('lista-tecnicos');
    if (!contenedor) return;
    
    if (!tecnicos.length) {
        contenedor.innerHTML = '<p class="text-slate-500 italic text-xs">No hay técnicos registrados.</p>';
        return;
    }
    
    contenedor.innerHTML = `<table class="w-full text-left text-[11px] text-slate-300">
        <thead>
            <tr class="border-b border-slate-800 text-slate-400">
                <th class="py-2 pr-3">Nombre</th>
                <th class="py-2 pr-3">Especialidad</th>
                <th class="py-2 pr-3">Estado</th>
                <th class="py-2 pr-3">Acciones</th>
            </tr>
        </thead>
        <tbody>
            ${tecnicos.map(t => `
                <tr class="border-b border-slate-800/60">
                    <td class="py-2 pr-3 text-white">${escaparHTML(t.nombre)}</td>
                    <td class="py-2 pr-3">${escaparHTML(t.especialidad)}</td>
                    <td class="py-2 pr-3">${t.activo ? '<span class="text-emerald-300">Activo</span>' : '<span class="text-rose-300">Inactivo</span>'}</td>
                    <td class="py-2 pr-3">
                        <button onclick="toggleTecnico('${t.id}')" class="text-xs px-2 py-1 rounded ${t.activo ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}">
                            ${t.activo ? 'Desactivar' : 'Activar'}
                        </button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

async function toggleTecnico(id) {
    const tecnicos = await leerModulo('tecnicos');
    const tecnico = tecnicos.find(t => String(t.id) === String(id));
    if (tecnico) {
        tecnico.activo = !tecnico.activo;
        modulosBD.tecnicos = tecnicos;
        await guardarModulo('tecnicos');
        cargarTecnicos();
    }
}

// ===== HISTORIAL DE CLIENTES =====
async function cargarDetallesCliente(clienteId) {
    let ordenes = [];
    if (ipc) ordenes = await ipc.invoke('get-ordenes') || [];
    else ordenes = JSON.parse(localStorage.getItem('pw_ordenes') || '[]');
    
    const cliente = (ipc ? await ipc.invoke('get-clientes') : JSON.parse(localStorage.getItem('pw_clientes') || '[]')).find(item => String(item.id) === String(clienteId));
    if (!cliente) return null;
    const ordenesCliente = ordenes.filter(o => String(o.cliente_id) === String(cliente.id));
    const totalGastado = ordenesCliente.reduce((sum, o) => sum + (Number(o.costo_estimado) || 0), 0);
    const reparacionesCompletas = ordenesCliente.filter(o => o.estado === 'Entregado').length;
    
    return {
        cliente_id: cliente.id,
        nombre: cliente.nombre,
        total_ordenes: ordenesCliente.length,
        reparaciones_completas: reparacionesCompletas,
        total_gastado: totalGastado,
        ordenes: ordenesCliente
    };
}

async function cargarHistorialClientes() {
    let ordenes = [];
    if (ipc) ordenes = await ipc.invoke('get-ordenes') || [];
    else ordenes = JSON.parse(localStorage.getItem('pw_ordenes') || '[]');
    
    const clientes = ipc ? await ipc.invoke('get-clientes') : JSON.parse(localStorage.getItem('pw_clientes') || '[]');
    const clientesUnicos = clientes.filter(cliente => ordenes.some(orden => String(orden.cliente_id) === String(cliente.id)));
    const contenedor = document.getElementById('lista-clientes-historial');
    if (!contenedor) return;
    
    if (!clientesUnicos.length) {
        contenedor.innerHTML = '<p class="text-slate-500 italic text-xs">No hay clientes registrados.</p>';
        return;
    }
    
    const detalles = (await Promise.all(clientesUnicos.map(cliente => cargarDetallesCliente(cliente.id)))).filter(Boolean);
    contenedor.innerHTML = `<table class="w-full text-left text-[11px] text-slate-300">
        <thead>
            <tr class="border-b border-slate-800 text-slate-400">
                <th class="py-2 pr-3">Cliente</th>
                <th class="py-2 pr-3">Reparaciones</th>
                <th class="py-2 pr-3">Completadas</th>
                <th class="py-2 pr-3">Total Gastado</th>
            </tr>
        </thead>
        <tbody>
            ${detalles.map(c => `
                <tr class="border-b border-slate-800/60 hover:bg-[#131c2e] cursor-pointer" onclick="expandirHistorialCliente(${Number(c.cliente_id)})">
                    <td class="py-2 pr-3 text-white">${escaparHTML(c.nombre)}</td>
                    <td class="py-2 pr-3">${c.total_ordenes}</td>
                    <td class="py-2 pr-3 text-emerald-300">${c.reparaciones_completas}</td>
                    <td class="py-2 pr-3 font-bold text-blue-300">$${c.total_gastado.toFixed(2)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

async function expandirHistorialCliente(clienteId) {
    const detalles = await cargarDetallesCliente(clienteId);
    if (!detalles) return;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
        <div class="bg-[#0d131f] border border-slate-800 rounded-2xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto w-full">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-white">Historial: ${escaparHTML(detalles.nombre)}</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white text-2xl">&times;</button>
            </div>
            <div class="grid grid-cols-3 gap-3 mb-6">
                <div class="bg-[#131c2e] border border-slate-800 rounded-lg p-3">
                    <span class="text-xs text-slate-400">Total Reparaciones</span>
                    <strong class="block text-lg text-white">${detalles.total_ordenes}</strong>
                </div>
                <div class="bg-[#131c2e] border border-slate-800 rounded-lg p-3">
                    <span class="text-xs text-slate-400">Completadas</span>
                    <strong class="block text-lg text-emerald-300">${detalles.reparaciones_completas}</strong>
                </div>
                <div class="bg-[#131c2e] border border-slate-800 rounded-lg p-3">
                    <span class="text-xs text-slate-400">Total Gastado</span>
                    <strong class="block text-lg text-blue-300">$${detalles.total_gastado.toFixed(2)}</strong>
                </div>
            </div>
            <div class="space-y-2 max-h-96 overflow-y-auto">
                ${detalles.ordenes.map(o => `
                    <div class="bg-[#131c2e] border border-slate-800 rounded-lg p-3">
                        <div class="flex justify-between">
                            <span class="text-white font-bold">${escaparHTML(obtenerFolioOrden(o))}</span>
                            <span class="text-slate-400 text-xs">${new Date(o.fecha).toLocaleDateString()}</span>
                        </div>
                        <span class="text-slate-400 text-xs">${escaparHTML(o.marca)} ${escaparHTML(o.modelo)} - ${escaparHTML(o.falla)}</span>
                        <div class="mt-2 flex justify-between">
                            <span class="text-slate-400 text-xs">Estado: <strong class="${o.estado === 'Entregado' ? 'text-emerald-300' : 'text-amber-300'}">${escaparHTML(o.estado)}</strong></span>
                            <span class="text-white font-bold">$${Number(o.costo_estimado || 0).toFixed(2)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// ===== ANÁLISIS IA =====
async function analizarNegocioIA() {
    const [ordenes, inventario, caja] = await Promise.all([
        ipc ? ipc.invoke('get-ordenes') : JSON.parse(localStorage.getItem('pw_ordenes') || '[]'),
        leerModulo('inventario'),
        leerModulo('caja')
    ]);
    
    const hoy = new Date();
    const hace30dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);
    const hace60dias = new Date(hoy.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    const ordenesEstesMes = ordenes.filter(o => new Date(o.fecha) >= hace30dias);
    const ordenesPeriodoAnterior = ordenes.filter(o => {
        const fecha = new Date(o.fecha);
        return fecha >= hace60dias && fecha < hace30dias;
    });
    const ingresos = caja.filter(m => m.tipo === 'ingreso' && new Date(m.fecha) >= hace30dias).reduce((sum, m) => sum + m.monto, 0);
    
    const serviciosMasVendidos = {};
    ordenesEstesMes.forEach(o => {
        const tipo = o.falla || 'Otro';
        serviciosMasVendidos[tipo] = (serviciosMasVendidos[tipo] || 0) + 1;
    });
    const topServicio = Object.entries(serviciosMasVendidos).sort((a, b) => b[1] - a[1])[0];
    
    const partesBajas = inventario.filter(item => Number(item.stock) <= Number(item.minimo));
    
    return {
        total_reparaciones: ordenesEstesMes.length,
        cambio_vs_anterior: `${ordenesPeriodoAnterior.length ? (((ordenesEstesMes.length - ordenesPeriodoAnterior.length) / ordenesPeriodoAnterior.length) * 100).toFixed(0) : (ordenesEstesMes.length ? 100 : 0)}% vs. periodo anterior`,
        ingresos_mes: ingresos,
        servicio_top: topServicio ? topServicio[0] : 'N/A',
        partes_bajas: partesBajas.length,
        recomendaciones: [
            partesBajas.length > 0 ? `Reordenar ${partesBajas.length} partes: ${partesBajas.map(p => p.nombre).slice(0, 3).join(', ')}` : 'Inventario bien',
            topServicio ? `El servicio '${topServicio[0]}' es tu más rentable` : 'Sin datos',
            'Revisa las garantías vencidas'
        ]
    };
}

async function mostrarAnalisisIA() {
    const analisis = await analizarNegocioIA();
    const contenedor = document.getElementById('ia-analisis');
    if (!contenedor) return;
    
    contenedor.innerHTML = `
        <div class="bg-[#131c2e] border border-slate-800 rounded-xl p-4 mb-4">
            <div class="text-sm text-slate-400 mb-2"><strong>🤖 Asistente de Negocio IA</strong></div>
            <div class="text-white text-xs leading-relaxed">
                <p class="mb-2"><strong>Estado de los últimos 30 días:</strong> Has registrado <strong class="text-emerald-300">${analisis.total_reparaciones}</strong> reparaciones (${analisis.cambio_vs_anterior}), con ingresos de <strong class="text-emerald-300">$${analisis.ingresos_mes.toFixed(2)}</strong>.</p>
                <p class="mb-2"><strong>Servicio top:</strong> <strong class="text-blue-300">${escaparHTML(analisis.servicio_top)}</strong> es tu más rentable este mes.</p>
                <p><strong>Alertas:</strong>
                    ${analisis.recomendaciones.map(r => `<br/>• ${escaparHTML(r)}`).join('')}
                </p>
            </div>
        </div>
    `;
}

async function preguntarIA() {
    const entrada = document.getElementById('ia-pregunta');
    const salida = document.getElementById('ia-respuesta');
    const pregunta = String(entrada?.value || '').trim().toLowerCase();
    if (!pregunta || !salida) return;
    salida.textContent = 'Analizando los datos de esta sucursal...';
    try {
        const [ordenes, inventario, caja] = await Promise.all([
            ipc ? ipc.invoke('get-ordenes') : JSON.parse(localStorage.getItem('pw_ordenes') || '[]'),
            leerModulo('inventario'),
            leerModulo('caja')
        ]);
        const bajoStock = inventario.filter(item => Number(item.stock) <= Number(item.minimo));
        const ingresos = caja.filter(item => item.tipo === 'ingreso').reduce((total, item) => total + Number(item.monto || 0), 0);
        const abiertas = ordenes.filter(item => !['Entregado', 'Cancelado'].includes(item.estado)).length;
        let respuesta = `Esta sucursal tiene ${ordenes.length} órdenes, ${abiertas} abiertas, ${inventario.length} productos y $${ingresos.toFixed(2)} de ingresos registrados.`;
        if (pregunta.includes('reponer') || pregunta.includes('stock') || pregunta.includes('inventario')) respuesta = bajoStock.length ? `Debes revisar ${bajoStock.length} productos: ${bajoStock.slice(0, 5).map(item => `${item.nombre} (${item.stock}/${item.minimo})`).join(', ')}.` : 'No hay productos bajo el mínimo configurado.';
        else if (pregunta.includes('orden') || pregunta.includes('reparación') || pregunta.includes('reparacion')) respuesta = `Hay ${abiertas} órdenes abiertas. ${abiertas ? 'Prioriza las que estén esperando refacción o tengan mayor antigüedad.' : 'No tienes órdenes pendientes.'}`;
        else if (pregunta.includes('ingreso') || pregunta.includes('venta') || pregunta.includes('dinero')) respuesta = `Los ingresos registrados en caja suman $${ingresos.toFixed(2)}. Revisa los movimientos por fecha para comparar periodos.`;
        salida.textContent = respuesta;
    } catch (error) {
        salida.textContent = `No se pudo analizar la información: ${error.message}`;
    }
}

// ===== TICKET DESIGNER MEJORADO =====
async function abrirDisenoTicket() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
        <div class="bg-[#0d131f] border border-slate-800 rounded-2xl p-6 max-w-3xl max-h-[90vh] overflow-y-auto w-full">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-white">Diseñador de Tickets</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white text-2xl">&times;</button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div>
                        <label class="text-xs font-bold text-slate-300">Nombre del Taller</label>
                        <input id="ticket-nombre-taller" placeholder="Ej: TallerApp" class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-xs mt-1">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-slate-300">RIF/RFC</label>
                        <input id="ticket-rif" placeholder="Ej: J-123456789-0" class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-xs mt-1">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-slate-300">Dirección</label>
                        <input id="ticket-direccion" placeholder="Ej: Calle Principal 123" class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-xs mt-1">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-slate-300">Teléfono</label>
                        <input id="ticket-telefono" placeholder="+58 123 456 7890" class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-xs mt-1">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-slate-300">Ancho del Ticket</label>
                        <select id="ticket-ancho" class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-xs mt-1">
                            <option value="58">58mm</option>
                            <option value="80">80mm</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-bold text-slate-300">Pie de Página</label>
                        <textarea id="ticket-footer" placeholder="Ej: Garantía 30 días en mano de obra" class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-xs mt-1 h-20"></textarea>
                    </div>
                    <button onclick="guardarDisenoTicket()" class="w-full bg-[#00ff66] text-black font-bold py-2 rounded-lg text-xs hover:bg-[#00e65c]">Guardar Diseño</button>
                </div>
                
                <div class="bg-[#131c2e] border border-slate-800 rounded-lg p-4">
                    <div class="text-[11px] text-slate-400 mb-2">Vista Previa:</div>
                    <div id="ticket-preview" class="bg-white text-black p-3 text-[9px] font-mono leading-tight max-w-[220px] mx-auto border-2 border-dashed border-slate-400 overflow-hidden">
                        <div class="text-center">
                            <strong id="prev-nombre">TallerApp</strong>
                            <div id="prev-rif" class="text-[8px]">J-123456789-0</div>
                            <div class="border-t border-black my-1"></div>
                            <div id="prev-direccion" class="text-[8px]">Calle Principal 123</div>
                            <div id="prev-telefono" class="text-[8px]">+58 123 456 7890</div>
                            <div class="border-t border-black my-1"></div>
                            <div>FOLIO: 001</div>
                            <div>FECHA: 28/08/2026</div>
                            <div>Cliente: Juan Pérez</div>
                            <div>Marca: Samsung</div>
                            <div>Falla: Pantalla rota</div>
                            <div class="border-t border-black my-1"></div>
                            <div><strong>$150.00</strong></div>
                            <div class="border-t border-black my-1"></div>
                            <div id="prev-footer" class="text-[8px] mt-1">Garantía 30 días en mano de obra</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('ticket-nombre-taller').addEventListener('input', (e) => {
        document.getElementById('prev-nombre').textContent = e.target.value || 'TallerApp';
    });
    document.getElementById('ticket-rif').addEventListener('input', (e) => {
        document.getElementById('prev-rif').textContent = e.target.value || 'J-123456789-0';
    });
    document.getElementById('ticket-direccion').addEventListener('input', (e) => {
        document.getElementById('prev-direccion').textContent = e.target.value || 'Calle Principal 123';
    });
    document.getElementById('ticket-telefono').addEventListener('input', (e) => {
        document.getElementById('prev-telefono').textContent = e.target.value || '+58 123 456 7890';
    });
    document.getElementById('ticket-footer').addEventListener('input', (e) => {
        document.getElementById('prev-footer').textContent = e.target.value || 'Garantía 30 días en mano de obra';
    });
}

async function guardarDisenoTicket() {
    const diseño = {
        id: Date.now(),
        nombre_taller: document.getElementById('ticket-nombre-taller').value,
        rif: document.getElementById('ticket-rif').value,
        direccion: document.getElementById('ticket-direccion').value,
        telefono: document.getElementById('ticket-telefono').value,
        ancho: document.getElementById('ticket-ancho').value,
        footer: document.getElementById('ticket-footer').value
    };
    
    (await leerModulo('diseños_tickets')).push(diseño);
    await guardarModulo('diseños_tickets');
    alert('Diseño de ticket guardado correctamente');
    document.querySelector('.fixed').remove();
}

// ===== MULTI-SUCURSAL =====
async function crearSucursal(datos) {
    const nombre = String(datos.nombre || '').trim();
    if (!nombre) throw new Error('Nombre de sucursal obligatorio');
    if (ipc) {
        const resultado = await ipc.invoke('add-sucursal', { nombre });
        return { id: Number(resultado.lastInsertRowid), nombre, activa: 1 };
    }
    const sucursales = JSON.parse(localStorage.getItem('pw_sucursales') || '[]');
    const sucursal = { id: Date.now(), nombre, direccion: String(datos.direccion || '').trim(), telefono: String(datos.telefono || '').trim(), gerente: String(datos.gerente || '').trim(), activa: true, fecha_creacion: new Date().toISOString() };
    sucursales.push(sucursal);
    localStorage.setItem('pw_sucursales', JSON.stringify(sucursales));
    return sucursal;
}

async function cargarSucursales() {
    const sucursales = ipc ? await ipc.invoke('get-sucursales') : JSON.parse(localStorage.getItem('pw_sucursales') || '[]');
    const contenedor = document.getElementById('lista-sucursales');
    if (!contenedor) return;
    
    if (!sucursales.length) {
        contenedor.innerHTML = '<p class="text-slate-500 italic text-xs">No hay sucursales registradas.</p>';
        return;
    }
    
    contenedor.innerHTML = `<table class="w-full text-left text-[11px] text-slate-300">
        <thead>
            <tr class="border-b border-slate-800 text-slate-400">
                <th class="py-2 pr-3">Nombre</th>
                <th class="py-2 pr-3">Ubicación</th>
                <th class="py-2 pr-3">Gerente</th>
                <th class="py-2 pr-3">Estado</th>
            </tr>
        </thead>
        <tbody>
            ${sucursales.map(s => `
                <tr class="border-b border-slate-800/60">
                    <td class="py-2 pr-3 text-white">${escaparHTML(s.nombre)}</td>
                    <td class="py-2 pr-3 text-slate-400 text-[10px]">${escaparHTML(s.direccion)}</td>
                    <td class="py-2 pr-3">${escaparHTML(s.gerente)}</td>
                    <td class="py-2 pr-3">${s.activa ? '<span class="text-emerald-300">Activa</span>' : '<span class="text-rose-300">Inactiva</span>'}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}
