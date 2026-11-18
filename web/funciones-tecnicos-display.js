// ===== POST-PROCESAMIENTO DE ÓRDENES CON TÉCNICOS =====

async function enriquecerOrdenesConTecnicos() {
    const tecnicos = await leerModulo('tecnicos');
    const tecnicoMap = new Map(tecnicos.map(t => [String(t.id), t.nombre]));
    
    // Buscar todos los elementos con datos de orden y agregar info de técnico
    const filas = document.querySelectorAll('[data-orden-id]');
    filas.forEach(async fila => {
        const ordenId = fila.getAttribute('data-orden-id');
        const tecnicoCell = fila.querySelector('[data-tecnico-cell]');
        
        if (tecnicoCell) {
            let ordenes = ipc ? await ipc.invoke('get-ordenes') : JSON.parse(localStorage.getItem('pw_ordenes') || '[]');
            const orden = ordenes.find(o => String(o.id) === String(ordenId));
            
            if (orden && orden.tecnico) {
                const nombreTecnico = tecnicoMap.get(String(orden.tecnico)) || 'Técnico desconocido';
                tecnicoCell.innerHTML = `
                    <div class="text-[11px] text-blue-300 font-medium">👨‍🔧 ${escaparHTML(nombreTecnico)}</div>
                    <button onclick="reasignarTecnico(${Number(ordenId)})" class="text-[10px] px-1.5 py-0.5 mt-1 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/40">Reasignar</button>
                `;
            }
        }
    });
}

// Esperar a que funciones-nuevas y funciones-tecnicos estén cargadas
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(enriquecerOrdenesConTecnicos, 100);
});

// También ejecutar cuando se cargan órdenes
const originalCargarOrdenes = window.cargarOrdenes;
if (originalCargarOrdenes) {
    window.cargarOrdenes = async function() {
        const result = await originalCargarOrdenes.apply(this, arguments);
        setTimeout(enriquecerOrdenesConTecnicos, 50);
        return result;
    };
}
