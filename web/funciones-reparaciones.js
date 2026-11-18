function obtenerRepuestosLocal() {
    try {
        return JSON.parse(localStorage.getItem('pw_repuestos') || '[]');
    } catch {
        return [];
    }
}

function guardarRepuestosLocal(items) {
    localStorage.setItem('pw_repuestos', JSON.stringify(items));
}

function obtenerTrabajosLocal() {
    try {
        return JSON.parse(localStorage.getItem('pw_trabajos') || '[]');
    } catch {
        return [];
    }
}

function guardarTrabajosLocal(items) {
    localStorage.setItem('pw_trabajos', JSON.stringify(items));
}

async function abrirDetalleReparacion(reparacionId) {
    const reparacion = (ipc ? await ipc.invoke('get-reparacion', reparacionId) : (ordenesBD.find(o => Number(o.id) === Number(reparacionId)) || null));
    if (!reparacion) {
        alert('No se encontró la reparación.');
        return;
    }

    const repuestos = ipc
        ? await ipc.invoke('obtener-repuestos', reparacionId)
        : obtenerRepuestosLocal().filter(item => Number(item.reparacion_id) === Number(reparacionId));
    const trabajos = ipc
        ? await ipc.invoke('obtener-trabajos', reparacionId)
        : obtenerTrabajosLocal().filter(item => Number(item.reparacion_id) === Number(reparacionId));
    const historial = ipc ? await ipc.invoke('obtener-historial-reparacion', reparacionId) : (reparacion.historial_estados || []);
    const inventario = ipc ? await ipc.invoke('get-inventario') : JSON.parse(localStorage.getItem('pw_inventario') || '[]');
    const modelosEquipo = [reparacion.modelo, `${reparacion.marca || ''} ${reparacion.modelo || ''}`]
        .map(normalizarClaveCompatibilidad)
        .filter(Boolean);
    const inventarioDisponible = inventario.filter(item => Number(item.stock) > 0);
    const inventarioCompatible = inventarioDisponible.filter(item => compatibilidadTieneEvidencia(item) && obtenerCompatibilidadesProducto(item).some(modelo => modelosEquipo.includes(modelo)));
    const idsCompatibles = new Set(inventarioCompatible.map(item => item.id));
    const inventarioRestante = inventarioDisponible.filter(item => !idsCompatibles.has(item.id));
    const gruposCompatibles = ['prueba', 'foro', 'catalogo'].map(nivel => ({
        etiqueta: obtenerEtiquetaNivelCompatibilidad(nivel),
        productos: inventarioCompatible.filter(item => item.compatibilidad_nivel === nivel)
    }));

    const totalRepuestos = repuestos.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
    const totalTrabajos = trabajos.reduce((sum, item) => sum + Number(item.precio_mano_obra || 0), 0);
    const costoTotal = totalRepuestos + totalTrabajos;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50';
    modal.dataset.modalReparacion = 'true';
    modal.innerHTML = `
        <div class="bg-[#0b101a] border border-slate-800 w-full max-w-5xl rounded-2xl max-h-[92vh] overflow-hidden shadow-2xl">
            <div class="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0e1626]">
                <div>
                    <div class="text-xs uppercase tracking-[0.2em] text-[#00ff66] font-bold">Reparación</div>
                    <div class="text-white font-bold text-lg">${escaparHTML(obtenerFolioOrden(reparacion))} · ${escaparHTML(reparacion.marca || '')} ${escaparHTML(reparacion.modelo || '')}</div>
                </div>
                <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white transition">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <div class="p-5 overflow-y-auto max-h-[calc(92vh-80px)]">
                <div class="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
                    <div class="space-y-5">
                        <div class="bg-[#0f1729] border border-slate-800 rounded-2xl p-4">
                            <div class="flex items-center justify-between gap-3 mb-3">
                                <h3 class="text-sm font-bold text-white">Resumen técnico</h3>
                                <select id="detalle-estado-select" class="bg-[#131c2e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs" onchange="actualizarEstadoDetalle(${reparacion.id}, this.value)">
                                    <option value="Pendiente" ${reparacion.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                                    <option value="En Diagnóstico" ${reparacion.estado === 'En Diagnóstico' ? 'selected' : ''}>En Diagnóstico</option>
                                    <option value="Esperando Refacción" ${reparacion.estado === 'Esperando Refacción' ? 'selected' : ''}>Esperando Refacción</option>
                                    <option value="Listo" ${reparacion.estado === 'Listo' ? 'selected' : ''}>Listo</option>
                                    <option value="Entregado" ${reparacion.estado === 'Entregado' ? 'selected' : ''}>Entregado</option>
                                    <option value="Cancelado" ${reparacion.estado === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                                </select>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                                <div><span class="text-slate-500">Cliente:</span> <span class="text-white font-semibold">${escaparHTML(reparacion.cliente_nombre || 'Sin cliente')}</span></div>
                                <div><span class="text-slate-500">Técnico:</span> <span class="text-white font-semibold">${escaparHTML(reparacion.tecnico || 'Técnico Principal')}</span></div>
                                <div><span class="text-slate-500">Falla:</span> <span class="text-white">${escaparHTML(reparacion.falla || 'Sin detalle')}</span></div>
                                <div><span class="text-slate-500">Diagnóstico:</span> <span class="text-white">${escaparHTML(reparacion.diagnostico || 'Sin diagnóstico')}</span></div>
                                <div><span class="text-slate-500">Accesorios:</span> <span class="text-white">${escaparHTML(reparacion.accesorios || 'Sin accesorios')}</span></div>
                                <div><span class="text-slate-500">IMEI:</span> <span class="text-white">${escaparHTML(reparacion.imei || 'N/A')}</span></div>
                            </div>
                        </div>

                        <div class="bg-[#0f1729] border border-slate-800 rounded-2xl p-4">
                            <h3 class="text-sm font-bold text-white mb-3">Agregar repuesto</h3>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <select id="det-repuesto-select" class="md:col-span-2 bg-[#131c2e] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs">
                                    <option value="">Selecciona un producto</option>
                                    ${gruposCompatibles.filter(grupo => grupo.productos.length).map(grupo => `<optgroup label="${escaparHTML(grupo.etiqueta)}">${grupo.productos.map(item => `<option value="${Number(item.id)}">${escaparHTML(item.nombre)} (${Number(item.stock)} disp.)</option>`).join('')}</optgroup>`).join('')}
                                    ${inventarioRestante.length ? `<optgroup label="Otras piezas disponibles">${inventarioRestante.map(item => `<option value="${Number(item.id)}">${escaparHTML(item.nombre)} (${Number(item.stock)} disp.)</option>`).join('')}</optgroup>` : ''}
                                    ${inventarioDisponible.length ? '' : '<option disabled>No hay piezas con existencia</option>'}
                                </select>
                                <input id="det-repuesto-cantidad" type="number" min="1" value="1" class="bg-[#131c2e] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs" placeholder="Cantidad" />
                                <input id="det-repuesto-precio" type="number" min="0" step="0.01" value="0" class="bg-[#131c2e] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs" placeholder="Precio" />
                            </div>
                            <button onclick="agregarRepuestoDetalle(${reparacion.id})" class="mt-3 bg-[#00e65c] hover:bg-[#00ff66] text-black font-bold px-4 py-2 rounded-lg text-xs">Agregar repuesto</button>

                            <div class="mt-4 space-y-2">
                                ${repuestos.length ? repuestos.map(item => `
                                    <div class="flex items-center justify-between bg-[#131c2e] border border-slate-700 rounded-lg p-2 text-xs text-slate-300">
                                        <div>
                                            <div class="text-white font-semibold">${escaparHTML(item.nombre)}</div>
                                            <div>${item.cantidad} x $${Number(item.precio_unitario || 0).toFixed(2)}</div>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-[#00ff66] font-bold">$${Number(item.subtotal || 0).toFixed(2)}</span>
                                            <button onclick="eliminarRepuestoDetalle(${item.id}, ${reparacion.id})" class="text-red-400 hover:text-red-300">✕</button>
                                        </div>
                                    </div>
                                `).join('') : '<p class="text-slate-400 text-xs">Sin repuestos agregados.</p>'}
                            </div>
                        </div>

                        <div class="bg-[#0f1729] border border-slate-800 rounded-2xl p-4">
                            <h3 class="text-sm font-bold text-white mb-3">Trabajos realizados</h3>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <input id="det-trabajo-desc" placeholder="Descripción" class="md:col-span-2 bg-[#131c2e] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs" />
                                <input id="det-trabajo-tecnico" placeholder="Técnico" class="bg-[#131c2e] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs" />
                                <input id="det-trabajo-horas" type="number" min="0" step="0.5" value="0" class="bg-[#131c2e] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs" placeholder="Horas" />
                                <input id="det-trabajo-precio" type="number" min="0" step="0.01" value="0" class="md:col-span-2 bg-[#131c2e] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs" placeholder="Precio mano de obra" />
                            </div>
                            <button onclick="agregarTrabajoDetalle(${reparacion.id})" class="mt-3 bg-blue-500 hover:bg-blue-400 text-white font-bold px-4 py-2 rounded-lg text-xs">Agregar trabajo</button>

                            <div class="mt-4 space-y-2">
                                ${trabajos.length ? trabajos.map(item => `
                                    <div class="flex items-center justify-between bg-[#131c2e] border border-slate-700 rounded-lg p-2 text-xs text-slate-300">
                                        <div>
                                            <div class="text-white font-semibold">${escaparHTML(item.descripcion)}</div>
                                            <div>${escaparHTML(item.tecnico || 'Sin técnico')} · ${Number(item.tiempo_horas || 0).toFixed(1)} h</div>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-blue-300 font-bold">$${Number(item.precio_mano_obra || 0).toFixed(2)}</span>
                                            <button onclick="eliminarTrabajoDetalle(${item.id}, ${reparacion.id})" class="text-red-400 hover:text-red-300">✕</button>
                                        </div>
                                    </div>
                                `).join('') : '<p class="text-slate-400 text-xs">Sin trabajos agregados.</p>'}
                            </div>
                        </div>
                    </div>

                    <div class="space-y-5">
                        <div class="bg-[#0f1729] border border-slate-800 rounded-2xl p-4">
                            <h3 class="text-sm font-bold text-white mb-3">Costo total</h3>
                            <div class="space-y-2 text-xs text-slate-300">
                                <div class="flex justify-between"><span>Repuestos</span><span class="text-[#00ff66]">$${totalRepuestos.toFixed(2)}</span></div>
                                <div class="flex justify-between"><span>Mano de obra</span><span class="text-blue-300">$${totalTrabajos.toFixed(2)}</span></div>
                                <div class="flex justify-between border-t border-slate-700 pt-2 mt-2"><span class="text-white font-bold">Total</span><span class="text-white font-bold">$${costoTotal.toFixed(2)}</span></div>
                            </div>
                        </div>

                        <div class="bg-[#0f1729] border border-slate-800 rounded-2xl p-4">
                            <h3 class="text-sm font-bold text-white mb-3">Historial</h3>
                            <div class="space-y-2">
                                ${historial.length ? historial.map(item => `
                                    <div class="border border-slate-700 rounded-lg p-2 text-[11px] text-slate-300 bg-[#131c2e]">
                                        <div class="flex justify-between gap-2"><span class="font-bold text-white">${escaparHTML(item.estado_anterior)} → ${escaparHTML(item.estado_nuevo)}</span><span>${new Date(item.fecha).toLocaleString('es-MX')}</span></div>
                                        ${item.nota ? `<div class="mt-1 text-slate-400">${escaparHTML(item.nota)}</div>` : ''}
                                    </div>
                                `).join('') : '<p class="text-slate-400 text-xs">Sin historial.</p>'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    lucide.createIcons();
}

async function actualizarEstadoDetalle(reparacionId, nuevoEstado) {
    try {
        const ordenActual = ordenesBD.find(orden => Number(orden.id) === Number(reparacionId));
        const estadoAnterior = ordenActual?.estado || 'Pendiente';
        if (nuevoEstado === 'Entregado' && estadoAnterior !== 'Entregado') return abrirCobroEntrega(reparacionId);
        if (ipc) {
            await ipc.invoke('cambiar-estado-reparacion', reparacionId, nuevoEstado, 'Cambio desde detalle de reparación');
        } else {
            const orden = ordenActual;
            if (orden) {
                orden.estado = nuevoEstado;
                orden.historial_estados = orden.historial_estados || [];
                if (estadoAnterior !== nuevoEstado) orden.historial_estados.push({ estado_anterior: estadoAnterior, estado_nuevo: nuevoEstado, fecha: new Date().toISOString(), nota: 'Cambio desde detalle de reparación' });
                localStorage.setItem('pw_ordenes', JSON.stringify(ordenesBD));
            }
        }
        await cargarOrdenes();
        if (estadoAnterior !== nuevoEstado && !ipc && confirm('Estado actualizado. ¿Preparar el aviso para el cliente por WhatsApp?')) abrirWhatsAppEstadoOrden(reparacionId);
        alert('Estado actualizado');
    } catch (error) {
        alert(`No se pudo actualizar el estado: ${error.message}`);
    }
}

async function agregarRepuestoDetalle(reparacionId) {
    const productoId = document.getElementById('det-repuesto-select')?.value;
    const cantidad = Number(document.getElementById('det-repuesto-cantidad')?.value || 0);
    const precio = Number(document.getElementById('det-repuesto-precio')?.value || 0);

    if (!productoId || cantidad <= 0) {
        alert('Debes seleccionar un producto y una cantidad válida.');
        return;
    }

    try {
        if (ipc) {
            await ipc.invoke('agregar-repuesto', reparacionId, Number(productoId), Number(cantidad), Number(precio));
        } else {
            const inventarioLocal = JSON.parse(localStorage.getItem('pw_inventario') || '[]');
            const producto = inventarioLocal.find(item => Number(item.id) === Number(productoId));
            if (!producto) throw new Error('Producto no encontrado');
            if (cantidad > Number(producto.stock || 0)) throw new Error('Stock insuficiente');
            producto.stock = Math.max(0, Number(producto.stock || 0) - cantidad);
            localStorage.setItem('pw_inventario', JSON.stringify(inventarioLocal));

            const repuestosLocal = obtenerRepuestosLocal();
            repuestosLocal.push({
                id: Date.now(),
                reparacion_id: Number(reparacionId),
                producto_id: Number(productoId),
                nombre: producto.nombre,
                cantidad,
                precio_unitario: Number(precio),
                subtotal: Number(precio) * cantidad,
                fecha: new Date().toISOString()
            });
            guardarRepuestosLocal(repuestosLocal);
        }
        const modalActual = document.querySelector('[data-modal-reparacion="true"]');
        if (modalActual) modalActual.remove();
        await abrirDetalleReparacion(reparacionId);
        await cargarOrdenes();
    } catch (error) {
        alert(`No se pudo agregar el repuesto: ${error.message}`);
    }
}

async function eliminarRepuestoDetalle(detalleId, reparacionId) {
    try {
        if (ipc) {
            await ipc.invoke('eliminar-repuesto', detalleId);
        } else {
            const repuestos = obtenerRepuestosLocal();
            const detalle = repuestos.find(item => Number(item.id) === Number(detalleId));
            if (!detalle) throw new Error('Detalle de reparación no encontrado');
            const inventarioLocal = JSON.parse(localStorage.getItem('pw_inventario') || '[]');
            const producto = inventarioLocal.find(item => Number(item.id) === Number(detalle.producto_id));
            if (producto) {
                producto.stock = Number(producto.stock || 0) + Number(detalle.cantidad || 0);
                localStorage.setItem('pw_inventario', JSON.stringify(inventarioLocal));
            }
            guardarRepuestosLocal(repuestos.filter(item => Number(item.id) !== Number(detalleId)));
        }
        alert('Repuesto eliminado');
        const modalActual = document.querySelector('[data-modal-reparacion="true"]');
        if (modalActual) modalActual.remove();
        if (reparacionId) await abrirDetalleReparacion(reparacionId);
        await cargarOrdenes();
    } catch (error) {
        alert(`No se pudo eliminar el repuesto: ${error.message}`);
    }
}

async function agregarTrabajoDetalle(reparacionId) {
    const descripcion = document.getElementById('det-trabajo-desc')?.value.trim();
    const tecnico = document.getElementById('det-trabajo-tecnico')?.value.trim();
    const horas = Number(document.getElementById('det-trabajo-horas')?.value || 0);
    const precio = Number(document.getElementById('det-trabajo-precio')?.value || 0);

    if (!descripcion) {
        alert('La descripción del trabajo es obligatoria.');
        return;
    }

    try {
        if (ipc) {
            await ipc.invoke('agregar-trabajo', reparacionId, descripcion, tecnico || 'Técnico Principal', horas, precio);
        } else {
            const trabajosLocal = obtenerTrabajosLocal();
            trabajosLocal.push({
                id: Date.now(),
                reparacion_id: reparacionId,
                descripcion,
                tecnico: tecnico || 'Técnico Principal',
                tiempo_horas: horas,
                precio_mano_obra: precio,
                fecha: new Date().toISOString()
            });
            guardarTrabajosLocal(trabajosLocal);
        }
        alert('Trabajo agregado');
        const modalActual = document.querySelector('[data-modal-reparacion="true"]');
        if (modalActual) modalActual.remove();
        await abrirDetalleReparacion(reparacionId);
        await cargarOrdenes();
    } catch (error) {
        alert(`No se pudo agregar el trabajo: ${error.message}`);
    }
}

async function eliminarTrabajoDetalle(trabajoId, reparacionId) {
    try {
        if (ipc) {
            await ipc.invoke('eliminar-trabajo', trabajoId);
        } else {
            const trabajos = obtenerTrabajosLocal();
            guardarTrabajosLocal(trabajos.filter(item => Number(item.id) !== Number(trabajoId)));
        }
        alert('Trabajo eliminado');
        const modalActual = document.querySelector('[data-modal-reparacion="true"]');
        if (modalActual) modalActual.remove();
        if (reparacionId) await abrirDetalleReparacion(reparacionId);
        await cargarOrdenes();
    } catch (error) {
        alert(`No se pudo eliminar el trabajo: ${error.message}`);
    }
}

window.abrirDetalleReparacion = abrirDetalleReparacion;
window.actualizarEstadoDetalle = actualizarEstadoDetalle;
window.agregarRepuestoDetalle = agregarRepuestoDetalle;
window.eliminarRepuestoDetalle = eliminarRepuestoDetalle;
window.agregarTrabajoDetalle = agregarTrabajoDetalle;
window.eliminarTrabajoDetalle = eliminarTrabajoDetalle;
