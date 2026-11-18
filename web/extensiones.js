// Extensión de funciones para nav()
(function() {
    const originalNav = window.nav;
    window.nav = function(seccionId) {
        if (seccionId === 'usuarios') {
            try { cargarTecnicos(); mostrarAnalisisIA(); } catch(e) { console.error('Error cargando usuarios:', e); }
        }
        if (seccionId === 'clientes') {
            try { cargarHistorialClientes(); } catch(e) { console.error('Error cargando clientes:', e); }
        }
        if (seccionId === 'sucursales') {
            try { cargarSucursales(); } catch(e) { console.error('Error cargando sucursales:', e); }
        }
        return originalNav(seccionId);
    };
})();
