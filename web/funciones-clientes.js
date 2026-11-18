// ===== GESTIÓN DE CLIENTES: CRUD COMPLETO =====

/**
 * Cargar y mostrar lista de clientes con búsqueda y filtros
 */
async function cargarListaClientes(filtro = '') {
    let clientes = ipc ? await ipc.invoke('get-clientes') : JSON.parse(localStorage.getItem('pw_clientes') || '[]');
    
    // Filtrar por nombre o teléfono
    if (filtro.trim()) {
        const busqueda = filtro.toLowerCase();
        clientes = clientes.filter(c => 
            c.nombre.toLowerCase().includes(busqueda) || 
            c.telefono.includes(busqueda) ||
            (c.email && c.email.toLowerCase().includes(busqueda))
        );
    }
    
    // Agregar contador de órdenes a cada cliente
    let ordenes = ipc ? await ipc.invoke('get-ordenes') : JSON.parse(localStorage.getItem('pw_ordenes') || '[]');
    
    clientes = clientes.map(cliente => ({
        ...cliente,
        totalOrdenes: ordenes.filter(o => o.cliente_id === cliente.id || o.cliente === cliente.nombre).length,
        ultimaOrden: ordenes
            .filter(o => o.cliente_id === cliente.id || o.cliente === cliente.nombre)
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0]?.fecha
    }));
    
    // Mostrar tabla de clientes
    const contenedor = document.getElementById('clientes-tabla');
    if (!contenedor) return;
    
    if (clientes.length === 0) {
        contenedor.innerHTML = '<div class="text-center text-slate-400 py-8">No hay clientes registrados</div>';
        return;
    }
    
    contenedor.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-[#0d131f] border-b border-slate-700">
                    <tr>
                        <th class="px-4 py-3 text-left font-bold">Nombre</th>
                        <th class="px-4 py-3 text-left font-bold">Teléfono</th>
                        <th class="px-4 py-3 text-left font-bold">Email</th>
                        <th class="px-4 py-3 text-center font-bold">Órdenes</th>
                        <th class="px-4 py-3 text-left font-bold">Última Orden</th>
                        <th class="px-4 py-3 text-center font-bold">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${clientes.map(cliente => `
                        <tr class="border-b border-slate-800 hover:bg-[#131c2e] transition">
                            <td class="px-4 py-3 text-white">${escaparHTML(cliente.nombre)}</td>
                            <td class="px-4 py-3 text-slate-300">${escaparHTML(cliente.telefono)}</td>
                            <td class="px-4 py-3 text-slate-400 text-xs">${escaparHTML(cliente.email || '-')}</td>
                            <td class="px-4 py-3 text-center">
                                <span class="bg-[#1e293b] text-[#00ff66] px-3 py-1 rounded text-xs font-bold">
                                    ${cliente.totalOrdenes}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-slate-400 text-xs">
                                ${cliente.ultimaOrden ? new Date(cliente.ultimaOrden).toLocaleDateString('es-MX') : '-'}
                            </td>
                            <td class="px-4 py-3 text-center flex gap-2 justify-center">
                                <button onclick="abrirEditarCliente(${cliente.id})" class="text-blue-400 hover:text-blue-300 text-xs" title="Editar">
                                    ✎
                                </button>
                                <button onclick="abrirHistorialCliente(${cliente.id})" class="text-amber-400 hover:text-amber-300 text-xs" title="Historial">
                                    📋
                                </button>
                                <button onclick="eliminarClienteConfirm(${Number(cliente.id)})" class="text-red-400 hover:text-red-300 text-xs" title="Eliminar">
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Crear nuevo cliente con validaciones
 */
async function crearNuevoCliente() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
        <div class="bg-[#0d131f] border border-slate-800 rounded-2xl p-6 w-full max-w-md">
            <h3 class="text-lg font-bold text-white mb-4">Nuevo Cliente</h3>
            
            <div class="space-y-3">
                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1">Nombre *</label>
                    <input id="nuevo-nombre" type="text" placeholder="Nombre completo" 
                        class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                </div>
                
                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1">Teléfono *</label>
                    <input id="nuevo-telefono" type="tel" placeholder="+1234567890" 
                        class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                </div>
                
                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1">Email</label>
                    <input id="nuevo-email" type="email" placeholder="correo@ejemplo.com" 
                        class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                </div>
            </div>
            
            <div class="flex gap-2 mt-6">
                <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-slate-700 text-white py-2 rounded-lg text-xs hover:bg-slate-600">
                    Cancelar
                </button>
                <button onclick="guardarNuevoCliente()" class="flex-1 bg-[#00e65c] text-black font-bold py-2 rounded-lg text-xs hover:bg-[#00ff66]">
                    Guardar
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('nuevo-nombre').focus();
}

/**
 * Guardar nuevo cliente en BD
 */
async function guardarNuevoCliente() {
    const nombre = document.getElementById('nuevo-nombre')?.value.trim();
    const telefono = document.getElementById('nuevo-telefono')?.value.trim();
    const email = document.getElementById('nuevo-email')?.value.trim();
    
    if (!nombre || !telefono) {
        alert('Nombre y teléfono son obligatorios');
        return;
    }
    
    try {
        const cliente = { nombre, telefono, email };
        if (ipc) {
            await ipc.invoke('add-cliente', cliente);
        } else {
            const clientes = JSON.parse(localStorage.getItem('pw_clientes') || '[]');
            cliente.id = Math.max(0, ...clientes.map(c => c.id || 0)) + 1;
            cliente.fecha_registro = new Date().toISOString();
            clientes.push(cliente);
            localStorage.setItem('pw_clientes', JSON.stringify(clientes));
        }
        
        document.querySelector('.fixed').remove();
        await cargarListaClientes();
        alert('Cliente guardado exitosamente');
    } catch (error) {
        alert(`Error al guardar: ${error.message}`);
    }
}

/**
 * Abrir modal de edición de cliente
 */
async function abrirEditarCliente(clienteId) {
    let clientes = ipc ? await ipc.invoke('get-clientes') : JSON.parse(localStorage.getItem('pw_clientes') || '[]');
    const cliente = clientes.find(c => c.id === clienteId);
    
    if (!cliente) {
        alert('Cliente no encontrado');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
        <div class="bg-[#0d131f] border border-slate-800 rounded-2xl p-6 w-full max-w-md">
            <h3 class="text-lg font-bold text-white mb-4">Editar Cliente</h3>
            
            <div class="space-y-3">
                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1">Nombre *</label>
                    <input id="edit-nombre" type="text" value="${escaparHTML(cliente.nombre)}" 
                        class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                </div>
                
                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1">Teléfono *</label>
                    <input id="edit-telefono" type="tel" value="${escaparHTML(cliente.telefono)}" 
                        class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                </div>
                
                <div>
                    <label class="text-xs font-bold text-slate-300 block mb-1">Email</label>
                    <input id="edit-email" type="email" value="${escaparHTML(cliente.email || '')}" 
                        class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                </div>
                
                <div class="text-xs text-slate-500 pt-2">
                    <p>Registrado: ${new Date(cliente.fecha_registro).toLocaleDateString('es-MX')}</p>
                </div>
            </div>
            
            <div class="flex gap-2 mt-6">
                <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-slate-700 text-white py-2 rounded-lg text-xs hover:bg-slate-600">
                    Cancelar
                </button>
                <button onclick="guardarClienteEditado(${clienteId})" class="flex-1 bg-amber-500 text-white font-bold py-2 rounded-lg text-xs hover:bg-amber-600">
                    Actualizar
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

/**
 * Guardar cambios de cliente editado
 */
async function guardarClienteEditado(clienteId) {
    const nombre = document.getElementById('edit-nombre')?.value.trim();
    const telefono = document.getElementById('edit-telefono')?.value.trim();
    const email = document.getElementById('edit-email')?.value.trim();
    
    if (!nombre || !telefono) {
        alert('Nombre y teléfono son obligatorios');
        return;
    }
    
    try {
        const clienteActualizado = { nombre, telefono, email };
        if (ipc) {
            await ipc.invoke('update-cliente', { id: clienteId, ...clienteActualizado });
        } else {
            let clientes = JSON.parse(localStorage.getItem('pw_clientes') || '[]');
            const idx = clientes.findIndex(c => c.id === clienteId);
            if (idx >= 0) {
                clientes[idx] = { ...clientes[idx], ...clienteActualizado };
                localStorage.setItem('pw_clientes', JSON.stringify(clientes));
            }
        }
        
        document.querySelector('.fixed').remove();
        await cargarListaClientes();
        alert('Cliente actualizado exitosamente');
    } catch (error) {
        alert(`Error al actualizar: ${error.message}`);
    }
}

/**
 * Confirmar eliminación de cliente
 */
async function eliminarClienteConfirm(clienteId) {
    const clientes = ipc ? await ipc.invoke('get-clientes') : JSON.parse(localStorage.getItem('pw_clientes') || '[]');
    const nombreCliente = clientes.find(cliente => Number(cliente.id) === Number(clienteId))?.nombre || 'este cliente';
    if (!confirm(`¿Deseas eliminar a "${nombreCliente}"? Esta acción no se puede deshacer.`)) {
        return;
    }
    await eliminarCliente(clienteId, nombreCliente);
}

/**
 * Eliminar cliente
 */
async function eliminarCliente(clienteId, nombreCliente) {
    try {
        if (ipc) {
            await ipc.invoke('delete-cliente', clienteId);
        } else {
            let clientes = JSON.parse(localStorage.getItem('pw_clientes') || '[]');
            clientes = clientes.filter(c => c.id !== clienteId);
            localStorage.setItem('pw_clientes', JSON.stringify(clientes));
        }
        
        await cargarListaClientes();
        alert(`"${nombreCliente}" ha sido eliminado`);
    } catch (error) {
        alert(`Error al eliminar: ${error.message}`);
    }
}

/**
 * Buscar clientes en tiempo real
 */
function buscarClientes(event) {
    const filtro = event.target.value;
    cargarListaClientes(filtro);
}

/**
 * Abrir modal de historial completo del cliente
 */
async function abrirHistorialCliente(clienteId) {
    let clientes = ipc ? await ipc.invoke('get-clientes') : JSON.parse(localStorage.getItem('pw_clientes') || '[]');
    let ordenes = ipc ? await ipc.invoke('get-ordenes') : JSON.parse(localStorage.getItem('pw_ordenes') || '[]');
    
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return;
    
    // Obtener órdenes/reparaciones del cliente
    const reparaciones = ordenes.filter(o => o.cliente_id === clienteId || o.cliente === cliente.nombre);
    
    // Obtener compras/ventas (simuladas con datos de movimientos_caja)
    let compras = JSON.parse(localStorage.getItem('pw_compras') || '[]');
    const comprasCliente = compras.filter(c => c.cliente_id === clienteId || c.cliente === cliente.nombre);
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-[#0d131f] border border-slate-800 rounded-2xl p-6 w-full max-w-2xl my-8">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h3 class="text-lg font-bold text-white">${escaparHTML(cliente.nombre)}</h3>
                    <p class="text-xs text-slate-400">${escaparHTML(cliente.telefono)} | ${escaparHTML(cliente.email || 'Sin email')}</p>
                </div>
                <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white text-xl">✕</button>
            </div>
            
            <div class="space-y-6">
                <!-- Estadísticas -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-[#131c2e] border border-slate-700 rounded-lg p-3">
                        <p class="text-xs text-slate-400">Total Reparaciones</p>
                        <p class="text-xl font-bold text-[#00ff66]">${reparaciones.length}</p>
                    </div>
                    <div class="bg-[#131c2e] border border-slate-700 rounded-lg p-3">
                        <p class="text-xs text-slate-400">Total Compras</p>
                        <p class="text-xl font-bold text-amber-400">${comprasCliente.length}</p>
                    </div>
                </div>
                
                <!-- Historial de Reparaciones -->
                <div>
                    <h4 class="text-sm font-bold text-white mb-3">Historial de Reparaciones</h4>
                    <div class="space-y-2 max-h-64 overflow-y-auto">
                        ${reparaciones.length ? reparaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(rep => `
                            <div class="bg-[#131c2e] border border-slate-700 rounded-lg p-3 text-xs">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <p class="font-bold text-white">${obtenerFolioOrden(rep)} - ${rep.marca} ${rep.modelo}</p>
                                        <p class="text-slate-400">${rep.falla}</p>
                                        <p class="text-slate-500">Estado: <span class="text-[#00ff66]">${rep.estado}</span></p>
                                    </div>
                                    <span class="text-right">
                                        <p class="font-bold text-amber-400">$${Number(rep.costo_estimado || 0).toFixed(2)}</p>
                                        <p class="text-slate-400">${new Date(rep.fecha).toLocaleDateString('es-MX')}</p>
                                    </span>
                                </div>
                            </div>
                        `).join('') : '<p class="text-slate-400 text-center py-4">Sin reparaciones registradas</p>'}
                    </div>
                </div>
                
                <!-- Historial de Compras -->
                <div>
                    <h4 class="text-sm font-bold text-white mb-3">Historial de Compras</h4>
                    <div class="space-y-2 max-h-64 overflow-y-auto">
                        ${comprasCliente.length ? comprasCliente.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(compra => `
                            <div class="bg-[#131c2e] border border-slate-700 rounded-lg p-3 text-xs">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <p class="font-bold text-white">${compra.descripcion || compra.detalle}</p>
                                        <p class="text-slate-400">Cantidad: ${compra.cantidad || 1}</p>
                                    </div>
                                    <span class="text-right">
                                        <p class="font-bold text-emerald-400">$${Number(compra.total || 0).toFixed(2)}</p>
                                        <p class="text-slate-400">${new Date(compra.fecha).toLocaleDateString('es-MX')}</p>
                                    </span>
                                </div>
                            </div>
                        `).join('') : '<p class="text-slate-400 text-center py-4">Sin compras registradas</p>'}
                    </div>
                </div>
                
                <!-- Resumen de Gasto Total -->
                <div class="bg-[#131c2e] border border-[#00ff66]/30 rounded-lg p-4">
                    <div class="flex justify-between items-center">
                        <p class="text-sm font-bold text-white">Inversión Total</p>
                        <p class="text-2xl font-bold text-[#00ff66]">
                            $${(
                                reparaciones.reduce((sum, r) => sum + Number(r.costo_estimado || 0), 0) +
                                comprasCliente.reduce((sum, c) => sum + Number(c.total || 0), 0)
                            ).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="flex gap-2 mt-6">
                <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-slate-700 text-white py-2 rounded-lg text-xs hover:bg-slate-600">
                    Cerrar
                </button>
                <button onclick="crearReparacionDesdeCliente(${clienteId})" class="flex-1 bg-[#00ff66] text-black font-bold py-2 rounded-lg text-xs hover:bg-[#00e65c]">
                    Nueva Reparación
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

/**
 * Crear reparación desde el perfil del cliente
 */
async function crearReparacionDesdeCliente(clienteId) {
    let clientes = ipc ? await ipc.invoke('get-clientes') : JSON.parse(localStorage.getItem('pw_clientes') || '[]');
    const cliente = clientes.find(c => c.id === clienteId);
    
    if (!cliente) return;
    
    // Aquí se podría abrir el formulario de nueva reparación pre-completado con el cliente
    alert(`Crear reparación para: ${cliente.nombre}\n\nEsta funcionalidad se integrará con el formulario de reparaciones.`);
    document.querySelector('.fixed')?.remove();
}

// Hook para cargar lista de clientes cuando se abre la sección
window.cargarClientes = async function() {
    await cargarListaClientes();
};
