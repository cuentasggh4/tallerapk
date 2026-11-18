// ===== DASHBOARD DE TÉCNICOS EN TIEMPO REAL =====

async function mostrarDashboardTecnicos() {
    const tecnicos = await leerModulo('tecnicos');
    const activosTecnicos = tecnicos.filter(t => t.activo);
    
    if (!activosTecnicos.length) return;
    
    let ordenes = ipc ? await ipc.invoke('get-ordenes') : JSON.parse(localStorage.getItem('pw_ordenes') || '[]');
    
    const dashboardHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            ${activosTecnicos.map(tecnico => {
                const ordenesTec = ordenes.filter(o => String(o.tecnico) === String(tecnico.id) && !['Entregado', 'Cancelado'].includes(o.estado));
                const completadas = ordenes.filter(o => String(o.tecnico) === String(tecnico.id) && o.estado === 'Entregado').length;
                
                return `
                    <div class="bg-[#131c2e] border border-slate-800 rounded-lg p-3 cursor-pointer hover:border-[#00ff66]/50 transition" onclick="mostrarInfoTecnico(${Number(tecnico.id)})">
                        <div class="flex items-start justify-between">
                            <div>
                                <h4 class="text-sm font-bold text-white">${escaparHTML(tecnico.nombre)}</h4>
                                <p class="text-[11px] text-slate-400">${escaparHTML(tecnico.especialidad)}</p>
                            </div>
                            <div class="text-2xl">👨‍🔧</div>
                        </div>
                        <div class="mt-3 pt-3 border-t border-slate-700 grid grid-cols-2 gap-2">
                            <div>
                                <span class="text-[10px] text-slate-400">En Proceso</span>
                                <strong class="block text-lg text-amber-300">${ordenesTec.length}</strong>
                            </div>
                            <div>
                                <span class="text-[10px] text-slate-400">Completadas</span>
                                <strong class="block text-lg text-emerald-300">${completadas}</strong>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    const contenedor = document.getElementById('dashboard-tecnicos');
    if (contenedor) {
        contenedor.innerHTML = dashboardHTML;
    }
}

// Hook para cargarDashboard
(function() {
    const originalCargarDashboard = window.cargarDashboard;
    window.cargarDashboard = async function() {
        const result = await originalCargarDashboard.apply(this, arguments);
        try {
            // Crear contenedor si no existe
            if (!document.getElementById('dashboard-tecnicos')) {
                const dashboardMetricas = document.getElementById('dashboard-metricas');
                if (dashboardMetricas) {
                    const div = document.createElement('div');
                    div.id = 'dashboard-tecnicos';
                    div.className = 'col-span-full mt-4';
                    dashboardMetricas.parentNode.insertBefore(div, dashboardMetricas.nextSibling);
                }
            }
            await mostrarDashboardTecnicos();
        } catch (e) {
            console.log('Dashboard técnicos no disponible:', e);
        }
        return result;
    };
})();

// Vista rápida al pasar mouse en select de técnico
document.addEventListener('change', function(e) {
    if (e.target.id === 'rep-tecnico') {
        const tecnicoId = e.target.value;
        if (!tecnicoId) return;
        
        (async () => {
            const tecnicos = await leerModulo('tecnicos');
            const tecnico = tecnicos.find(t => String(t.id) === String(tecnicoId));
            if (tecnico) {
                let ordenes = ipc ? await ipc.invoke('get-ordenes') : JSON.parse(localStorage.getItem('pw_ordenes') || '[]');
                const ordenesTec = ordenes.filter(o => String(o.tecnico) === String(tecnicoId) && !['Entregado', 'Cancelado'].includes(o.estado));
                console.log(`${tecnico.nombre} (${tecnico.especialidad}): ${ordenesTec.length} órdenes activas`);
            }
        })();
    }
}, true);
