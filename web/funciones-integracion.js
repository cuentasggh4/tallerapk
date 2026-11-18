// Funciones de integración para app.js

async function registrarNuevoTecnico() {
    const nombre = document.getElementById('tec-nombre').value.trim();
    const usuario = document.getElementById('tec-usuario').value.trim();
    const email = document.getElementById('tec-email').value.trim();
    const especialidad = document.getElementById('tec-especialidad').value;
    const password = document.getElementById('tec-password').value;
    if (!nombre || !usuario || !email || !password || password.length < 6) {
        return alert('Completa todos los campos. Contraseña mínimo 6 caracteres.');
    }
    await crearTecnico({ nombre, usuario, email, especialidad, password });
    document.getElementById('tec-nombre').value = '';
    document.getElementById('tec-usuario').value = '';
    document.getElementById('tec-email').value = '';
    document.getElementById('tec-password').value = '';
    cargarTecnicos();
    alert('Técnico registrado correctamente');
}

async function registrarNuevaSucursal() {
    const nombre = document.getElementById('suc-nombre').value.trim();
    const direccion = document.getElementById('suc-direccion').value.trim();
    const telefono = document.getElementById('suc-telefono').value.trim();
    const gerente = document.getElementById('suc-gerente').value.trim();
    if (!nombre || !direccion || !telefono || !gerente) {
        return alert('Completa todos los campos de la sucursal.');
    }
    await crearSucursal({ nombre, direccion, telefono, gerente });
    document.getElementById('suc-nombre').value = '';
    document.getElementById('suc-direccion').value = '';
    document.getElementById('suc-telefono').value = '';
    document.getElementById('suc-gerente').value = '';
    cargarSucursales();
    alert('Sucursal registrada correctamente');
}
