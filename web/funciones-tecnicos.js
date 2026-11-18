// ===== ASIGNACIÓN DE TÉCNICOS A ÓRDENES =====

async function cargarTecnicosEnSelect() {
    const tecnicos = await leerModulo('tecnicos');
    const select = document.getElementById('rep-tecnico');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Seleccionar Técnico --</option>';
    const activosTecnicos = tecnicos.filter(t => t.activo);
    
    if (!activosTecnicos.length) {
        select.innerHTML += '<option disabled>No hay técnicos disponibles</option>';
        return;
    }
    
    activosTecnicos.forEach(tecnico => {
        select.innerHTML += `<option value="${Number(tecnico.id)}">${escaparHTML(tecnico.nombre)} (${escaparHTML(tecnico.especialidad)})</option>`;
    });
}

async function obtenerNombreTecnico(tecnicoId) {
    if (!tecnicoId) return 'Sin asignar';
    const tecnicos = await leerModulo('tecnicos');
    const tecnico = tecnicos.find(t => String(t.id) === String(tecnicoId));
    return tecnico ? tecnico.nombre : 'Técnico desconocido';
}

async function reasignarTecnico(ordenId) {
    const ordenes = ipc ? await ipc.invoke('get-ordenes') : JSON.parse(localStorage.getItem('pw_ordenes') || '[]');
    const orden = ordenes.find(o => String(o.id) === String(ordenId));
    if (!orden) return alert('Orden no encontrada');
    
    const tecnicos = await leerModulo('tecnicos');
    const activosTecnicos = tecnicos.filter(t => t.activo);
    
    if (!activosTecnicos.length) return alert('No hay técnicos disponibles');
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
        <div class="bg-[#0d131f] border border-slate-800 rounded-2xl p-6 w-full max-w-sm">
            <h3 class="text-lg font-bold text-white mb-4">Reasignar Técnico</h3>
            <div class="mb-4">
                <label class="text-xs font-bold text-slate-300 block mb-2">Orden: ${escaparHTML(obtenerFolioOrden(orden))}</label>
                <p class="text-xs text-slate-400">${escaparHTML(orden.marca)} ${escaparHTML(orden.modelo)} - ${escaparHTML(orden.falla)}</p>
                <p class="text-xs text-slate-500 mt-1">Técnico actual: ${escaparHTML(await obtenerNombreTecnico(orden.tecnico))}</p>
            </div>
            <div class="mb-4">
                <label class="text-xs font-bold text-slate-300 block mb-2">Nuevo Técnico</label>
                <select id="modal-tecnico-select" class="w-full bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white text-xs">
                    <option value="">-- Seleccionar --</option>
                    ${activosTecnicos.map(t => `<option value="${Number(t.id)}">${escaparHTML(t.nombre)}</option>`).join('')}
                </select>
            </div>
            <div class="flex gap-2">
                <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-slate-700 text-white py-2 rounded-lg text-xs hover:bg-slate-600">Cancelar</button>
                <button onclick="confirmarReasignacion(${Number(ordenId)})" class="flex-1 bg-[#00e65c] text-black font-bold py-2 rounded-lg text-xs hover:bg-[#00ff66]">Confirmar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function confirmarReasignacion(ordenId) {
    const nuevoTecnicoId = document.getElementById('modal-tecnico-select').value;
    if (!nuevoTecnicoId) return alert('Selecciona un técnico');
    
    const ordenes = ipc ? await ipc.invoke('get-ordenes') : JSON.parse(localStorage.getItem('pw_ordenes') || '[]');
    const orden = ordenes.find(o => String(o.id) === String(ordenId));
    
    if (orden) {
        const tecnicoAnterior = orden.tecnico;
        orden.tecnico = nuevoTecnicoId;
        orden.historial_tecnicos = orden.historial_tecnicos || [];
        orden.historial_tecnicos.push({
            fecha: new Date().toISOString(),
            tecnico_anterior: tecnicoAnterior,
            tecnico_nuevo: nuevoTecnicoId
        });
        
        if (ipc) {
            await ipc.invoke('update-orden', { id: ordenId, datos: orden });
        } else {
            localStorage.setItem('pw_ordenes', JSON.stringify(ordenes));
        }
        
        document.querySelector('.fixed').remove();
        cargarOrdenes();
        alert('Técnico reasignado correctamente');
    }
}

async function mostrarInfoTecnico(tecnicoId) {
    const tecnico = (await leerModulo('tecnicos')).find(t => String(t.id) === String(tecnicoId));
    if (!tecnico) return;
    
    let ordenes = ipc ? await ipc.invoke('get-ordenes') : JSON.parse(localStorage.getItem('pw_ordenes') || '[]');
    const ordenesTecnico = ordenes.filter(o => String(o.tecnico) === String(tecnicoId));
    
    const completadas = ordenesTecnico.filter(o => o.estado === 'Entregado').length;
    const pendientes = ordenesTecnico.filter(o => ['Recibido', 'En Diagnóstico', 'En Reparación', 'Listo'].includes(o.estado)).length;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
        <div class="bg-[#0d131f] border border-slate-800 rounded-2xl p-6 w-full max-w-md">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-bold text-white">${escaparHTML(tecnico.nombre)}</h3>
                    <p class="text-xs text-slate-400">${escaparHTML(tecnico.especialidad)}</p>
                </div>
                <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white text-2xl">&times;</button>
            </div>
            
            <div class="grid grid-cols-3 gap-3 mb-4">
                <div class="bg-[#131c2e] border border-slate-800 rounded-lg p-3 text-center">
                    <div class="text-xs text-slate-400">Total Órdenes</div>
                    <strong class="block text-lg text-white mt-1">${ordenesTecnico.length}</strong>
                </div>
                <div class="bg-[#131c2e] border border-slate-800 rounded-lg p-3 text-center">
                    <div class="text-xs text-slate-400">Completadas</div>
                    <strong class="block text-lg text-emerald-300 mt-1">${completadas}</strong>
                </div>
                <div class="bg-[#131c2e] border border-slate-800 rounded-lg p-3 text-center">
                    <div class="text-xs text-slate-400">En Progreso</div>
                    <strong class="block text-lg text-amber-300 mt-1">${pendientes}</strong>
                </div>
            </div>
            
            <div class="mb-4">
                <h4 class="text-xs font-bold text-slate-300 mb-2">Órdenes Actuales</h4>
                <div class="max-h-48 overflow-y-auto space-y-1">
                    ${ordenesTecnico.slice(0, 10).map(o => `
                        <div class="bg-[#131c2e] border border-slate-800 rounded-lg p-2">
                            <div class="flex justify-between">
                                <span class="text-[11px] text-white font-bold">${escaparHTML(obtenerFolioOrden(o))}</span>
                                <span class="text-[10px] ${o.estado === 'Entregado' ? 'text-emerald-300' : 'text-amber-300'}">${escaparHTML(o.estado || 'Pendiente')}</span>
                            </div>
                            <p class="text-[10px] text-slate-500">${escaparHTML(o.marca)} ${escaparHTML(o.modelo)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <button onclick="this.closest('.fixed').remove()" class="w-full bg-slate-700 text-white py-2 rounded-lg text-xs hover:bg-slate-600">Cerrar</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Integración con abrirModalReparacion
(function() {
    const originalAbrirModal = window.abrirModalReparacion;
    window.abrirModalReparacion = async function() {
        await cargarTecnicosEnSelect();
        return originalAbrirModal();
    };
})();
