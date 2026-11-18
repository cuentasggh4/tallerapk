let usuariosAdminCache = [];
let sucursalesAdminCache = [];
let definicionesUsuariosAdmin = null;

async function cargarPanelUsuarios() {
    if (!puedeAdministrarUsuarios()) return;
    const contenedor = document.getElementById('usuarios-lista');
    if (!contenedor) return;
    contenedor.innerHTML = '<p class="p-5 text-xs text-slate-400">Cargando cuentas...</p>';
    try {
        [definicionesUsuariosAdmin, usuariosAdminCache, sucursalesAdminCache] = await Promise.all([
            ipc.invoke('get-user-access-definitions'),
            ipc.invoke('get-users'),
            ipc.invoke('get-sucursales')
        ]);
        const filtro = document.getElementById('usuarios-filtro-sucursal');
        const valorAnterior = filtro.value;
        filtro.innerHTML = '<option value="">Todas mis sucursales</option>' + sucursalesAdminCache.map(sucursal => `<option value="${Number(sucursal.id)}">${escaparHTML(sucursal.nombre)}</option>`).join('');
        if ([...filtro.options].some(option => option.value === valorAnterior)) filtro.value = valorAnterior;
        document.getElementById('usuarios-alcance').textContent = `${sucursalesAdminCache.length} sucursal(es) disponibles`;
        document.getElementById('usuarios-crear').classList.toggle('hidden', !tienePermisoActual('usuarios', 'crear'));
        renderizarUsuariosAdmin();
    } catch (error) {
        contenedor.innerHTML = `<p class="p-5 text-xs text-rose-300">No se pudieron cargar las cuentas: ${escaparHTML(error.message)}</p>`;
    }
}

function renderizarUsuariosAdmin() {
    const contenedor = document.getElementById('usuarios-lista');
    if (!contenedor) return;
    const filtroSucursal = Number(document.getElementById('usuarios-filtro-sucursal')?.value || 0);
    const usuarios = usuariosAdminCache.filter(usuario => !filtroSucursal || usuario.sucursales_ids.includes(filtroSucursal));
    if (!usuarios.length) {
        contenedor.innerHTML = '<p class="p-5 text-xs text-slate-500">No hay usuarios en esta sucursal.</p>';
        return;
    }
    const puedeEditar = tienePermisoActual('usuarios', 'editar');
    contenedor.innerHTML = `<table class="w-full min-w-[760px] text-left text-xs"><thead class="border-b border-slate-700 text-[10px] uppercase text-slate-500"><tr><th class="p-3">Usuario</th><th class="p-3">Rol</th><th class="p-3">Sucursal principal</th><th class="p-3">Sucursales asignadas</th><th class="p-3">Estado</th><th class="p-3">Último acceso</th><th class="p-3 text-right">Acciones</th></tr></thead><tbody>${usuarios.map(usuario => `
        <tr class="border-b border-slate-800/80 hover:bg-[#131c2e]">
            <td class="p-3"><strong class="block text-white">${escaparHTML(usuario.nombre)}</strong><span class="text-slate-500">${escaparHTML(usuario.usuario)}</span></td>
            <td class="p-3 text-slate-300">${escaparHTML(definicionesUsuariosAdmin.roles.find(rol => rol.id === usuario.rol)?.nombre || usuario.rol)}</td>
            <td class="p-3 text-slate-300">${escaparHTML(usuario.sucursal_nombre)}</td>
            <td class="p-3 text-slate-400">${usuario.sucursales_nombres.map(escaparHTML).join(', ') || 'Ninguna'}</td>
            <td class="p-3"><span class="${usuario.activo ? 'text-emerald-300' : 'text-slate-500'}">${usuario.activo ? 'Activo' : 'Desactivado'}</span></td>
            <td class="p-3 text-slate-400">${escaparHTML(usuario.ultimo_acceso ? new Date(usuario.ultimo_acceso).toLocaleString() : 'Nunca')}</td>
            <td class="p-3 text-right">${puedeEditar ? `<button type="button" onclick="abrirEditorUsuario(${Number(usuario.id)})" class="rounded border border-slate-700 px-2.5 py-1.5 text-slate-200 hover:border-emerald-400">Editar permisos</button>` : '<span class="text-slate-600">Solo lectura</span>'}</td>
        </tr>`).join('')}</tbody></table>`;
}

function esRolGlobalAdmin(rol) {
    return rol === 'administrador' || rol === 'gerente_general';
}

function renderizarMatrizPermisos(permisos = {}) {
    const contenedor = document.getElementById('usuario-matriz-permisos');
    if (!contenedor) return;
    const acciones = definicionesUsuariosAdmin.acciones;
    contenedor.innerHTML = `<div class="overflow-x-auto rounded border border-slate-800"><table class="w-full min-w-[620px] text-left text-[11px]"><thead class="border-b border-slate-700 text-slate-400"><tr><th class="p-2">Módulo</th>${acciones.map(accion => `<th class="p-2 text-center">${escaparHTML(accion)}</th>`).join('')}</tr></thead><tbody>${definicionesUsuariosAdmin.modulos.map(modulo => `<tr class="border-b border-slate-800/70"><th class="p-2 font-medium text-slate-300">${escaparHTML(modulo.nombre)}</th>${acciones.map(accion => `<td class="p-2 text-center"><input aria-label="${escaparHTML(modulo.nombre)} ${escaparHTML(accion)}" type="checkbox" data-permiso-modulo="${escaparHTML(modulo.id)}" data-permiso-accion="${escaparHTML(accion)}" ${permisos?.[modulo.id]?.[accion] ? 'checked' : ''} class="accent-emerald-400"></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function cambiarRolEditorUsuario() {
    const rol = document.getElementById('usuario-rol').value;
    const global = esRolGlobalAdmin(rol);
    const modal = document.getElementById('modal-usuario-admin');
    const antesGlobal = modal.dataset.rolGlobal === 'true';
    const sucursalPrincipal = Number(document.getElementById('usuario-sucursal-principal').value);
    document.querySelectorAll('[data-sucursal-asignada]').forEach(control => {
        if (global) control.checked = true;
        else if (antesGlobal) control.checked = Number(control.value) === sucursalPrincipal;
        else if (Number(control.value) === sucursalPrincipal) control.checked = true;
        control.disabled = global;
    });
    modal.dataset.rolGlobal = String(global);
    renderizarMatrizPermisos(definicionesUsuariosAdmin.plantillas[rol] || {});
}

function actualizarSucursalesEditor() {
    const rolGlobal = esRolGlobalAdmin(document.getElementById('usuario-rol').value);
    const principal = Number(document.getElementById('usuario-sucursal-principal').value);
    document.querySelectorAll('[data-sucursal-asignada]').forEach(control => {
        if (!rolGlobal) control.checked = Number(control.value) === principal || control.checked;
    });
}

function abrirEditorUsuario(usuarioId = null) {
    if (!puedeAdministrarUsuarios()) return;
    const usuario = usuariosAdminCache.find(item => item.id === Number(usuarioId));
    const esGlobal = sesionActual.rol === 'administrador' || sesionActual.rol === 'gerente_general';
    const rolActual = usuario?.rol || 'tecnico';
    const permisos = usuario?.permisos || definicionesUsuariosAdmin.plantillas[rolActual];
    const sucursalPrincipal = usuario?.sucursal_id || sesionActual.sucursal_id;
    const sucursales = sucursalesAdminCache.map(sucursal => `
        <label class="flex items-center gap-2 rounded border border-slate-800 bg-[#131c2e] p-2 text-xs text-slate-300">
            <input type="checkbox" data-sucursal-asignada value="${Number(sucursal.id)}" ${usuario?.sucursales_ids.includes(sucursal.id) || (!usuario && Number(sucursal.id) === Number(sucursalPrincipal)) ? 'checked' : ''} class="accent-emerald-400">
            ${escaparHTML(sucursal.nombre)}
        </label>`).join('');
    const roles = definicionesUsuariosAdmin.roles.map(rol => `<option value="${escaparHTML(rol.id)}" ${rol.id === rolActual ? 'selected' : ''} ${!esGlobal && esRolGlobalAdmin(rol.id) ? 'disabled' : ''}>${escaparHTML(rol.nombre)}</option>`).join('');
    document.getElementById('modal-usuario-admin')?.remove();
    const modal = document.createElement('div');
    modal.id = 'modal-usuario-admin';
    modal.className = 'fixed inset-0 z-[130] overflow-y-auto bg-black/80 p-4';
    modal.innerHTML = `<section role="dialog" aria-modal="true" aria-labelledby="usuario-admin-titulo" class="mx-auto my-6 w-full max-w-5xl overflow-hidden rounded-xl border border-slate-700 bg-[#0d131f] shadow-2xl">
        <header class="flex items-start justify-between gap-4 border-b border-slate-800 p-5"><div><h2 id="usuario-admin-titulo" class="text-lg font-bold text-white">${usuario ? 'Editar usuario y permisos' : 'Crear usuario'}</h2><p class="mt-1 text-xs text-slate-400">El acceso se limita a las sucursales asignadas.</p></div><button type="button" onclick="cerrarEditorUsuario()" class="rounded border border-slate-700 px-2 py-1 text-xs text-slate-400">Cerrar</button></header>
        <form class="max-h-[78vh] space-y-5 overflow-y-auto p-5" onsubmit="event.preventDefault(); guardarUsuarioAdmin()">
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label class="text-xs text-slate-300">Nombre<input id="usuario-nombre" required maxlength="100" value="${escaparHTML(usuario?.nombre || '')}" class="mt-1 w-full rounded border border-slate-700 bg-[#131c2e] p-2.5 text-white"></label>
                <label class="text-xs text-slate-300">Usuario / correo de acceso<input id="usuario-login" required maxlength="120" value="${escaparHTML(usuario?.usuario || '')}" class="mt-1 w-full rounded border border-slate-700 bg-[#131c2e] p-2.5 text-white"></label>
                <label class="text-xs text-slate-300">Rol<select id="usuario-rol" onchange="cambiarRolEditorUsuario()" class="mt-1 w-full rounded border border-slate-700 bg-[#131c2e] p-2.5 text-white">${roles}</select></label>
                <label class="text-xs text-slate-300">Sucursal principal<select id="usuario-sucursal-principal" onchange="actualizarSucursalesEditor()" class="mt-1 w-full rounded border border-slate-700 bg-[#131c2e] p-2.5 text-white">${sucursalesAdminCache.map(sucursal => `<option value="${Number(sucursal.id)}" ${Number(sucursalPrincipal) === Number(sucursal.id) ? 'selected' : ''}>${escaparHTML(sucursal.nombre)}</option>`).join('')}</select></label>
                <label class="text-xs text-slate-300">${usuario ? 'Nueva contraseña (opcional)' : 'Contraseña'}<input id="usuario-password" type="password" ${usuario ? '' : 'required'} minlength="8" autocomplete="new-password" class="mt-1 w-full rounded border border-slate-700 bg-[#131c2e] p-2.5 text-white"></label>
                <label class="flex items-center gap-2 self-end pb-2 text-xs text-slate-300"><input id="usuario-activo" type="checkbox" ${usuario?.activo !== false ? 'checked' : ''} class="accent-emerald-400"> Cuenta activa</label>
            </div>
            <fieldset class="space-y-2"><legend class="text-xs font-semibold text-slate-200">Sucursales asignadas</legend><div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">${sucursales}</div></fieldset>
            <fieldset class="space-y-2"><legend class="text-xs font-semibold text-slate-200">Permisos efectivos</legend><p class="text-[11px] text-slate-500">Se precargan según el rol y puedes ajustar excepciones.</p><div id="usuario-matriz-permisos"></div></fieldset>
            <footer class="flex justify-end gap-2 border-t border-slate-800 pt-4"><button type="button" onclick="cerrarEditorUsuario()" class="rounded border border-slate-700 px-4 py-2 text-xs text-slate-300">Cancelar</button><button type="submit" class="rounded bg-[#00e65c] px-4 py-2 text-xs font-bold text-black">${usuario ? 'Guardar cambios' : 'Crear usuario'}</button></footer>
        </form></section>`;
    modal.dataset.usuarioId = usuario?.id || '';
    modal.dataset.rolGlobal = String(esRolGlobalAdmin(rolActual));
    document.body.appendChild(modal);
    renderizarMatrizPermisos(permisos);
    if (window.lucide) lucide.createIcons();
}

function cerrarEditorUsuario() {
    document.getElementById('modal-usuario-admin')?.remove();
}

async function guardarUsuarioAdmin() {
    const modal = document.getElementById('modal-usuario-admin');
    const sucursalesIds = [...modal.querySelectorAll('[data-sucursal-asignada]:checked')].map(control => Number(control.value));
    const sucursalPrincipal = Number(document.getElementById('usuario-sucursal-principal').value);
    if (!sucursalesIds.includes(sucursalPrincipal)) return alert('La sucursal principal debe estar entre las sucursales asignadas.');
    const permisos = {};
    modal.querySelectorAll('[data-permiso-modulo]').forEach(control => {
        permisos[control.dataset.permisoModulo] ||= {};
        permisos[control.dataset.permisoModulo][control.dataset.permisoAccion] = control.checked;
    });
    const datos = {
        id: Number(modal.dataset.usuarioId) || null,
        nombre: document.getElementById('usuario-nombre').value.trim(),
        usuario: document.getElementById('usuario-login').value.trim(),
        password: document.getElementById('usuario-password').value,
        rol: document.getElementById('usuario-rol').value,
        sucursal_id: sucursalPrincipal,
        sucursales_ids: sucursalesIds,
        activo: document.getElementById('usuario-activo').checked,
        permisos
    };
    try {
        if (datos.id) await ipc.invoke('update-user', datos);
        else await ipc.invoke('create-user', datos);
        cerrarEditorUsuario();
        await cargarPanelUsuarios();
    } catch (error) {
        alert(`No se guardó el usuario: ${error.message}`);
    }
}