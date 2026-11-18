// Inicializar Íconos de Lucide
lucide.createIcons();

// Acceso uniforme a Electron o al almacenamiento web local
const ipc = window.tallerAPI ? {
    invoke: (canal, datos) => {
        const acciones = {
            'get-config': () => window.tallerAPI.getConfig(),
            'save-config': () => window.tallerAPI.saveConfig(datos),
            'get-modulo': () => window.tallerAPI.getModulo(datos),
            'save-modulo': () => window.tallerAPI.saveModulo(datos),
            'sync-now': () => window.tallerAPI.syncNow(datos),
            'sync-pull': () => window.tallerAPI.syncPull(datos),
            'refresh-online-catalog': () => window.tallerAPI.refreshOnlineCatalog(),
            'parse-supplier-file': () => window.tallerAPI.parseSupplierFile(datos),
            'get-iphone-price-table': () => window.tallerAPI.getIphonePriceTable(),
            'identify-device': () => window.tallerAPI.identifyDevice(),
            'get-auth-status': () => window.tallerAPI.getAuthStatus(),
            'setup-admin': () => window.tallerAPI.setupAdmin(datos),
            'login': () => window.tallerAPI.login(datos),
            'login-online': () => window.tallerAPI.loginOnline(datos),
            'get-remembered-login': () => window.tallerAPI.getRememberedLogin(),
            'get-session': () => window.tallerAPI.getSession(),
            'logout': () => window.tallerAPI.logout(),
            'get-user-access-definitions': () => window.tallerAPI.getUserAccessDefinitions(),
            'get-users': () => window.tallerAPI.getUsers(),
            'create-user': () => window.tallerAPI.createUser(datos),
            'update-user': () => window.tallerAPI.updateUser(datos.id, datos),
            'get-clientes': () => window.tallerAPI.getClientes(),
            'add-cliente': () => window.tallerAPI.addCliente(datos),
            'update-cliente': () => window.tallerAPI.updateCliente(datos.id, datos),
            'delete-cliente': () => window.tallerAPI.deleteCliente(datos),
            'get-ordenes': () => window.tallerAPI.getOrdenes(),
            'add-orden': () => window.tallerAPI.addOrden(datos),
            'update-estado-orden': () => window.tallerAPI.updateEstadoOrden(datos),
            'cobrar-reparacion': () => window.tallerAPI.cobrarReparacion(datos),
            'update-orden': () => window.tallerAPI.updateOrden(datos),
            'delete-orden': () => window.tallerAPI.deleteOrden(datos),
            'get-inventario': () => window.tallerAPI.getInventario(),
            'get-ventas': () => window.tallerAPI.getVentas(),
            'registrar-venta-pos': () => window.tallerAPI.registrarVentaPOS(datos),
            'add-producto': () => window.tallerAPI.addProducto(datos),
            'update-producto': () => window.tallerAPI.updateProducto(datos.id, datos),
            'delete-producto': () => window.tallerAPI.deleteProducto(datos),
            'get-sucursales': () => window.tallerAPI.getSucursales(),
            'add-sucursal': () => window.tallerAPI.addSucursal(datos),
            'switch-sucursal': () => window.tallerAPI.switchSucursal(datos),
            'get-stock-bajo': () => window.tallerAPI.getStockBajo(),
            'registrar-movimiento': () => window.tallerAPI.registrarMovimiento(datos),
            'get-movimientos': () => window.tallerAPI.getMovimientos(datos),
            'registrar-recepcion-mercancia': () => window.tallerAPI.registrarRecepcionMercancia(datos),
            'get-recepciones-mercancia': () => window.tallerAPI.getRecepcionesMercancia(),
            'get-proveedores': () => window.tallerAPI.getProveedores(),
            'add-proveedor': () => window.tallerAPI.addProveedor(datos),
            'update-proveedor': () => window.tallerAPI.updateProveedor(datos.id, datos),
            'delete-proveedor': () => window.tallerAPI.deleteProveedor(datos),
            'get-reparaciones': () => window.tallerAPI.getReparaciones(datos || ''),
            'get-reparacion': () => window.tallerAPI.getReparacion(datos),
            'add-reparacion': () => window.tallerAPI.addReparacion(datos),
            'update-reparacion': () => window.tallerAPI.updateReparacion(datos.id, datos),
            'cambiar-estado-reparacion': () => window.tallerAPI.cambiarEstadoReparacion(datos.id, datos.estado, datos.nota || ''),
            'agregar-repuesto': () => window.tallerAPI.agregarRepuesto(datos.reparacion_id, datos.producto_id, datos.cantidad, datos.precio_unitario),
            'obtener-repuestos': () => window.tallerAPI.obtenerRepuestos(datos),
            'eliminar-repuesto': () => window.tallerAPI.eliminarRepuesto(datos),
            'agregar-trabajo': () => window.tallerAPI.agregarTrabajo(datos.reparacion_id, datos.descripcion, datos.tecnico || '', datos.tiempo_horas || 0, datos.precio_mano_obra || 0),
            'obtener-trabajos': () => window.tallerAPI.obtenerTrabajos(datos),
            'eliminar-trabajo': () => window.tallerAPI.eliminarTrabajo(datos),
            'obtener-historial-reparacion': () => window.tallerAPI.obtenerHistorialReparacion(datos),
            'calcular-costo': () => window.tallerAPI.calcularCosto(datos),
            'get-tecnicos': () => window.tallerAPI.getTecnicos(),
            'add-tecnico': () => window.tallerAPI.addTecnico(datos),
            'update-tecnico': () => window.tallerAPI.updateTecnico(datos.id, datos),
            'delete-tecnico': () => window.tallerAPI.deleteTecnico(datos)
        };
        if (!acciones[canal]) throw new Error(`Canal IPC no permitido: ${canal}`);
        return acciones[canal]();
    }
} : null;

// Catálogo local de modelos por marca
const catálogoModelos = {
    "Acer": ["Spin 5", "Predator 8", "Nitro 5", "Aspire 7"],
    "Alcatel": ["1B 2022", "1S 2021", "3L 2021", "3X 2020"],
    "Apple": ["iPhone 15 / 15 Pro", "iPhone 14 / 14 Pro", "iPhone 13", "iPhone 12", "iPhone 11", "iPhone XR", "iPhone X / XS"],
    "Asus": ["ROG Phone 9 Pro", "ROG Phone 9", "Zenfone 12 Ultra", "Zenfone 11 Ultra"],
    "Blackview": ["BL9000 Pro", "BL9000", "BV9300 Pro", "BV6200 Pro", "A200 Pro"],
    "BLU": ["G5 Plus", "G73", "F92e", "B9"],
    "Cubot": ["KingKong X Pro", "KingKong Star", "Note 50", "P80"],
    "Doogee": ["V Max Pro", "S200 Ultra", "S119", "N50 Pro"],
    "Google": ["Pixel 8", "Pixel 8 Pro", "Pixel 9", "Pixel 9 Pro", "Pixel Fold"],
    "Honor": ["Magic 6 Pro", "X9c", "Play 9A", "90 Lite"],
    "Huawei": ["Pura 70 Ultra", "Pura 70 Pro", "Mate 70 Pro", "Mate X6", "Nova 13 Pro", "Nova 12i", "Y9c", "Y7a"],
    "Itel": ["A90", "P65", "P55 5G", "A70"],
    "Lenovo": ["Legion Phone Duel 2", "K14 Plus", "Tab P12"],
    "LG": ["Velvet 5G", "Stylo 7", "K62"],
    "Meizu": ["Note 22 Pro", "Note 22", "21 Pro", "20 Pro"],
    "Motorola": ["Moto Edge 40", "Moto Edge 20 Fusion", "Moto G84", "Moto G54", "Moto G23", "Moto E22"],
    "Nokia": ["G50", "C300", "X50", "X30"],
    "Nothing": ["Phone (3)", "Phone (3a) Pro", "Phone (3a)", "Phone (2a)"],
    "OnePlus": ["OnePlus 12", "OnePlus 11", "OnePlus Nord CE4", "OnePlus Ace 3"],
    "Oppo": ["Reno 10", "A78", "A58", "A17"],
    "Oukitel": ["WP35 Pro", "WP33 Pro", "C60", "C57"],
    "Realme": ["Narzo 70", "C65", "GT 6", "12 Pro"],
    "Samsung": [
        "Galaxy S26", "Galaxy S26+", "Galaxy S26 Ultra", "Galaxy S25", "Galaxy S25+", "Galaxy S25 Ultra", "Galaxy S25 Edge", "Galaxy S25 FE",
        "Galaxy S24", "Galaxy S24+", "Galaxy S24 Ultra", "Galaxy S24 FE", "Galaxy S23", "Galaxy S23+", "Galaxy S23 Ultra", "Galaxy S23 FE",
        "Galaxy S22", "Galaxy S22+", "Galaxy S22 Ultra", "Galaxy S21", "Galaxy S21+", "Galaxy S21 Ultra", "Galaxy S21 FE",
        "Galaxy S20", "Galaxy S20+", "Galaxy S20 Ultra", "Galaxy S20 FE", "Galaxy S10", "Galaxy S10+", "Galaxy S10e", "Galaxy S10 Lite",
        "Galaxy A57", "Galaxy A37", "Galaxy A27", "Galaxy A17", "Galaxy A07", "Galaxy A56", "Galaxy A36", "Galaxy A26", "Galaxy A16", "Galaxy A06",
        "Galaxy A55", "Galaxy A35", "Galaxy A25", "Galaxy A15", "Galaxy A05s", "Galaxy A05", "Galaxy A54", "Galaxy A34", "Galaxy A24", "Galaxy A14", "Galaxy A04s", "Galaxy A04",
        "Galaxy A53", "Galaxy A33", "Galaxy A23", "Galaxy A13", "Galaxy A03s", "Galaxy A03", "Galaxy A52", "Galaxy A52s 5G", "Galaxy A32", "Galaxy A22", "Galaxy A12", "Galaxy A02s",
        "Galaxy M47", "Galaxy M36", "Galaxy M17", "Galaxy M16", "Galaxy M06", "Galaxy M56", "Galaxy M35", "Galaxy M34", "Galaxy M33", "Galaxy M32", "Galaxy M31", "Galaxy M30s", "Galaxy M21", "Galaxy M12", "Galaxy M02",
        "Galaxy F70 Pro", "Galaxy F70e", "Galaxy F36", "Galaxy F17", "Galaxy F16", "Galaxy F56", "Galaxy F34", "Galaxy F23", "Galaxy F22", "Galaxy F13", "Galaxy F12", "Galaxy F02s",
        "Galaxy Z Fold8 Ultra", "Galaxy Z Fold8", "Galaxy Z Fold7", "Galaxy Z Fold6", "Galaxy Z Fold5", "Galaxy Z Fold4", "Galaxy Z Fold3", "Galaxy Z Fold2",
        "Galaxy Z Flip8", "Galaxy Z Flip7", "Galaxy Z Flip7 FE", "Galaxy Z Flip6", "Galaxy Z Flip5", "Galaxy Z Flip4", "Galaxy Z Flip3", "Galaxy Z Flip",
        "Galaxy XCover7 Pro", "Galaxy XCover7", "Galaxy XCover6 Pro", "Galaxy XCover5", "Galaxy XCover Pro", "Galaxy XCover 4s",
        "Galaxy Note20", "Galaxy Note20 Ultra", "Galaxy Note10", "Galaxy Note10+", "Galaxy Note10 Lite", "Galaxy Note9", "Galaxy Note8", "Galaxy Note20 Ultra 5G"
    ],
    "Sharp": ["Aquos R10", "Aquos Sense9", "Aquos Wish4"],
    "Sony": ["Xperia 1 VII", "Xperia 10 VII", "Xperia 1 VI", "Xperia 10 VI", "Xperia 5 V"],
    "TCL": ["40 XL", "50 XL", "60 SE", "60 XE"],
    "Tecno": ["Camon 20", "Spark 10", "Pova 6", "Phantom V"],
    "Ulefone": ["Armor 34", "Armor 28 Ultra", "Armor X32 Pro", "Note 19 Pro"],
    "Umidigi": ["G100", "G9 5G", "A16", "Bison X20"],
    "Vivo": ["V30", "Y100", "X100", "T2 Pro"],
    "Wiko": ["View 4", "Power 5", "Ufeel Go"],
    "Xiaomi": ["Redmi Note 13", "Redmi Note 12", "POCO X6", "POCO M6"],
    "ZTE": ["Blade V50", "Blade A53", "Axon 40"],
    "Zuum": ["Stellar", "Magno", "Aura"]
};

const catálogoModelosActuales = {
    "Apple": ["iPhone 17e", "iPhone Air"],
    "Samsung": ["Galaxy M17e", "Galaxy A07 5G", "Galaxy Z TriFold", "Galaxy F07", "Galaxy M07"],
    "Motorola": ["Moto G86 Power"],
    "Xiaomi": ["Xiaomi 17", "Xiaomi 17 Ultra", "Xiaomi 17T", "Xiaomi 17T Pro", "Redmi Note 15 Pro+", "Redmi Note 15 Pro", "POCO F8 Ultra", "POCO F8 Pro"],
    "Oppo": ["Find X9 Ultra", "Find X9s Pro", "Find X9s", "Reno16 Pro", "Reno16", "Reno16 F", "Reno16 FS", "A7 Pro Max", "K15", "F33 Pro", "F33", "A6 Pro", "A6", "A6x", "A6s Pro"],
    "OnePlus": ["OnePlus N6x", "OnePlus N6", "OnePlus Turbo 6X Pro", "OnePlus Turbo 6X", "OnePlus Nord CE6 Lite", "OnePlus Ace 6 Ultra", "OnePlus 15T", "OnePlus Turbo 6", "OnePlus Turbo 6V", "OnePlus Ace 6T", "OnePlus 13S"],
    "Google": ["Pixel 11", "Pixel 11 Pro", "Pixel 11 Pro XL", "Pixel 11 Pro Fold", "Pixel 10a", "Pixel 10 Pro Fold"],
    "Honor": ["Robot Phone", "X6e", "X7e Plus", "X80 Pro Max", "600 Smart", "X70 Pro Max", "Play10", "600e", "500 Smart", "Play11 Plus", "X5d", "X5d Plus", "X80i", "Play 80 Pro", "Play 80 Plus", "Magic8 Pro", "Magic8", "Magic8 Lite", "Power2"],
    "Realme": ["16x", "16T", "P4x", "P4R", "C100x", "C100i", "C100", "P4 Lite", "Note 80", "C83", "Narzo Power", "16", "P4 Power", "Neo8", "C85", "16 Pro", "Narzo 90", "Narzo 90X", "P3 Lite", "P4", "P4 Pro", "Narzo 80 Lite", "15 Pro", "15", "15T", "Note 70"],
    "Vivo": ["X300 Pro", "X300", "V60", "V50 Lite", "Y400", "Y300", "Y200"],
    "ZTE": ["nubia Z80 Ultra", "nubia Neo 4", "Blade V80", "Axon 70 Ultra"],
    "Tecno": ["PHANTOM V Fold3", "CAMON 50 Pro", "CAMON 40 Premier", "POVA 7 Pro", "SPARK 40 Pro", "SPARK 40"],
    "Infinix": ["NOTE 50 Pro+ 5G", "NOTE 50X", "GT 30", "HOT 60 Pro+", "HOT 60", "ZERO 50"],
    "Nokia": ["G500", "C400"],
    "TCL": ["50 NXTPAPER 5G", "60 NXTPAPER", "60 SE", "50 XL NXTPAPER"],
    "Huawei": ["Pura X", "Pura 80 Ultra", "Pura 80 Pro", "Mate 80 Pro", "Mate X7", "Nova 14 Pro", "Nova 14"],
    "Sony": ["Xperia 1 VIII"],
    "Asus": ["ROG Phone 10 Pro", "ROG Phone 10", "Zenfone 13 Ultra"],
    "Lenovo": ["Legion Phone 3 Pro", "Legion Phone 3", "K15 Pro"],
    "Nothing": ["Phone (4)", "Phone (4a)", "Phone (3a) Lite"],
    "Meizu": ["Note 23 Pro", "22 Pro", "22"],
    "Alcatel": ["3X 2025", "1S 2025"],
    "Ulefone": ["Armor 30 Pro", "Armor X33 Pro", "Note 20 Pro"],
    "Blackview": ["BL10000 Pro", "BV7300 Pro", "BV7000"],
    "Oukitel": ["WP36 Pro", "WP38", "C70"],
    "Doogee": ["V Max S", "S300 Pro", "N60 Pro"],
    "Cubot": ["KingKong X Pro 5G", "Note 60", "P90"],
    "Umidigi": ["G100 Max", "A17", "Bison GT3"],
    "Itel": ["A100", "P70", "S25"],
    "Sharp": ["Aquos R10 Pro", "Aquos Sense10", "Aquos Wish5"],
    "BLU": ["G95 Max", "G84", "F93"]
};

const catálogoModelosCompleto = Object.fromEntries(Object.keys({ ...catálogoModelos, ...catálogoModelosActuales }).map(marca => [marca, [...new Set([...(catálogoModelos[marca] || []), ...(catálogoModelosActuales[marca] || [])])]]));

let clientesBD = [];
let ordenesBD = [];
let sesionActual = null;
const modulosBD = {};
const clavesDatosWeb = new Set(['pw_config', 'pw_clientes', 'pw_ordenes', 'pw_inventario', 'pw_proveedores', 'pw_facturas', 'pw_sucursales', 'pw_compras', 'pw_repuestos', 'pw_trabajos', 'pw_cotizador_refacciones', 'pw_cotizador_iphone_refacciones']);
let sincronizacionWebAplicando = false;
let temporizadorSyncWeb = null;
let sincronizacionWebEnCurso = false;
const getItemLocalStorageOriginal = Storage.prototype.getItem;
const setItemLocalStorageOriginal = Storage.prototype.setItem;
const removeItemLocalStorageOriginal = Storage.prototype.removeItem;

function claveLocalStorageWeb(clave, sesion = sesionActual) {
    if (sesion?.modalidad === 'sincronizada' && sesion.organizacion_id && sesion.sucursal_id && clavesDatosWeb.has(String(clave))) {
        return `pw_sucursal_${sesion.organizacion_id}_${sesion.sucursal_id}_${clave}`;
    }
    return String(clave);
}

function migrarDatosWebSinSucursal(sesion) {
    const marcaMigracion = 'pw_sync_local_migracion_v1';
    if (getItemLocalStorageOriginal.call(localStorage, marcaMigracion)) return;
    clavesDatosWeb.forEach(clave => {
        const claveSucursal = claveLocalStorageWeb(clave, sesion);
        if (getItemLocalStorageOriginal.call(localStorage, claveSucursal) !== null) return;
        const anterior = getItemLocalStorageOriginal.call(localStorage, clave);
        if (anterior !== null) setItemLocalStorageOriginal.call(localStorage, claveSucursal, anterior);
    });
    setItemLocalStorageOriginal.call(localStorage, marcaMigracion, '1');
}

function clavePendientesSyncWeb(sesion = sesionActual) {
    return sesion?.organizacion_id && sesion?.sucursal_id ? `pw_sync_pendientes_${sesion.organizacion_id}_${sesion.sucursal_id}` : null;
}

function leerPendientesSyncWeb(sesion = sesionActual) {
    const clave = clavePendientesSyncWeb(sesion);
    if (!clave) return new Set();
    try { return new Set(JSON.parse(localStorage.getItem(clave) || '[]')); }
    catch { return new Set(); }
}

function marcarPendienteSyncWeb(clave) {
    if (!sesionActual?.access_token) return;
    const pendientes = leerPendientesSyncWeb(sesionActual);
    pendientes.add(clave);
    setItemLocalStorageOriginal.call(localStorage, clavePendientesSyncWeb(sesionActual), JSON.stringify([...pendientes]));
}

function programarSyncWeb() {
    if (!sesionActual?.access_token || sincronizacionWebAplicando) return;
    clearTimeout(temporizadorSyncWeb);
    temporizadorSyncWeb = setTimeout(() => sincronizarSnapshotWeb(sesionActual).catch(error => mostrarEstadoSyncWeb(error.message)), 1200);
}

Storage.prototype.getItem = function (clave) {
    const claveReal = this === localStorage ? claveLocalStorageWeb(clave) : String(clave);
    return getItemLocalStorageOriginal.call(this, claveReal);
};

Storage.prototype.setItem = function (clave, valor) {
    const claveReal = this === localStorage ? claveLocalStorageWeb(clave) : String(clave);
    setItemLocalStorageOriginal.call(this, claveReal, valor);
    if (this === localStorage && !ipc && sesionActual?.access_token && clavesDatosWeb.has(String(clave))) {
        marcarPendienteSyncWeb(String(clave));
        programarSyncWeb();
    }
};

Storage.prototype.removeItem = function (clave) {
    const claveReal = this === localStorage ? claveLocalStorageWeb(clave) : String(clave);
    return removeItemLocalStorageOriginal.call(this, claveReal);
};

function mostrarEstadoSyncWeb(mensaje, correcto = false) {
    const estado = document.getElementById('sync-estado');
    if (!estado) return;
    estado.textContent = mensaje;
    estado.className = `text-[11px] ${correcto ? 'text-emerald-300' : 'text-rose-300'}`;
}

function crearSnapshotWebLocal(sesion = sesionActual) {
    const snapshot = {};
    clavesDatosWeb.forEach(clave => {
        const guardado = getItemLocalStorageOriginal.call(localStorage, claveLocalStorageWeb(clave, sesion));
        if (guardado === null) return;
        const datos = JSON.parse(guardado);
        if (clave === 'pw_config' && datos && typeof datos === 'object') delete datos.sync_token;
        snapshot[clave] = datos;
    });
    return snapshot;
}

async function solicitarSnapshotWeb(sesion, metodo, snapshot = {}) {
    const url = new URL('/api/sync/pull', sesion.sync_url);
    url.searchParams.set('organizacionId', sesion.organizacion_id);
    url.searchParams.set('sucursalId', sesion.sucursal_id);
    const headers = { Authorization: `Bearer ${sesion.access_token}` };
    let respuesta;
    if (metodo === 'pull') {
        respuesta = await fetch(url, { headers });
    } else {
        respuesta = await fetch(new URL('/api/sync/push', sesion.sync_url), {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ organizacionId: sesion.organizacion_id, sucursalId: sesion.sucursal_id, snapshot })
        });
    }
    const resultado = await respuesta.json();
    if (!respuesta.ok) throw new Error(resultado.error || `Error de sincronización (${respuesta.status})`);
    return resultado;
}

async function sincronizarSnapshotWeb(sesion, inicial = false) {
    if (!sesion?.access_token || sincronizacionWebEnCurso) return;
    sincronizacionWebEnCurso = true;
    let pendientesEnviados = [];
    try {
        const remotoInicial = await solicitarSnapshotWeb(sesion, 'pull');
        const locales = crearSnapshotWebLocal(sesion);
        const pendientes = leerPendientesSyncWeb(sesion);
        const salientes = {};
        Object.entries(locales).forEach(([clave, datos]) => {
            if (pendientes.has(clave) || !Object.prototype.hasOwnProperty.call(remotoInicial.snapshot || {}, clave)) salientes[clave] = datos;
        });
        pendientesEnviados = [...pendientes].filter(clave => Object.prototype.hasOwnProperty.call(salientes, clave));
        pendientesEnviados.forEach(clave => pendientes.delete(clave));
        setItemLocalStorageOriginal.call(localStorage, clavePendientesSyncWeb(sesion), JSON.stringify([...pendientes]));
        if (Object.keys(salientes).length) {
            try {
                await solicitarSnapshotWeb(sesion, 'push', salientes);
            } catch (error) {
                pendientesEnviados.forEach(clave => pendientes.add(clave));
                setItemLocalStorageOriginal.call(localStorage, clavePendientesSyncWeb(sesion), JSON.stringify([...pendientes]));
                throw error;
            }
        }
        const remotoFinal = Object.keys(salientes).length ? await solicitarSnapshotWeb(sesion, 'pull') : remotoInicial;
        Object.entries(remotoFinal.snapshot || {}).forEach(([clave, datos]) => {
            if (!clavesDatosWeb.has(clave)) return;
            if (clave === 'pw_config' && datos && typeof datos === 'object') delete datos.sync_token;
            setItemLocalStorageOriginal.call(localStorage, claveLocalStorageWeb(clave, sesion), JSON.stringify(datos));
        });
        pendientes.forEach(clave => { if (Object.prototype.hasOwnProperty.call(salientes, clave)) pendientes.delete(clave); });
        setItemLocalStorageOriginal.call(localStorage, clavePendientesSyncWeb(sesion), JSON.stringify([...pendientes]));
        if (Object.keys(salientes).length || Object.keys(remotoFinal.snapshot || {}).length) {
            Object.keys(modulosBD).forEach(clave => delete modulosBD[clave]);
        }
        mostrarEstadoSyncWeb(`Sincronizado · ${new Date().toLocaleTimeString()}`, true);
    } finally {
        sincronizacionWebEnCurso = false;
        if (leerPendientesSyncWeb(sesion).size) programarSyncWeb();
    }
}

function escaparHTML(valor) {
    return String(valor ?? '').replace(/[&<>'"]/g, caracter => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[caracter]));
}

function normalizarUrlServidorSync(valor) {
    let url;
    try { url = new URL(String(valor || '').trim()); }
    catch { throw new Error('La URL del servidor no es válida'); }
    const esLoopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname.toLowerCase());
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && esLoopback)) {
        throw new Error('Usa HTTPS para servidores remotos. HTTP solo está permitido en esta computadora.');
    }
    return url.toString().replace(/\/$/, '');
}

async function leerModulo(clave) {
    if (modulosBD[clave]) return modulosBD[clave];
    if (ipc) {
        modulosBD[clave] = await ipc.invoke('get-modulo', clave);
        return modulosBD[clave];
    }
    let configuracion = {};
    if (ipc) configuracion = await ipc.invoke('get-config');
    else configuracion = JSON.parse(localStorage.getItem('pw_config') || '{}');
    const datos = clave === 'facturas'
        ? JSON.parse(localStorage.getItem('pw_facturas') || '[]')
        : configuracion[`modulo_${clave}`];
    modulosBD[clave] = Array.isArray(datos) ? datos : (typeof datos === 'string' ? JSON.parse(datos || '[]') : []);
    if (!modulosBD[clave].length && clave === 'categorias') {
        modulosBD[clave] = ['Celular / Smartphone', 'Tablet / iPad', 'Laptop / PC', 'TV', 'Bocina', 'Diagnóstico', 'Cambio de pantalla', 'Centro de carga', 'Cambio de batería', 'Microsoldadura', 'Limpieza y líquidos', 'Software y desbloqueo', 'Liberación de red', 'Accesorios', 'Garantía'].map((nombre, indice) => ({ id: Date.now() + indice, nombre }));
        await guardarModulo(clave);
    }
    return modulosBD[clave];
}

async function guardarModulo(clave) {
    const valor = JSON.stringify(modulosBD[clave] || []);
    if (ipc) {
        await ipc.invoke('save-modulo', { clave, elementos: modulosBD[clave] || [] });
    } else {
        const configuracion = JSON.parse(localStorage.getItem('pw_config') || '{}');
        configuracion[`modulo_${clave}`] = modulosBD[clave] || [];
        localStorage.setItem('pw_config', JSON.stringify(configuracion));
    }
}

function renderLista(items, contenedor, textoVacio, formatear) {
    const cont = document.getElementById(contenedor);
    if (!items.length) {
        cont.innerHTML = `<p class="text-slate-500 italic">${textoVacio}</p>`;
        return;
    }
    cont.innerHTML = `<div class="space-y-2">${items.map(formatear).join('')}</div>`;
}

async function cargarCatalogo(tipo) {
    const items = await leerModulo(tipo);
    if (tipo === 'modelos') await cargarFiltroModelos();
    const filtroMarca = tipo === 'modelos' ? document.getElementById('filtro-modelos-marca').value : '';
    const itemsVisibles = filtroMarca ? items.filter(item => item.marca === filtroMarca) : items;
    renderLista(itemsVisibles, `lista-catalogo-${tipo}`, `No hay ${tipo}${filtroMarca ? ` de ${filtroMarca}` : ''} registrados.`, item => `<div class="flex items-center justify-between bg-[#131c2e] border border-slate-800 rounded-lg p-3"><span class="text-white">${escaparHTML(item.nombre)}${item.marca ? ` <span class="text-slate-500">· ${escaparHTML(item.marca)}</span>` : ''}</span><button onclick="eliminarCatalogo('${tipo}', '${item.id}')" class="text-rose-400 hover:text-rose-300" title="Eliminar"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div>`);
    lucide.createIcons();
    if (tipo === 'marcas' || tipo === 'modelos') cargarMarcasFormulario();
}

async function agregarCatalogo(tipo) {
    const nombre = document.getElementById(`catalogo-${tipo}-nombre`).value.trim();
    const marca = tipo === 'modelos' ? document.getElementById('catalogo-modelos-marca').value.trim() : '';
    if (!nombre) return alert('Escribe un nombre.');
    const items = await leerModulo(tipo);
    items.push({ id: Date.now(), nombre, ...(marca ? { marca } : {}) });
    await guardarModulo(tipo);
    document.getElementById(`catalogo-${tipo}-nombre`).value = '';
    if (tipo === 'modelos') document.getElementById('catalogo-modelos-marca').value = '';
    cargarCatalogo(tipo);
}

async function cargarMarcasFormulario() {
    const select = document.getElementById('rep-marca');
    if (!select) return;
    const marcasDB = await leerModulo('marcas');
    const marcas = [...new Set(marcasDB.map(marca => marca.nombre))].sort((a, b) => a.localeCompare(b));
    const seleccionada = select.value;
    select.innerHTML = '<option value="">-- Seleccionar Marca --</option>';
    marcas.forEach(marca => {
        select.innerHTML += `<option value="${escaparHTML(marca)}">${escaparHTML(marca)}</option>`;
    });
    if (marcas.includes(seleccionada)) select.value = seleccionada;
}

async function cargarFiltroModelos() {
    const filtro = document.getElementById('filtro-modelos-marca');
    if (!filtro) return;
    const marcasDB = await leerModulo('marcas');
    const modelosDB = await leerModulo('modelos');
    const marcas = [...new Set(marcasDB.map(marca => marca.nombre))].sort((a, b) => a.localeCompare(b));
    const seleccionada = filtro.value;
    filtro.innerHTML = '<option value="">Todas las marcas</option>';
    marcas.forEach(marca => {
        const cantidadModelos = modelosDB.filter(modelo => modelo.marca === marca).length;
        filtro.innerHTML += `<option value="${escaparHTML(marca)}">${escaparHTML(marca)} (${cantidadModelos})</option>`;
    });
    if (marcas.includes(seleccionada)) filtro.value = seleccionada;
}

async function eliminarCatalogo(tipo, id) {
    if (!confirm('¿Deseas eliminar este registro?')) return;
    modulosBD[tipo] = (await leerModulo(tipo)).filter(item => String(item.id) !== String(id));
    await guardarModulo(tipo);
    cargarCatalogo(tipo);
}

async function cargarInventario() {
    const items = await leerModulo('inventario');
    renderLista(items, 'lista-inventario', 'No hay refacciones registradas.', item => `<div class="flex flex-wrap items-center justify-between gap-3 bg-[#131c2e] border border-slate-800 rounded-lg p-3"><div><strong class="text-white">${escaparHTML(item.nombre)}</strong><span class="text-slate-500 ml-2">${escaparHTML(item.sku || 'Sin SKU')}</span></div><div class="flex items-center gap-3"><span class="${item.stock <= item.minimo ? 'text-amber-300' : 'text-emerald-300'}">Stock: ${item.stock}</span><button onclick="ajustarInventario('${item.id}', 1)" class="px-2 py-1 bg-emerald-500/10 text-emerald-300 rounded">+1</button><button onclick="ajustarInventario('${item.id}', -1)" class="px-2 py-1 bg-rose-500/10 text-rose-300 rounded">-1</button><button onclick="eliminarInventario('${item.id}')" class="text-rose-400" title="Eliminar"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div></div>`);
    lucide.createIcons();
}

async function agregarInventario() {
    const nombre = document.getElementById('inv-nombre').value.trim();
    const sku = document.getElementById('inv-sku').value.trim();
    const stock = Number(document.getElementById('inv-stock').value || 0);
    const minimo = Number(document.getElementById('inv-minimo').value || 0);
    if (!nombre || stock < 0 || minimo < 0) return alert('Completa la refacción y usa cantidades válidas.');
    const items = await leerModulo('inventario');
    items.push({ id: Date.now(), nombre, sku, stock, minimo });
    await guardarModulo('inventario');
    ['inv-nombre', 'inv-sku', 'inv-stock', 'inv-minimo'].forEach(id => document.getElementById(id).value = '');
    cargarInventario();
}

async function ajustarInventario(id, cambio) {
    const items = await leerModulo('inventario');
    const item = items.find(registro => String(registro.id) === String(id));
    if (!item || item.stock + cambio < 0) return;
    item.stock += cambio;
    await guardarModulo('inventario');
    cargarInventario();
}

async function eliminarInventario(id) {
    if (!confirm('¿Deseas eliminar esta refacción?')) return;
    modulosBD.inventario = (await leerModulo('inventario')).filter(item => String(item.id) !== String(id));
    await guardarModulo('inventario');
    cargarInventario();
}

async function cargarPOS() {
    const inventario = ipc ? await ipc.invoke('get-inventario') : JSON.parse(localStorage.getItem('pw_inventario') || '[]');
    const selector = document.getElementById('pos-producto');
    if (selector) selector.innerHTML = '<option value="">Selecciona un producto</option>' + inventario.filter(item => Number(item.stock) > 0).map(item => `<option value="${item.id}" data-sku="${escaparHTML(item.sku || '')}">${escaparHTML(item.nombre)} · $${Number(item.precio_venta || 0).toFixed(2)} · ${item.stock} disp.</option>`).join('');
    const clientes = ipc ? await ipc.invoke('get-clientes') : JSON.parse(localStorage.getItem('pw_clientes') || '[]');
    const cliente = document.getElementById('pos-cliente');
    if (cliente) cliente.innerHTML = '<option value="">Cliente ocasional</option>' + clientes.map(item => `<option value="${item.id}">${escaparHTML(item.nombre)} · ${escaparHTML(item.telefono)}</option>`).join('');
    renderCarritoPOS();
    const ventas = await leerModulo('facturas');
    renderLista(ventas.filter(venta => venta.origen === 'POS'), 'lista-pos', 'No hay cobros registrados.', venta => `<div class="flex justify-between bg-[#131c2e] border border-slate-800 rounded-lg p-3"><span class="text-white">${escaparHTML(venta.detalle)} · ${escaparHTML(venta.metodo)}</span><strong class="text-emerald-300">$${venta.total.toFixed(2)}</strong></div>`);
}

let carritoPOS = [];

function renderCarritoPOS() {
    const contenedor = document.getElementById('pos-carrito');
    const resumen = document.getElementById('pos-resumen');
    if (!contenedor || !resumen) return;
    const subtotal = carritoPOS.reduce((total, item) => total + item.cantidad * item.precio_unitario, 0);
    const descuento = Number(document.getElementById('pos-descuento')?.value || 0);
    const impuesto = Number(document.getElementById('pos-impuesto')?.value || 0);
    const total = subtotal - descuento + impuesto;
    contenedor.innerHTML = carritoPOS.length ? carritoPOS.map((item, indice) => `<div class="flex items-center justify-between gap-3 bg-[#131c2e] border border-slate-800 rounded-lg p-3"><span class="text-white">${escaparHTML(item.nombre)} <span class="text-slate-400">x${item.cantidad}</span></span><span class="text-emerald-300">$${(item.cantidad * item.precio_unitario).toFixed(2)} <button onclick="quitarDelCarritoPOS(${indice})" class="ml-2 text-rose-300" title="Quitar">×</button></span></div>`).join('') : '<p class="text-slate-500 italic">El carrito está vacío.</p>';
    resumen.innerHTML = `<div class="flex justify-between"><span>Subtotal</span><strong>$${subtotal.toFixed(2)}</strong></div><div class="flex justify-between text-rose-300"><span>Descuento</span><strong>-$${descuento.toFixed(2)}</strong></div><div class="flex justify-between text-amber-300"><span>Impuesto</span><strong>$${impuesto.toFixed(2)}</strong></div><div class="flex justify-between border-t border-slate-800 pt-2 mt-2 text-white font-bold"><span>Total</span><strong>$${total.toFixed(2)}</strong></div>`;
}

function agregarAlCarritoPOS() {
    const selector = document.getElementById('pos-producto');
    const cantidad = Number(document.getElementById('pos-cantidad').value || 0);
    if (!selector?.value || !Number.isInteger(cantidad) || cantidad <= 0) return alert('Selecciona un producto y una cantidad válida.');
    const item = selector.options[selector.selectedIndex];
    const existente = carritoPOS.find(producto => String(producto.producto_id) === String(selector.value));
    if (existente) existente.cantidad += cantidad;
    else carritoPOS.push({ producto_id: Number(selector.value), sku: item.dataset.sku || '', nombre: item.textContent.split(' · $')[0], cantidad, precio_unitario: Number(item.textContent.match(/\$([\d.]+)/)?.[1] || 0) });
    document.getElementById('pos-cantidad').value = '1';
    renderCarritoPOS();
}

function quitarDelCarritoPOS(indice) {
    carritoPOS.splice(indice, 1);
    renderCarritoPOS();
}

async function actualizarCarritoPOSAntesDeCobrar(venta) {
    if (sesionActual?.modalidad !== 'sincronizada') return true;
    const clienteIdAnterior = document.getElementById('pos-cliente')?.value || '';
    const clientesAnteriores = ipc ? await ipc.invoke('get-clientes') : JSON.parse(localStorage.getItem('pw_clientes') || '[]');
    const clienteAnterior = clientesAnteriores.find(cliente => String(cliente.id) === String(clienteIdAnterior));
    try {
        if (ipc) {
            await ipc.invoke('sync-pull', { url: sesionActual.sync_url });
        } else {
            await sincronizarSnapshotWeb(sesionActual);
        }
    } catch (error) {
        return confirm(`No se pudo actualizar stock online (${error.message}). ¿Continuar con los datos locales?`);
    }

    const inventario = ipc ? await ipc.invoke('get-inventario') : JSON.parse(localStorage.getItem('pw_inventario') || '[]');
    clientesBD = ipc ? await ipc.invoke('get-clientes') : JSON.parse(localStorage.getItem('pw_clientes') || '[]');
    await cargarPOS();
    if (clienteAnterior) {
        const clienteActual = clientesBD.find(cliente => normalizarTelefonoCliente(cliente.telefono) === normalizarTelefonoCliente(clienteAnterior.telefono));
        document.getElementById('pos-cliente').value = clienteActual ? String(clienteActual.id) : '';
        venta.cliente_id = clienteActual?.id || null;
    }

    let precioActualizado = false;
    for (const item of carritoPOS) {
        const producto = (item.sku && inventario.find(registro => String(registro.sku || '').toLowerCase() === String(item.sku).toLowerCase()))
            || inventario.find(registro => String(registro.id) === String(item.producto_id));
        if (!producto || Number(producto.stock) < item.cantidad) {
            alert(`Stock insuficiente o producto no disponible: ${item.nombre}. Actualicé el catálogo; revisa el carrito.`);
            return false;
        }
        item.producto_id = producto.id;
        const precioActual = Number(producto.precio_venta);
        if (Number.isFinite(precioActual) && precioActual !== Number(item.precio_unitario)) {
            item.precio_unitario = precioActual;
            precioActualizado = true;
        }
    }
    if (precioActualizado) {
        renderCarritoPOS();
        alert('El precio cambió en otra sesión. Revisé el total actualizado; confirma el cobro nuevamente.');
        return false;
    }
    return true;
}

async function registrarVentaPOS() {
    const descuento = Number(document.getElementById('pos-descuento').value || 0);
    const impuesto = Number(document.getElementById('pos-impuesto').value || 0);
    const venta = { items: carritoPOS, descuento, impuesto, metodo: document.getElementById('pos-metodo').value, cliente_id: document.getElementById('pos-cliente').value || null };
    if (!carritoPOS.length) return alert('Agrega al menos un producto al carrito.');
    if (!venta.metodo || !Number.isFinite(descuento) || descuento < 0 || !Number.isFinite(impuesto) || impuesto < 0) return alert('Revisa el método de pago, descuento e impuesto.');
    try {
        if (!(await actualizarCarritoPOSAntesDeCobrar(venta))) return;
        if (ipc) {
            await ipc.invoke('registrar-venta-pos', venta);
        }
        else {
            const inventario = JSON.parse(localStorage.getItem('pw_inventario') || '[]');
            const inventarioActualizado = inventario.map(producto => ({ ...producto }));
            const detalles = carritoPOS.map(item => {
                const producto = inventarioActualizado.find(registro => String(registro.id) === String(item.producto_id));
                if (!producto || Number(producto.stock) < item.cantidad) throw new Error(`Stock insuficiente: ${item.nombre}`);
                const precio = Number(item.precio_unitario);
                if (!Number.isFinite(precio) || precio < 0) throw new Error(`Precio inválido: ${item.nombre}`);
                producto.stock -= item.cantidad;
                return { producto_id: producto.id, nombre: producto.nombre, cantidad: item.cantidad, precio_unitario: precio, subtotal: item.cantidad * precio };
            });
            const subtotal = carritoPOS.reduce((total, item) => total + item.cantidad * item.precio_unitario, 0);
            if (descuento > subtotal) throw new Error('El descuento no puede superar el subtotal.');
            const total = subtotal - descuento + impuesto;
            const syncId = crypto.randomUUID();
            const fecha = new Date().toISOString();
            const ventas = JSON.parse(localStorage.getItem('pw_facturas') || '[]');
            const clientes = JSON.parse(localStorage.getItem('pw_clientes') || '[]');
            const cliente = venta.cliente_id ? clientes.find(item => String(item.id) === String(venta.cliente_id)) : null;
            ventas.push({
                id: Date.now(),
                sync_id: syncId,
                origen: 'POS',
                detalle: detalles.map(item => `${item.cantidad} x ${item.nombre}`).join(', '),
                cantidad: detalles.reduce((suma, item) => suma + item.cantidad, 0),
                total,
                subtotal,
                descuento,
                impuesto,
                detalles,
                cliente_id: venta.cliente_id ? Number(venta.cliente_id) : null,
                cliente_nombre: cliente?.nombre || '',
                cliente_telefono: cliente?.telefono || '',
                metodo: venta.metodo,
                fecha
            });
            const config = JSON.parse(localStorage.getItem('pw_config') || '{}');
            const caja = Array.isArray(config.modulo_caja) ? config.modulo_caja : [];
            caja.push({ id: Date.now() + 1, sync_id: syncId, tipo: 'ingreso', concepto: `Venta POS · ${detalles.map(item => item.nombre).join(', ')}`, monto: total, fecha });
            localStorage.setItem('pw_inventario', JSON.stringify(inventarioActualizado));
            localStorage.setItem('pw_facturas', JSON.stringify(ventas));
            localStorage.setItem('pw_config', JSON.stringify({ ...config, modulo_caja: caja }));
        }
        ['facturas', 'caja', 'inventario'].forEach(clave => delete modulosBD[clave]);
        carritoPOS = [];
        document.getElementById('pos-descuento').value = '0';
        document.getElementById('pos-impuesto').value = '0';
        await cargarPOS();
        if (sesionActual?.modalidad === 'sincronizada') {
            try {
                if (ipc) await ipc.invoke('sync-now', { url: sesionActual.sync_url, token: '' });
                else await sincronizarSnapshotWeb(sesionActual);
            } catch (errorSync) {
                mostrarEstadoSyncWeb(`Venta guardada localmente; sync pendiente: ${errorSync.message}`);
                alert('Venta registrada y aplicada a caja/stock. La sincronización quedó pendiente por falta de conexión.');
                return;
            }
        }
        alert('Venta registrada correctamente. Venta, caja y existencias actualizadas.');
    } catch (error) {
        alert(`No se pudo registrar la venta: ${error.message}`);
    }
}

function obtenerFechaFormato(fecha) {
    const date = new Date(fecha);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const categoriasGastoCaja = [
    'Refacciones y repuestos',
    'Herramientas y equipo',
    'Renta y servicios',
    'Nómina y adelantos',
    'Publicidad y marketing',
    'Suministros y consumibles',
    'Retiros y utilidades',
    'Otros gastos'
];

function instalarControlCategoriaCaja() {
    const tipo = document.getElementById('caja-tipo');
    const concepto = document.getElementById('caja-concepto');
    const monto = document.getElementById('caja-monto');
    if (!tipo || !concepto || !monto || document.getElementById('caja-categoria')) return;
    const categoria = document.createElement('select');
    categoria.id = 'caja-categoria';
    categoria.required = true;
    categoria.className = 'bg-[#131c2e] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00ff66]';
    categoria.innerHTML = `<option value="">Categoría del egreso</option>${categoriasGastoCaja.map(item => `<option value="${escaparHTML(item)}">${escaparHTML(item)}</option>`).join('')}`;
    concepto.parentElement.insertBefore(categoria, monto);
    const actualizarVisibilidad = () => {
        categoria.hidden = tipo.value !== 'egreso';
        categoria.required = tipo.value === 'egreso';
        if (tipo.value !== 'egreso') categoria.value = '';
    };
    tipo.addEventListener('change', actualizarVisibilidad);
    actualizarVisibilidad();
}

async function cargarCaja() {
    instalarControlCategoriaCaja();
    const movimientos = await leerModulo('caja');
    const fechaFiltro = (document.getElementById('caja-fecha-filtro') || {}).value || '';
    
    let movimientosVisibles = movimientos;
    if (fechaFiltro) {
        movimientosVisibles = movimientos.filter(mov => obtenerFechaFormato(mov.fecha) === fechaFiltro);
    }
    
    const ingresos = movimientosVisibles.filter(movimiento => movimiento.tipo === 'ingreso').reduce((total, movimiento) => total + movimiento.monto, 0);
    const egresos = movimientosVisibles.filter(movimiento => movimiento.tipo === 'egreso').reduce((total, movimiento) => total + movimiento.monto, 0);
    const saldo = ingresos - egresos;
    
    document.getElementById('resumen-caja').innerHTML = `<div class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4"><span class="text-xs text-slate-400">Ingresos</span><strong class="block text-xl text-emerald-300">$${ingresos.toFixed(2)}</strong></div><div class="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4"><span class="text-xs text-slate-400">Egresos</span><strong class="block text-xl text-rose-300">$${egresos.toFixed(2)}</strong></div><div class="bg-[#131c2e] border border-slate-800 rounded-xl p-4"><span class="text-xs text-slate-400">Saldo</span><strong class="block text-xl ${saldo >= 0 ? 'text-emerald-300' : 'text-rose-300'}">$${saldo.toFixed(2)}</strong></div>`;
    const resumenCategorias = document.getElementById('resumen-categorias-egreso') || document.createElement('div');
    resumenCategorias.id = 'resumen-categorias-egreso';
    resumenCategorias.className = 'grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4';
    if (!resumenCategorias.isConnected) document.getElementById('resumen-caja').after(resumenCategorias);
    const categorias = new Map();
    movimientosVisibles.filter(movimiento => movimiento.tipo === 'egreso').forEach(movimiento => {
        const categoria = String(movimiento.categoria || 'Sin categoría');
        categorias.set(categoria, (categorias.get(categoria) || 0) + Number(movimiento.monto || 0));
    });
    resumenCategorias.innerHTML = [...categorias.entries()].sort((a, b) => b[1] - a[1]).map(([categoria, total]) => `<div class="rounded-lg border border-slate-800 bg-[#0d131f] p-3"><span class="block text-[11px] text-slate-400">${escaparHTML(categoria)}</span><strong class="mt-1 block text-sm text-rose-300">-$${total.toFixed(2)}</strong></div>`).join('');
    resumenCategorias.classList.toggle('hidden', categorias.size === 0);
    renderLista(movimientosVisibles.reverse(), 'lista-caja', 'No hay movimientos registrados.', movimiento => `<div class="flex items-center justify-between bg-[#131c2e] border border-slate-800 rounded-lg p-3"><div><span class="text-white text-xs">${escaparHTML(movimiento.concepto)}</span>${movimiento.tipo === 'egreso' && movimiento.categoria ? `<span class="ml-2 text-[10px] text-amber-300">${escaparHTML(movimiento.categoria)}</span>` : ''}<span class="block text-[11px] text-slate-500">${new Date(movimiento.fecha).toLocaleString()}</span></div><strong class="${movimiento.tipo === 'ingreso' ? 'text-emerald-300' : 'text-rose-300'}">${movimiento.tipo === 'ingreso' ? '+' : '-'}$${Number(movimiento.monto).toFixed(2)}</strong></div>`);
}

async function hacerCorteDiario() {
    const movimientos = await leerModulo('caja');
    const hoy = obtenerFechaFormato(new Date());
    const movimientosHoy = movimientos.filter(mov => obtenerFechaFormato(mov.fecha) === hoy);
    if (!movimientosHoy.length) return alert('No hay movimientos para hoy.');
    const ingresos = movimientosHoy.filter(m => m.tipo === 'ingreso').reduce((sum, m) => sum + m.monto, 0);
    const egresos = movimientosHoy.filter(m => m.tipo === 'egreso').reduce((sum, m) => sum + m.monto, 0);
    const saldo = ingresos - egresos;
    const cortes = await leerModulo('cortes_diarios');
    const corteExistente = cortes.find(item => item.fecha_corte === hoy);
    const saldoContado = corteExistente?.conciliado ? Number(corteExistente.saldo_contado) : saldo;
    const modal = document.createElement('div');
    modal.id = 'modal-corte-caja';
    modal.dataset.saldo = String(saldo);
    modal.className = 'fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/80 p-4';
    modal.innerHTML = `
        <section role="dialog" aria-modal="true" aria-labelledby="titulo-corte-caja" class="my-6 w-full max-w-xl rounded-xl border border-slate-700 bg-[#0d131f] shadow-2xl">
            <header class="flex items-start justify-between gap-4 border-b border-slate-800 p-5"><div><h2 id="titulo-corte-caja" class="text-lg font-bold text-white">Conciliar cierre de caja</h2><p class="mt-1 text-xs text-slate-400">${hoy} · ${movimientosHoy.length} movimiento(s)</p></div><button type="button" onclick="document.getElementById('modal-corte-caja')?.remove()" class="rounded border border-slate-700 px-2 py-1 text-xs text-slate-400" title="Cerrar">Esc</button></header>
            <div class="space-y-4 p-5">
                <div class="grid grid-cols-3 gap-2 text-xs"><div class="rounded border border-slate-800 bg-[#131c2e] p-3"><span class="text-slate-400">Ingresos</span><strong class="mt-1 block text-emerald-300">$${ingresos.toFixed(2)}</strong></div><div class="rounded border border-slate-800 bg-[#131c2e] p-3"><span class="text-slate-400">Egresos</span><strong class="mt-1 block text-rose-300">$${egresos.toFixed(2)}</strong></div><div class="rounded border border-slate-800 bg-[#131c2e] p-3"><span class="text-slate-400">Saldo registrado</span><strong class="mt-1 block text-white">$${saldo.toFixed(2)}</strong></div></div>
                <label for="corte-saldo-contado" class="block text-xs font-semibold text-slate-300">Saldo contado / conciliado</label><input id="corte-saldo-contado" type="number" min="0" step="0.01" value="${saldoContado.toFixed(2)}" oninput="actualizarDiferenciaCorte()" class="w-full rounded border border-slate-700 bg-[#131c2e] p-2.5 text-white">
                <div class="flex items-center justify-between rounded border border-slate-800 bg-[#131c2e] p-3 text-xs"><span class="text-slate-400">Diferencia (contado menos registrado)</span><strong id="corte-diferencia" class="text-white">$0.00</strong></div>
                <label for="corte-notas" class="block text-xs font-semibold text-slate-300">Notas de conciliación<textarea id="corte-notas" maxlength="1000" rows="3" class="mt-1 w-full rounded border border-slate-700 bg-[#131c2e] p-2.5 text-white">${escaparHTML(corteExistente?.notas || '')}</textarea></label>
                <div class="flex justify-end gap-2"><button type="button" onclick="document.getElementById('modal-corte-caja')?.remove()" class="rounded border border-slate-700 px-4 py-2 text-xs text-slate-300">Cancelar</button><button type="button" onclick="guardarCorteDiario()" class="rounded bg-amber-500 px-4 py-2 text-xs font-bold text-black">Guardar cierre</button></div>
            </div>
        </section>`;
    document.body.appendChild(modal);
    actualizarDiferenciaCorte();
}

function actualizarDiferenciaCorte() {
    const salida = document.getElementById('corte-diferencia');
    const saldo = Number(document.getElementById('modal-corte-caja')?.dataset.saldo || 0);
    const monto = Number(document.getElementById('corte-saldo-contado')?.value || 0);
    if (!salida) return;
    const diferencia = monto - saldo;
    salida.textContent = `${diferencia > 0 ? '+' : ''}$${diferencia.toFixed(2)}`;
    salida.className = diferencia === 0 ? 'text-emerald-300' : diferencia > 0 ? 'text-amber-300' : 'text-rose-300';
}

async function guardarCorteDiario() {
    const montoContado = Number(document.getElementById('corte-saldo-contado')?.value);
    if (!Number.isFinite(montoContado) || montoContado < 0) return alert('Captura un saldo contado válido, igual o mayor a cero.');
    const movimientos = await leerModulo('caja');
    const hoy = obtenerFechaFormato(new Date());
    const movimientosHoy = movimientos.filter(mov => obtenerFechaFormato(mov.fecha) === hoy);
    if (!movimientosHoy.length) return alert('Ya no hay movimientos de hoy para cerrar caja.');
    const ingresos = movimientosHoy.filter(mov => mov.tipo === 'ingreso').reduce((sum, mov) => sum + Number(mov.monto || 0), 0);
    const egresos = movimientosHoy.filter(mov => mov.tipo === 'egreso').reduce((sum, mov) => sum + Number(mov.monto || 0), 0);
    const saldo = ingresos - egresos;
    const cortes = await leerModulo('cortes_diarios');
    const corteExistente = cortes.find(item => item.fecha_corte === hoy);
    const corte = {
        id: corteExistente?.id || Date.now(),
        fecha: new Date().toISOString(),
        fecha_corte: hoy,
        cantidad_movimientos: movimientosHoy.length,
        ingresos,
        egresos,
        saldo,
        saldo_contado: montoContado,
        diferencia: montoContado - saldo,
        conciliado: 1,
        notas: document.getElementById('corte-notas')?.value.trim() || '',
        usuario: sesionActual?.usuario || 'Administrador'
    };
    if (corteExistente) Object.assign(corteExistente, corte);
    else cortes.push(corte);
    await guardarModulo('cortes_diarios');
    document.getElementById('modal-corte-caja')?.remove();
    alert(`${corteExistente ? 'Cierre diario actualizado' : 'Cierre diario registrado'}:\nSaldo registrado: $${saldo.toFixed(2)}\nSaldo contado: $${montoContado.toFixed(2)}\nDiferencia: $${corte.diferencia.toFixed(2)}`);
    await cargarCaja();
    await cargarReportes();
}

async function cargarReportes() {
    const cortes = await leerModulo('cortes_diarios');
    const contenedor = document.getElementById('lista-reportes-caja');
    if (!contenedor) return;
    const desde = document.getElementById('reporte-caja-desde')?.value || '';
    const hasta = document.getElementById('reporte-caja-hasta')?.value || '';
    const cortesFiltrados = filtrarCortesPorPeriodo(cortes, desde, hasta);
    const totalIngresos = cortesFiltrados.reduce((sum, corte) => sum + Number(corte.ingresos || 0), 0);
    const totalEgresos = cortesFiltrados.reduce((sum, corte) => sum + Number(corte.egresos || 0), 0);
    const totalSaldo = cortesFiltrados.reduce((sum, corte) => sum + Number(corte.saldo || 0), 0);
    const totalDiferencia = cortesFiltrados.reduce((sum, corte) => sum + (corte.conciliado ? Number(corte.diferencia || 0) : 0), 0);
    const detalleCortes = [...cortesFiltrados].sort((a, b) => String(b.fecha_corte).localeCompare(String(a.fecha_corte))).map(corte => `
        <tr class="border-b border-slate-800/60">
            <td class="py-2 pr-3 text-white">${escaparHTML(corte.fecha_corte)}</td>
            <td class="py-2 pr-3">${Number(corte.cantidad_movimientos || 0)}</td>
            <td class="py-2 pr-3 text-emerald-300">$${Number(corte.ingresos || 0).toFixed(2)}</td>
            <td class="py-2 pr-3 text-rose-300">$${Number(corte.egresos || 0).toFixed(2)}</td>
            <td class="py-2 pr-3 ${Number(corte.saldo || 0) >= 0 ? 'text-emerald-300' : 'text-rose-300'} font-bold">$${Number(corte.saldo || 0).toFixed(2)}</td>
            <td class="py-2 pr-3">${corte.conciliado ? `$${Number(corte.saldo_contado || 0).toFixed(2)}` : 'Pendiente'}</td>
            <td class="py-2 pr-3 ${!corte.conciliado ? 'text-slate-500' : Number(corte.diferencia || 0) === 0 ? 'text-emerald-300' : Number(corte.diferencia || 0) > 0 ? 'text-amber-300' : 'text-rose-300'}">${corte.conciliado ? `$${Number(corte.diferencia || 0).toFixed(2)}` : 'Pendiente'}</td>
            <td class="max-w-48 truncate py-2 pr-3" title="${escaparHTML(corte.notas || '')}">${escaparHTML(corte.notas || '-')}</td>
        </tr>`).join('');
    let html = `
        <div class="mb-4 flex flex-wrap items-end gap-3">
            <label class="text-xs text-slate-300">Desde<input id="reporte-caja-desde" type="date" value="${escaparHTML(desde)}" onchange="cargarReportes()" class="mt-1 block rounded border border-slate-700 bg-[#131c2e] px-3 py-2 text-white"></label>
            <label class="text-xs text-slate-300">Hasta<input id="reporte-caja-hasta" type="date" value="${escaparHTML(hasta)}" onchange="cargarReportes()" class="mt-1 block rounded border border-slate-700 bg-[#131c2e] px-3 py-2 text-white"></label>
            <button type="button" onclick="limpiarPeriodoReporteCaja()" class="rounded border border-slate-700 px-3 py-2 text-xs text-slate-200">Limpiar periodo</button>
            <button type="button" onclick="exportarReporteCajaCSV()" ${cortesFiltrados.length ? '' : 'disabled'} class="flex items-center gap-2 rounded bg-emerald-500 px-3 py-2 text-xs font-bold text-black disabled:opacity-40"><i data-lucide="download" class="h-4 w-4"></i> Exportar CSV</button>
            <span class="text-[11px] text-slate-500">${cortesFiltrados.length} cierre(s)${desde || hasta ? ` · ${desde || 'inicio'} a ${hasta || 'hoy'}` : ' · todos los periodos'}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <span class="text-xs text-slate-400">Total Ingresos</span>
                <strong class="block text-lg text-emerald-300 mt-1">$${totalIngresos.toFixed(2)}</strong>
            </div>
            <div class="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                <span class="text-xs text-slate-400">Total Egresos</span>
                <strong class="block text-lg text-rose-300 mt-1">$${totalEgresos.toFixed(2)}</strong>
            </div>
            <div class="bg-[#131c2e] border border-slate-800 rounded-xl p-4">
                <span class="text-xs text-slate-400">Balance Neto</span>
                <strong class="block text-lg ${totalSaldo >= 0 ? 'text-emerald-300' : 'text-rose-300'} mt-1">$${totalSaldo.toFixed(2)}</strong>
            </div>
            <div class="bg-[#131c2e] border border-slate-800 rounded-xl p-4">
                <span class="text-xs text-slate-400">Diferencia conciliada</span>
                <strong class="block text-lg ${totalDiferencia === 0 ? 'text-emerald-300' : 'text-amber-300'} mt-1">$${totalDiferencia.toFixed(2)}</strong>
            </div>
        </div>
        <table class="w-full text-left text-[11px] text-slate-300">
            <thead>
                <tr class="border-b border-slate-800 text-slate-400">
                    <th class="py-2 pr-3">Fecha</th>
                    <th class="py-2 pr-3">Movimientos</th>
                    <th class="py-2 pr-3">Ingresos</th>
                    <th class="py-2 pr-3">Egresos</th>
                    <th class="py-2 pr-3">Saldo</th>
                    <th class="py-2 pr-3">Contado</th>
                    <th class="py-2 pr-3">Diferencia</th>
                    <th class="py-2 pr-3">Notas</th>
                </tr>
            </thead>
            <tbody>
                ${detalleCortes || '<tr><td colspan="8" class="py-6 text-center text-slate-500">No hay cierres en el periodo seleccionado.</td></tr>'}
            </tbody>
        </table>
    `;
    contenedor.innerHTML = html;
    if (window.lucide) lucide.createIcons();
}

function filtrarCortesPorPeriodo(cortes, desde = '', hasta = '') {
    if (desde && hasta && desde > hasta) return [];
    return cortes.filter(corte => (!desde || corte.fecha_corte >= desde) && (!hasta || corte.fecha_corte <= hasta));
}

function limpiarPeriodoReporteCaja() {
    const desde = document.getElementById('reporte-caja-desde');
    const hasta = document.getElementById('reporte-caja-hasta');
    if (desde) desde.value = '';
    if (hasta) hasta.value = '';
    cargarReportes();
}

async function exportarReporteCajaCSV() {
    const cortes = await leerModulo('cortes_diarios');
    const desde = document.getElementById('reporte-caja-desde')?.value || '';
    const hasta = document.getElementById('reporte-caja-hasta')?.value || '';
    const filtrados = filtrarCortesPorPeriodo(cortes, desde, hasta);
    if (!filtrados.length) return alert('No hay cierres para exportar en el periodo seleccionado.');
    const columnas = ['Fecha', 'Movimientos', 'Ingresos', 'Egresos', 'Saldo registrado', 'Saldo contado', 'Diferencia', 'Conciliado', 'Notas'];
    const escaparCSV = valor => `"${String(valor ?? '').replace(/"/g, '""')}"`;
    const filas = filtrados.sort((a, b) => String(a.fecha_corte).localeCompare(String(b.fecha_corte))).map(corte => [
        corte.fecha_corte,
        Number(corte.cantidad_movimientos || 0),
        Number(corte.ingresos || 0).toFixed(2),
        Number(corte.egresos || 0).toFixed(2),
        Number(corte.saldo || 0).toFixed(2),
        corte.conciliado ? Number(corte.saldo_contado || 0).toFixed(2) : '',
        corte.conciliado ? Number(corte.diferencia || 0).toFixed(2) : '',
        corte.conciliado ? 'Sí' : 'Pendiente',
        corte.notas || ''
    ]);
    const csv = '\uFEFF' + [columnas, ...filas].map(fila => fila.map(escaparCSV).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `caja-${desde || 'inicio'}-${hasta || 'hoy'}.csv`;
    enlace.click();
    URL.revokeObjectURL(url);
}

async function registrarMovimientoCaja() {
    const concepto = document.getElementById('caja-concepto').value.trim();
    const monto = Number(document.getElementById('caja-monto').value || 0);
    const tipo = document.getElementById('caja-tipo').value;
    const categoria = tipo === 'egreso' ? document.getElementById('caja-categoria')?.value || '' : '';
    if (!concepto || !Number.isFinite(monto) || monto <= 0 || (tipo === 'egreso' && !categoria)) return alert('Completa el concepto, una categoría para el egreso y un monto mayor a cero.');
    (await leerModulo('caja')).push({ id: Date.now(), tipo, concepto, monto, categoria, fecha: new Date().toISOString() });
    await guardarModulo('caja');
    document.getElementById('caja-concepto').value = '';
    document.getElementById('caja-monto').value = '';
    if (document.getElementById('caja-categoria')) document.getElementById('caja-categoria').value = '';
    document.getElementById('caja-tipo').value = 'ingreso';
    instalarControlCategoriaCaja();
    cargarCaja();
}

const COTIZADOR_REFACCIONES_KEY = 'pw_cotizador_refacciones';
const COTIZADOR_IPHONE_REFACCIONES_KEY = 'pw_cotizador_iphone_refacciones';
const COTIZADOR_FILAS_POR_PAGINA = 50;
const tiposRefaccionCotizador = ['Pantallas', 'Centros de carga', 'Flex de carga', 'Baterías', 'Bocinas', 'Flex de audio', 'Audífonos', 'Carcasas y tapas', 'Cámaras', 'Otros'];
let importacionProveedorActual = null;
let paginaCotizador = 0;
let paginaCotizadorIphone = 0;

function obtenerRefaccionesCotizador(clave = COTIZADOR_REFACCIONES_KEY) {
    try {
        const raw = localStorage.getItem(clave);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function guardarRefaccionesCotizador(items, clave = COTIZADOR_REFACCIONES_KEY) {
    localStorage.setItem(clave, JSON.stringify(items));
}

function obtenerTipoRefaccionCotizador(item) {
    if (item.tipo_refaccion === 'Pantalla') return 'Pantallas';
    return tiposRefaccionCotizador.includes(item.tipo_refaccion) ? item.tipo_refaccion : 'Otros';
}

function obtenerModelosCompatiblesCotizador(item) {
    return [...new Set(String(item.compatibilidad || '').split(/[;,|\/\r\n]+/).map(modelo => modelo.trim()).filter(Boolean))];
}

function detectarMarcaCotizador(texto) {
    const t = String(texto || '').toUpperCase();
    if (t.includes('SAMSUNG')) return 'Samsung';
    if (t.includes('IPHONE') || t.includes('IPAD') || t.includes('APPLE') || t.includes('WATCH')) return 'Apple';
    if (t.includes('XIAOMI') || t.includes('POCO')) return 'Xiaomi';
    if (t.includes('HUAWEI') || t.includes('HONOR')) return 'Huawei';
    if (t.includes('LG')) return 'LG';
    if (t.includes('OPPO')) return 'Oppo';
    if (t.includes('VIVO')) return 'Vivo';
    if (t.includes('ALCATEL')) return 'Alcatel';
    if (t.includes('MOTO')) return 'Motorola';
    return 'Genérica';
}

function detectarCalidadCotizador(texto) {
    const t = String(texto || '').toUpperCase();
    if (/\b(?:ORIGINAL|ORI)\b/.test(t)) return 'Original';
    if (t.includes('OLED')) return 'OLED';
    if (/\bINCELL?\b/.test(t)) return 'Incell';
    if (t.includes('COPIA')) return 'Copia';
    return 'Genérica';
}

function calcularPrecioVentaCotizador(precioCosto) {
    const costo = Number(precioCosto) || 0;
    if (costo < 150) return 650;
    if (costo >= 150 && costo <= 199) return 750;
    if (costo >= 200 && costo <= 350) return 825;
    if (costo >= 351 && costo <= 500) return 937;
    if (costo >= 501 && costo <= 600) return 1187;
    if (costo >= 601 && costo <= 700) return 1237;
    if (costo >= 701 && costo <= 900) return 1425;
    if (costo <= 1499) return costo + 600;
    if (costo <= 1999) return costo + 800;
    return costo + 1000;
}

function obtenerPrecioEspecialPantallaIphone(fila, preciosIphone) {
    if (obtenerTipoRefaccionCotizador(fila) !== 'Pantallas' || !/\bIPHONE\b/i.test(fila.descripcion || '')) return undefined;

    const descripcion = normalizarClaveCotizador(fila.descripcion).replace(/\s+/g, '');
    const modelos = preciosIphone.flatMap(registro => String(registro.modelo || '')
        .split(/[,/]+|\s+\bY\b\s+/i)
        .map(alias => alias.trim())
        .filter(Boolean)
        .map(alias => {
            const modelo = /\bIPHONE\b/i.test(alias) ? alias : `IPHONE ${alias}`;
            return { registro, modelo, clave: normalizarClaveCotizador(modelo).replace(/\s+/g, '') };
        }))
        .sort((a, b) => b.clave.length - a.clave.length);
    const coincidencia = modelos.find(modelo => descripcion.includes(modelo.clave));
    if (!coincidencia) return { modelo: '', precio: null };

    const calidad = detectarCalidadCotizador(fila.descripcion);
    const campo = calidad === 'Incell' ? 'incell' : calidad === 'OLED' ? 'oled' : calidad === 'Original' ? 'original' : '';
    if (!campo) return { modelo: coincidencia.modelo, precio: null };

    const precioConDescuento = calidad === 'Incell' ? coincidencia.registro.incell25 :
        calidad === 'OLED' ? coincidencia.registro.oled25 : null;
    const precio = precioConDescuento ?? coincidencia.registro[campo];
    const precioNumerico = precio == null || precio === '' ? null : Number(precio);
    return {
        modelo: coincidencia.modelo,
        precio: Number.isFinite(precioNumerico) ? precioNumerico : null,
        descuentoAplicado: precioConDescuento != null
    };
}

function calcularPrecioVentaImportacion(fila, preciosIphone) {
    const precioEspecial = obtenerPrecioEspecialPantallaIphone(fila, preciosIphone);
    return precioEspecial === undefined ? calcularPrecioVentaCotizador(fila.precio_costo) : precioEspecial.precio;
}

function actualizarFiltrosCotizador(items) {
    const selectMarca = document.getElementById('cotizador-filtro-marca');
    const selectCalidad = document.getElementById('cotizador-filtro-calidad');
    const selectModelo = document.getElementById('cotizador-filtro-modelo');
    const selectTipo = document.getElementById('cotizador-filtro-tipo');
    if (!selectMarca || !selectCalidad || !selectModelo || !selectTipo) return;

    const marcaActual = selectMarca.value;
    const calidadActual = selectCalidad.value;
    const modeloActual = selectModelo.value;
    const tipoActual = selectTipo.value;

    const marcas = [...new Set(items.map(item => item.marca).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const calidades = [...new Set(items.map(item => item.calidad).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const modelos = [...new Set(items.flatMap(obtenerModelosCompatiblesCotizador))].sort((a, b) => a.localeCompare(b));
    const tipos = [...new Set(items.map(obtenerTipoRefaccionCotizador))].sort((a, b) => a.localeCompare(b));

    const htmlMarca = ['<option value="">Todas las marcas</option>']
        .concat(marcas.map(marca => `<option value="${escaparHTML(marca)}">${escaparHTML(marca)}</option>`))
        .join('');
    selectMarca.innerHTML = htmlMarca;
    if (marcas.includes(marcaActual)) selectMarca.value = marcaActual;

    const htmlCalidad = ['<option value="">Toda la calidad</option>']
        .concat(calidades.map(calidad => `<option value="${escaparHTML(calidad)}">${escaparHTML(calidad)}</option>`))
        .join('');
    selectCalidad.innerHTML = htmlCalidad;
    if (calidades.includes(calidadActual)) selectCalidad.value = calidadActual;

    const htmlModelo = ['<option value="">Todos los modelos</option>']
        .concat(modelos.map(modelo => `<option value="${escaparHTML(modelo)}">${escaparHTML(modelo)}</option>`))
        .join('');
    selectModelo.innerHTML = htmlModelo;
    if (modelos.includes(modeloActual)) selectModelo.value = modeloActual;

    selectTipo.innerHTML = ['<option value="">Todos los tipos</option>']
        .concat(tipos.map(tipo => `<option value="${escaparHTML(tipo)}">${escaparHTML(tipo)}</option>`))
        .join('');
    if (tipos.includes(tipoActual)) selectTipo.value = tipoActual;
}

async function cargarInventarioCotizador() {
    const items = obtenerRefaccionesCotizador();
    actualizarFiltrosCotizador(items);

    const query = (document.getElementById('cotizador-buscar') || {}).value || '';
    const filtro = query.trim().toLowerCase();
    const marcaFiltro = (document.getElementById('cotizador-filtro-marca') || {}).value || '';
    const calidadFiltro = (document.getElementById('cotizador-filtro-calidad') || {}).value || '';
    const modeloFiltro = (document.getElementById('cotizador-filtro-modelo') || {}).value || '';
    const tipoFiltro = (document.getElementById('cotizador-filtro-tipo') || {}).value || '';
    const tipoOrden = (document.getElementById('cotizador-ordenar') || {}).value || 'modelo';

    let visibles = items.filter(item => {
        const tipo = obtenerTipoRefaccionCotizador(item);
        const texto = `${item.marca} ${item.modelo} ${item.calidad} ${item.compatibilidad || ''} ${tipo}`.toLowerCase();
        const coincideTexto = !filtro || texto.includes(filtro);
        const coincideMarca = !marcaFiltro || item.marca === marcaFiltro;
        const coincideCalidad = !calidadFiltro || item.calidad === calidadFiltro;
        const coincideModelo = !modeloFiltro || obtenerModelosCompatiblesCotizador(item).includes(modeloFiltro);
        const coincideTipo = !tipoFiltro || tipo === tipoFiltro;
        return coincideTexto && coincideMarca && coincideCalidad && coincideModelo && coincideTipo;
    });

    visibles.sort((a, b) => {
        const valorA = tipoOrden === 'precio_venta' ? Number(a.precio_venta || 0) :
            tipoOrden === 'precio_costo' ? Number(a.precio_costo || 0) :
            tipoOrden === 'marca' ? String(a.marca || '').localeCompare(String(b.marca || '')) :
            String(a.modelo || '').localeCompare(String(b.modelo || ''));
        const valorB = tipoOrden === 'precio_venta' ? Number(b.precio_venta || 0) :
            tipoOrden === 'precio_costo' ? Number(b.precio_costo || 0) :
            tipoOrden === 'marca' ? String(b.marca || '').localeCompare(String(a.marca || '')) :
            String(b.modelo || '').localeCompare(String(a.modelo || ''));

        if (tipoOrden === 'precio_venta' || tipoOrden === 'precio_costo') return valorB - valorA;
        return valorA.localeCompare ? valorA.localeCompare(valorB) : String(valorA).localeCompare(String(valorB));
    });

    const contenedor = document.getElementById('cotizador-resultados');
    if (!contenedor) return;
    if (!visibles.length) {
        paginaCotizador = 0;
        contenedor.innerHTML = '<p class="text-slate-500 italic text-xs">No hay refacciones cargadas. Importa un PDF o un libro Excel del proveedor.</p>';
        document.getElementById('cotizador-resumen').innerHTML = '<div class="bg-[#131c2e] border border-slate-800 rounded-xl p-3"><span class="text-slate-400">Inventario cargado</span><strong class="block text-lg text-white mt-1">0</strong></div>';
        return;
    }

    const totalPaginas = Math.max(1, Math.ceil(visibles.length / COTIZADOR_FILAS_POR_PAGINA));
    paginaCotizador = Math.min(paginaCotizador, totalPaginas - 1);
    const inicioPagina = paginaCotizador * COTIZADOR_FILAS_POR_PAGINA;
    const filasPagina = visibles.slice(inicioPagina, inicioPagina + COTIZADOR_FILAS_POR_PAGINA);
    const totalCostos = visibles.reduce((s, item) => s + Number(item.precio_costo || 0), 0);
    const totalVentas = visibles.reduce((s, item) => s + Number(item.precio_venta || 0), 0);
    document.getElementById('cotizador-resumen').innerHTML = `
        <div class="bg-[#131c2e] border border-slate-800 rounded-xl p-3">
            <span class="text-slate-400">Refacciones</span>
            <strong class="block text-lg text-white mt-1">${visibles.length}</strong>
        </div>
        <div class="bg-[#131c2e] border border-slate-800 rounded-xl p-3">
            <span class="text-slate-400">Costo total</span>
            <strong class="block text-lg text-rose-300 mt-1">$${totalCostos.toFixed(2)}</strong>
        </div>
        <div class="bg-[#131c2e] border border-slate-800 rounded-xl p-3">
            <span class="text-slate-400">Venta estimada</span>
            <strong class="block text-lg text-emerald-300 mt-1">$${totalVentas.toFixed(2)}</strong>
        </div>
    `;

    contenedor.innerHTML = `
      <table class="min-w-full text-left text-[11px] text-slate-300">
        <thead>
          <tr class="border-b border-slate-800 text-slate-400">
            <th class="py-2 pr-3">Marca</th>
            <th class="py-2 pr-3">Tipo</th>
            <th class="py-2 pr-3">Refacción</th>
            <th class="py-2 pr-3">Compatible con</th>
            <th class="py-2 pr-3">Calidad</th>
            <th class="py-2 pr-3">Compra</th>
            <th class="py-2 pr-3">Venta</th>
            <th class="py-2 pr-3">Acción</th>
          </tr>
        </thead>
        <tbody>
          ${filasPagina.map(item => `
            <tr class="border-b border-slate-800/60" data-cotizador-id="${escaparHTML(item.id)}">
              <td class="py-2 pr-3 text-white">${escaparHTML(item.marca)}</td>
              <td class="py-2 pr-3">${escaparHTML(obtenerTipoRefaccionCotizador(item))}</td>
              <td class="py-2 pr-3">${escaparHTML(item.modelo)}</td>
              <td class="py-2 pr-3">${escaparHTML(item.compatibilidad || 'No especificado')}</td>
              <td class="py-2 pr-3 text-amber-300">${escaparHTML(item.calidad)}</td>
              <td class="py-2 pr-3"><input type="number" min="0" step="0.01" data-precio-field="precio_costo" aria-label="Precio de compra ${escaparHTML(item.modelo)}" value="${Number(item.precio_costo || 0)}" class="w-24 rounded border border-slate-700 bg-[#131c2e] px-2 py-1 text-rose-300"></td>
              <td class="py-2 pr-3"><input type="number" min="0" step="0.01" data-precio-field="precio_venta" aria-label="Precio de venta ${escaparHTML(item.modelo)}" value="${Number(item.precio_venta || 0)}" class="w-24 rounded border border-slate-700 bg-[#131c2e] px-2 py-1 font-bold text-emerald-300">${item.precio_venta_manual_requerido ? '<span class="mt-1 block text-[10px] text-amber-300">Captura manual</span>' : ''}</td>
              <td class="py-2 pr-3"><button type="button" onclick="guardarPreciosCotizador(this)" class="rounded border border-slate-700 px-2 py-1 text-[10px] text-slate-200 hover:border-emerald-400">Guardar</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
            <div class="flex items-center justify-between gap-3 border-t border-slate-800 pt-3 text-[11px] text-slate-400">
                <span>Mostrando ${inicioPagina + 1}-${Math.min(inicioPagina + filasPagina.length, visibles.length)} de ${visibles.length}</span>
                <div class="flex items-center gap-2">
                    <button type="button" onclick="cambiarPaginaCotizador(-1)" ${paginaCotizador === 0 ? 'disabled' : ''} class="rounded border border-slate-700 px-2 py-1 disabled:opacity-40">Anterior</button>
                    <span>${paginaCotizador + 1} / ${totalPaginas}</span>
                    <button type="button" onclick="cambiarPaginaCotizador(1)" ${paginaCotizador >= totalPaginas - 1 ? 'disabled' : ''} class="rounded border border-slate-700 px-2 py-1 disabled:opacity-40">Siguiente</button>
                </div>
            </div>
    `;
}

function cambiarPaginaCotizador(cambio) {
        paginaCotizador = Math.max(0, paginaCotizador + cambio);
        cargarInventarioCotizador();
}

function alternarCotizadorPantallasIphone() {
    const panel = document.getElementById('cotizador-iphone-panel');
    if (!panel) return;
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
        cargarInventarioCotizadorIphone();
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function cargarInventarioCotizadorIphone() {
    const contenedor = document.getElementById('cotizador-iphone-resultados');
    if (!contenedor) return;
    const items = obtenerRefaccionesCotizador(COTIZADOR_IPHONE_REFACCIONES_KEY);
    const filtro = (document.getElementById('cotizador-iphone-buscar')?.value || '').trim().toLowerCase();
    const visibles = items.filter(item => !filtro || `${item.modelo} ${item.compatibilidad} ${item.calidad}`.toLowerCase().includes(filtro));
    visibles.sort((a, b) => `${a.compatibilidad} ${a.calidad} ${a.modelo}`.localeCompare(`${b.compatibilidad} ${b.calidad} ${b.modelo}`));

    const resumen = document.getElementById('cotizador-iphone-resumen');
    const totalPaginas = Math.max(1, Math.ceil(visibles.length / COTIZADOR_FILAS_POR_PAGINA));
    paginaCotizadorIphone = Math.min(paginaCotizadorIphone, totalPaginas - 1);
    const inicio = paginaCotizadorIphone * COTIZADOR_FILAS_POR_PAGINA;
    const filas = visibles.slice(inicio, inicio + COTIZADOR_FILAS_POR_PAGINA);
    const costoTotal = visibles.reduce((total, item) => total + Number(item.precio_costo || 0), 0);
    const comprasPendientes = visibles.filter(item => item.precio_costo == null).length;
    const ventaTotal = visibles.reduce((total, item) => total + Number(item.precio_venta || 0), 0);

    resumen.textContent = `${visibles.length} pantallas · compra $${costoTotal.toFixed(2)} · venta $${ventaTotal.toFixed(2)}${comprasPendientes ? ` · ${comprasPendientes} compras pendientes` : ''}`;
    if (!visibles.length) {
        contenedor.innerHTML = '<p class="p-4 text-xs italic text-slate-500">No hay pantallas iPhone importadas. Importa un libro XLSX del proveedor.</p>';
        return;
    }

    contenedor.innerHTML = `
        <table class="min-w-full text-left text-[11px] text-slate-300">
            <thead><tr class="border-b border-slate-800 text-slate-400"><th class="py-2 pr-3">Modelo</th><th class="py-2 pr-3">Pantalla</th><th class="py-2 pr-3">Calidad</th><th class="py-2 pr-3">Compra</th><th class="py-2 pr-3">Venta</th><th class="py-2 pr-3">Acciones</th></tr></thead>
            <tbody>${filas.map(item => `
                <tr class="border-b border-slate-800/60" data-cotizador-id="${escaparHTML(item.id)}" data-cotizador-key="${COTIZADOR_IPHONE_REFACCIONES_KEY}">
                    <td class="py-2 pr-3 text-white">${escaparHTML(item.compatibilidad || 'Modelo no identificado')}</td>
                    <td class="py-2 pr-3">${escaparHTML(item.modelo)}</td>
                    <td class="py-2 pr-3 text-amber-300">${escaparHTML(item.calidad)}${item.precio_venta_manual_requerido ? '<span class="ml-1 text-[10px] text-amber-200">Captura manual</span>' : ''}</td>
                    <td class="py-2 pr-3"><input type="number" min="0" step="0.01" data-precio-field="precio_costo" aria-label="Compra ${escaparHTML(item.modelo)}" value="${item.precio_costo == null ? '' : Number(item.precio_costo)}" class="w-24 rounded border border-slate-700 bg-[#131c2e] px-2 py-1 text-rose-300"></td>
                    <td class="py-2 pr-3"><input type="number" min="0" step="0.01" data-precio-field="precio_venta" aria-label="Venta ${escaparHTML(item.modelo)}" value="${Number(item.precio_venta || 0)}" class="w-24 rounded border border-slate-700 bg-[#131c2e] px-2 py-1 font-bold text-emerald-300"></td>
                    <td class="flex flex-wrap gap-2 py-2 pr-3"><button type="button" onclick="guardarPreciosCotizador(this)" class="rounded border border-slate-700 px-2 py-1 text-[10px] text-slate-200 hover:border-emerald-400">Guardar</button><button type="button" onclick="usarPantallaIphoneEnCotizacion('${escaparHTML(item.id)}')" ${item.precio_venta_manual_requerido ? 'disabled' : ''} class="rounded border border-emerald-500/40 px-2 py-1 text-[10px] text-emerald-300 disabled:opacity-40">Cotizar</button></td>
                </tr>`).join('')}
            </tbody>
        </table>
        <div class="flex items-center justify-between gap-3 border-t border-slate-800 p-3 text-[11px] text-slate-400"><span>Mostrando ${inicio + 1}-${Math.min(inicio + filas.length, visibles.length)} de ${visibles.length}</span><div class="flex items-center gap-2"><button type="button" onclick="cambiarPaginaCotizadorIphone(-1)" ${paginaCotizadorIphone === 0 ? 'disabled' : ''} class="rounded border border-slate-700 px-2 py-1 disabled:opacity-40">Anterior</button><span>${paginaCotizadorIphone + 1} / ${totalPaginas}</span><button type="button" onclick="cambiarPaginaCotizadorIphone(1)" ${paginaCotizadorIphone >= totalPaginas - 1 ? 'disabled' : ''} class="rounded border border-slate-700 px-2 py-1 disabled:opacity-40">Siguiente</button></div></div>
    `;
}

function cambiarPaginaCotizadorIphone(cambio) {
    paginaCotizadorIphone = Math.max(0, paginaCotizadorIphone + cambio);
    cargarInventarioCotizadorIphone();
}

function vaciarCotizadorPantallasIphone() {
    if (!confirm('¿Deseas borrar el catálogo de pantallas iPhone?')) return;
    guardarRefaccionesCotizador([], COTIZADOR_IPHONE_REFACCIONES_KEY);
    paginaCotizadorIphone = 0;
    cargarInventarioCotizadorIphone();
}

function usarPantallaIphoneEnCotizacion(itemId) {
    const item = obtenerRefaccionesCotizador(COTIZADOR_IPHONE_REFACCIONES_KEY).find(registro => String(registro.id) === String(itemId));
    if (!item || item.precio_venta_manual_requerido || Number(item.precio_venta) <= 0) return alert('Define el precio de venta de esta pantalla antes de cotizarla.');
    document.getElementById('cot-detalle').value = `${item.compatibilidad || 'iPhone'} · ${item.modelo} · ${item.calidad}`;
    document.getElementById('cot-monto').value = Number(item.precio_venta).toFixed(2);
    document.getElementById('cot-cliente').focus();
    document.getElementById('cot-cliente').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function guardarPreciosCotizador(boton) {
    const fila = boton.closest('tr');
    const itemId = fila?.dataset.cotizadorId;
    const clave = fila?.dataset.cotizadorKey || COTIZADOR_REFACCIONES_KEY;
    const costoInput = fila?.querySelector('[data-precio-field="precio_costo"]');
    const ventaInput = fila?.querySelector('[data-precio-field="precio_venta"]');
    const costoTexto = costoInput?.value.trim() || '';
    const costo = costoTexto ? Number(costoTexto) : null;
    const venta = Number(ventaInput?.value);
    const permiteCompraPendiente = clave === COTIZADOR_IPHONE_REFACCIONES_KEY;
    if (!itemId || !costoInput || !ventaInput?.value.trim() || (!permiteCompraPendiente && !costoTexto) || (costoTexto && (!Number.isFinite(costo) || costo < 0)) || !Number.isFinite(venta) || venta < 0) {
        return alert('Ingresa precios válidos, iguales o mayores a cero.');
    }

    const items = obtenerRefaccionesCotizador(clave);
    const item = items.find(registro => String(registro.id) === String(itemId));
    if (!item) return alert('No encontré la refacción que intentas actualizar.');
    const precioVentaCambio = Number(item.precio_venta) !== venta;
    item.precio_costo = costo;
    item.precio_venta = venta;
    item.precio_venta_manual = clave === COTIZADOR_IPHONE_REFACCIONES_KEY
        ? Boolean(item.precio_venta_manual || precioVentaCambio)
        : true;
    item.precio_venta_manual_requerido = false;
    guardarRefaccionesCotizador(items, clave);
    if (clave === COTIZADOR_IPHONE_REFACCIONES_KEY) cargarInventarioCotizadorIphone();
    else cargarInventarioCotizador();
}

function alternarHojaImportacionProveedor(indice, seleccionada) {
    const hoja = importacionProveedorActual?.hojas[indice];
    if (!hoja) return;
    hoja.seleccionada = seleccionada;
    renderizarPrevisualizacionProveedor();
}

function renderizarPrevisualizacionProveedor() {
    if (!importacionProveedorActual) return;
    const hojas = importacionProveedorActual.hojas;
    const tablaIphone = importacionProveedorActual.formato === 'tabla-iphone';
    const tieneCosto = fila => tablaIphone || fila.precio_costo !== null;
    const contenedorHojas = document.getElementById('importacion-proveedor-hojas');
    contenedorHojas.innerHTML = hojas.map((hoja, indice) => {
        const validas = hoja.rows.filter(tieneCosto).length;
        const sinPrecio = hoja.rows.length - validas;
        return `<label class="flex items-start gap-2 border-b border-slate-800 px-3 py-2 text-xs"><input type="checkbox" ${hoja.seleccionada ? 'checked' : ''} onchange="alternarHojaImportacionProveedor(${indice}, this.checked)" class="mt-0.5 accent-emerald-400"><span class="min-w-0 flex-1"><strong class="block text-white">${escaparHTML(hoja.name)}</strong><span class="text-slate-400">${validas} con precio${sinPrecio ? ` · ${sinPrecio} sin precio, se excluyen` : ''}</span>${hoja.error ? `<span class="block text-amber-300">${escaparHTML(hoja.error)}</span>` : ''}</span></label>`;
    }).join('');

    const seleccionadas = hojas.filter(hoja => hoja.seleccionada);
    const filas = seleccionadas.flatMap(hoja => hoja.rows.filter(tieneCosto).map(fila => ({ ...fila, hoja: hoja.name })));
    const muestra = filas.slice(0, 15);
    document.getElementById('importacion-proveedor-resumen').textContent = importacionProveedorActual.formato === 'tabla-iphone'
        ? `${filas.length} pantallas iPhone seleccionadas · se mostrarán ${muestra.length} de ejemplo · la tabla aporta la venta; la compra se busca en el cotizador y queda vacía si no hay coincidencia.`
        : importacionProveedorActual.modo === 'iphone'
        ? `${filas.length} pantallas iPhone seleccionadas · se mostrarán ${muestra.length} de ejemplo · el XLSX aporta el costo y la tabla iPhone define la venta por modelo/calidad; se aplica 25% solo cuando hay precio en esa columna.`
        : `${filas.length} filas seleccionadas · se mostrarán ${muestra.length} de ejemplo · el PDF/Excel del proveedor aporta el costo; tabla iphone.xlsx define la venta especial por modelo y calidad. Las celdas 25% con precio aplican descuento.`;
    document.getElementById('importacion-proveedor-muestra').innerHTML = muestra.length ? `
        <div class="overflow-x-auto"><table class="w-full text-left text-[11px] text-slate-300"><thead><tr class="border-b border-slate-700 text-slate-400"><th class="py-2 pr-3">Hoja</th><th class="py-2 pr-3">Descripción original</th><th class="py-2 pr-3">Tipo sugerido</th><th class="py-2 pr-3">Costo</th><th class="py-2 pr-3">Venta estimada</th></tr></thead><tbody>${muestra.map(fila => { const especial = fila.descuentoAplicado !== undefined ? { descuentoAplicado: fila.descuentoAplicado } : obtenerPrecioEspecialPantallaIphone(fila, importacionProveedorActual.preciosIphone); const precio = fila.precio_venta ?? (especial === undefined ? calcularPrecioVentaCotizador(fila.precio_costo) : especial.precio); const venta = precio == null ? 'Captura manual' : `$${Number(precio).toFixed(2)}${especial?.descuentoAplicado ? ' · 25% aplicado' : ''}`; const costo = fila.precio_costo == null ? 'Pendiente' : `$${Number(fila.precio_costo).toFixed(2)}`; return `<tr class="border-b border-slate-800"><td class="py-2 pr-3">${escaparHTML(fila.hoja)}</td><td class="py-2 pr-3 text-white">${escaparHTML(fila.descripcion)}</td><td class="py-2 pr-3">${escaparHTML(fila.tipo_refaccion)}</td><td class="py-2 pr-3 text-rose-300">${costo}</td><td class="py-2 pr-3 text-emerald-300">${venta}</td></tr>`; }).join('')}</tbody></table></div>` : '<p class="py-8 text-center text-xs text-slate-500">Selecciona una hoja con filas que tengan precio.</p>';
    document.getElementById('importacion-proveedor-confirmar').disabled = filas.length === 0;
    document.getElementById('importacion-proveedor-confirmar').classList.toggle('opacity-50', filas.length === 0);
}

async function importarArchivoProveedor(file, modo = 'general') {
    if (!file) return;
    try {
        if (modo === 'iphone' && !/\.xlsx$/i.test(file.name)) {
            throw new Error('El cotizador especial de pantallas iPhone acepta libros XLSX.');
        }
        if (!ipc && location.protocol === 'file:') {
            throw new Error('La importación necesita el servidor local. Inicia la app con "npm run web" y abre http://localhost:3000, o usa la aplicación de escritorio con "npm start".');
        }

        let resultado;
        if (ipc) {
            resultado = await ipc.invoke('parse-supplier-file', { data: await file.arrayBuffer(), nombre: file.name, mimeType: file.type, modo });
        } else {
            const url = new URL('/api/catalog/preview', location.origin);
            url.searchParams.set('nombre', file.name);
            if (modo === 'iphone') url.searchParams.set('modo', modo);
            const headers = { 'Content-Type': file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') };
            if (sesionActual?.access_token) headers.Authorization = `Bearer ${sesionActual.access_token}`;
            const respuesta = await fetch(url, { method: 'POST', headers, body: file });
            const contenido = await respuesta.text();
            try {
                resultado = JSON.parse(contenido);
            } catch {
                throw new Error(`El servidor respondió algo que no es JSON (${respuesta.status}). Inicia la app con "npm run web" y usa la URL del servidor.`);
            }
            if (!respuesta.ok) throw new Error(resultado.error || `Error leyendo el archivo (${respuesta.status})`);
        }
        if (!resultado.hojas?.length) {
            throw new Error(modo === 'iphone'
                ? 'El XLSX no contiene pantallas iPhone reconocibles con precio de venta.'
                : 'El archivo no contiene hojas con productos reconocibles.');
        }
        const preciosIphone = resultado.formato === 'tabla-iphone' ? [] : await cargarTablaPreciosIphoneCotizador();
        const catalogoGeneral = resultado.formato === 'tabla-iphone' ? obtenerRefaccionesCotizador(COTIZADOR_REFACCIONES_KEY) : [];
        const hojas = resultado.formato === 'tabla-iphone'
            ? resultado.hojas.map(hoja => ({
                ...hoja,
                rows: hoja.rows.map(fila => ({ ...fila, precio_costo: buscarCostoPantallaIphoneEnCotizador(fila, catalogoGeneral) }))
            }))
            : resultado.hojas;
        if (modo === 'iphone' && !hojas.length) throw new Error('El libro no contiene pantallas iPhone con precios reconocibles.');
        importacionProveedorActual = {
            nombre: file.name,
            formato: resultado.formato,
            preciosIphone,
            modo,
            hojas: modo === 'iphone'
                ? hojas.map(hoja => ({ ...hoja, seleccionada: true }))
                : hojas.map(hoja => ({ ...hoja, seleccionada: hoja.tipo_refaccion !== 'Otros' }))
        };
        document.getElementById('importacion-proveedor-titulo').textContent = modo === 'iphone' ? 'Importar pantallas iPhone' : 'Importar catálogo del proveedor';
        document.getElementById('importacion-proveedor-ayuda').textContent = resultado.formato === 'tabla-iphone'
            ? 'La tabla aporta el precio de venta. Se busca el costo en el cotizador general; si no hay coincidencia, queda vacío para editarlo después.'
            : modo === 'iphone'
            ? 'El XLSX del proveedor aporta el costo; la tabla iPhone determina la venta por modelo y calidad.'
            : 'El costo se toma de la lista. La venta estimada usa la regla actual del cotizador. Esto no crea ni modifica existencias físicas.';
        const proveedor = document.getElementById('importacion-proveedor-nombre');
        proveedor.value = /\bag\b/i.test(file.name) ? 'AG Refacción Celular' : '';
        document.getElementById('importacion-proveedor-archivo').textContent = `${file.name} · ${resultado.formato.toUpperCase()}`;
        renderizarPrevisualizacionProveedor();
        document.getElementById('modal-importar-catalogo').classList.remove('hidden');
    } catch (error) {
        alert(`No se pudo leer la lista: ${error.message}`);
    }
}

async function cargarTablaPreciosIphoneCotizador() {
    if (ipc) return ipc.invoke('get-iphone-price-table');
    const headers = {};
    if (sesionActual?.access_token) headers.Authorization = `Bearer ${sesionActual.access_token}`;
    const respuesta = await fetch(new URL('/api/catalog/iphone-prices', location.origin), { headers });
    const resultado = await respuesta.json();
    if (!respuesta.ok) throw new Error(resultado.error || `No se pudo leer tabla iphone.xlsx (${respuesta.status})`);
    return resultado;
}

function cerrarImportacionProveedor() {
    document.getElementById('modal-importar-catalogo').classList.add('hidden');
    document.getElementById('importacion-proveedor-titulo').textContent = 'Importar catálogo del proveedor';
    document.getElementById('importacion-proveedor-ayuda').textContent = 'El costo se toma de la lista. La venta estimada usa la regla actual del cotizador. Esto no crea ni modifica existencias físicas.';
    importacionProveedorActual = null;
}

function normalizarClaveCotizador(valor) {
    return String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function buscarCostoPantallaIphoneEnCotizador(fila, catalogo) {
    const aliases = String(fila.compatibilidad || '').split(/[,/]+|\s+\by\b\s+/i).map(alias => {
        const normalizado = normalizarClaveCotizador(alias);
        return normalizado.startsWith('iphone ') ? normalizado : `iphone ${normalizado}`;
    }).filter(alias => alias !== 'iphone ');
    const calidad = normalizarClaveCotizador(fila.calidad);
    const modificadoresModelo = new Set(['pro', 'promax', 'max', 'plus', 'mini', 'se', 'ultra']);
    const coincidencias = catalogo.filter(item => {
        if (obtenerTipoRefaccionCotizador(item) !== 'Pantallas') return false;
        const descripcion = item.descripcion_proveedor || item.modelo || '';
        const calidadItem = normalizarClaveCotizador(item.calidad || detectarCalidadCotizador(descripcion));
        if (calidadItem !== calidad) return false;
        const compatibilidades = obtenerModelosCompatiblesCotizador(item).map(normalizarClaveCotizador);
        if (aliases.some(alias => compatibilidades.includes(alias))) return true;
        const descripcionNormalizada = normalizarClaveCotizador(descripcion);
        return aliases.some(alias => {
            const indice = descripcionNormalizada.indexOf(alias);
            if (indice < 0) return false;
            const siguiente = descripcionNormalizada.slice(indice + alias.length).trim().split(/\s+/)[0];
            return !modificadoresModelo.has(siguiente);
        });
    });
    const costos = [...new Set(coincidencias.map(item => Number(item.precio_costo)).filter(costo => Number.isFinite(costo) && costo > 0))];
    return costos.length === 1 ? costos[0] : null;
}

function confirmarImportacionProveedor() {
    if (!importacionProveedorActual) return;
    const modoIphone = importacionProveedorActual.modo === 'iphone';
    const claveDestino = modoIphone ? COTIZADOR_IPHONE_REFACCIONES_KEY : COTIZADOR_REFACCIONES_KEY;
    const proveedor = document.getElementById('importacion-proveedor-nombre').value.trim() || 'Proveedor';
    const actuales = obtenerRefaccionesCotizador(claveDestino);
    const catalogoGeneral = modoIphone ? obtenerRefaccionesCotizador(COTIZADOR_REFACCIONES_KEY) : [];
    const porClave = new Map(actuales.map((item, indice) => [`${obtenerTipoRefaccionCotizador(item)}|${normalizarClaveCotizador(item.descripcion_proveedor || item.modelo)}`, indice]));
    let nuevas = 0;
    let actualizadas = 0;
    const fecha = new Date().toISOString();
    const mensajeCosto = importacionProveedorActual.formato === 'tabla-iphone'
        ? 'Los costos no encontrados quedaron vacíos para completarlos después.'
        : 'Las filas sin costo se excluyeron.';

    importacionProveedorActual.hojas.filter(hoja => hoja.seleccionada).forEach(hoja => {
        hoja.rows.filter(fila => fila.precio_costo !== null || importacionProveedorActual.formato === 'tabla-iphone').forEach(fila => {
            const tipo = modoIphone ? 'Pantallas' : tiposRefaccionCotizador.includes(fila.tipo_refaccion) ? fila.tipo_refaccion : hoja.tipo_refaccion || 'Otros';
            const descripcion = String(fila.descripcion || '').trim();
            const clave = `${tipo}|${normalizarClaveCotizador(descripcion)}`;
            const indiceExistente = porClave.get(clave);
            const existente = indiceExistente === undefined ? null : actuales[indiceExistente];
            const precioEspecial = obtenerPrecioEspecialPantallaIphone(fila, importacionProveedorActual.preciosIphone);
            const precioVentaCalculado = fila.precio_venta ?? (precioEspecial === undefined ? calcularPrecioVentaCotizador(fila.precio_costo) : precioEspecial.precio);
            const precioVenta = existente?.precio_venta_manual ? existente.precio_venta : precioVentaCalculado;
            const valores = {
                marca: detectarMarcaCotizador(descripcion),
                modelo: descripcion,
                descripcion_proveedor: descripcion,
                tipo_refaccion: tipo,
                calidad: fila.calidad || detectarCalidadCotizador(descripcion),
                compatibilidad: String(fila.compatibilidad || precioEspecial?.modelo || '').trim(),
                precio_costo: fila.precio_costo == null && importacionProveedorActual.formato === 'tabla-iphone'
                    ? buscarCostoPantallaIphoneEnCotizador(fila, catalogoGeneral)
                    : Number(fila.precio_costo),
                precio_venta: precioVenta ?? 0,
                precio_venta_manual: Boolean(existente?.precio_venta_manual),
                precio_venta_manual_requerido: precioVenta == null,
                proveedor,
                archivo_proveedor: importacionProveedorActual.nombre,
                fecha_actualizacion_proveedor: fecha
            };
            if (indiceExistente === undefined) {
                porClave.set(clave, actuales.length);
                actuales.push({ id: crypto.randomUUID(), ...valores });
                nuevas++;
            } else {
                actuales[indiceExistente] = { ...actuales[indiceExistente], ...valores };
                actualizadas++;
            }
        });
    });

    guardarRefaccionesCotizador(actuales, claveDestino);
    cerrarImportacionProveedor();
    paginaCotizador = 0;
    if (modoIphone) {
        paginaCotizadorIphone = 0;
        cargarInventarioCotizadorIphone();
    } else cargarInventarioCotizador();
    const nombreCatalogo = modoIphone ? 'Cotizador de pantallas iPhone' : 'Catálogo actualizado';
    alert(`${nombreCatalogo}: ${nuevas} nuevas, ${actualizadas} actualizadas. ${mensajeCosto} El inventario físico no se modificó.`);
}

function vaciarInventarioCotizador() {
    if (!confirm('¿Deseas borrar todo el inventario del cotizador?')) return;
    guardarRefaccionesCotizador([]);
    cargarInventarioCotizador();
}

async function cargarListaModulo(clave, contenedor, vacio, formatear) {
    renderLista(await leerModulo(clave), contenedor, vacio, formatear);
}

async function crearCotizacion() {
    const cliente = document.getElementById('cot-cliente').value.trim();
    const detalle = document.getElementById('cot-detalle').value.trim();
    const monto = Number(document.getElementById('cot-monto').value || 0);
    if (!cliente || !detalle || monto <= 0) return alert('Completa cliente, detalle y monto.');
    (await leerModulo('cotizaciones')).push({ id: Date.now(), cliente, detalle, monto, estado: 'Pendiente', fecha: new Date().toISOString() });
    await guardarModulo('cotizaciones');
    ['cot-cliente', 'cot-detalle', 'cot-monto'].forEach(id => document.getElementById(id).value = '');
    cargarListaModulo('cotizaciones', 'lista-cotizaciones', 'No hay cotizaciones.', cotizacion => `<div class="flex justify-between bg-[#131c2e] border border-slate-800 rounded-lg p-3"><span class="text-white">${escaparHTML(cotizacion.cliente)} · ${escaparHTML(cotizacion.detalle)} · ${escaparHTML(cotizacion.estado)}</span><strong class="text-emerald-300">$${cotizacion.monto.toFixed(2)}</strong></div>`);
}

document.addEventListener('DOMContentLoaded', () => {
    const inputProveedor = document.getElementById('cotizador-file-input');
    if (inputProveedor) {
        inputProveedor.addEventListener('change', (event) => {
            const file = event.target.files && event.target.files[0];
            if (file) importarArchivoProveedor(file);
            event.target.value = '';
        });
    }

    const inputIphone = document.getElementById('cotizador-iphone-file-input');
    if (inputIphone) {
        inputIphone.addEventListener('change', event => {
            const file = event.target.files && event.target.files[0];
            if (file) importarArchivoProveedor(file, 'iphone');
            event.target.value = '';
        });
    }

    const buscarIphone = document.getElementById('cotizador-iphone-buscar');
    if (buscarIphone) buscarIphone.addEventListener('input', () => {
        paginaCotizadorIphone = 0;
        cargarInventarioCotizadorIphone();
    });

    const buscador = document.getElementById('cotizador-buscar');
    if (buscador) {
        buscador.addEventListener('input', cargarInventarioCotizador);
    }

    ['cotizador-filtro-marca', 'cotizador-filtro-calidad', 'cotizador-filtro-modelo', 'cotizador-filtro-tipo', 'cotizador-ordenar'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', cargarInventarioCotizador);
    });

    cargarInventarioCotizador();
});

async function cargarEquiposEntregados() {
    const select = document.getElementById('gar-equipo');
    if (!select) return;
    
    let ordenes = [];
    if (ipc) ordenes = await ipc.invoke('get-ordenes');
    else ordenes = JSON.parse(localStorage.getItem('pw_ordenes') || '[]');
    
    const equiposEntregados = ordenes.filter(orden => orden.estado === 'Entregado');
    
    select.innerHTML = '<option value="">-- Seleccionar Equipo Entregado --</option>';
    if (!equiposEntregados.length) {
        select.innerHTML += '<option disabled>No hay equipos entregados</option>';
        return;
    }
    
    equiposEntregados.forEach(orden => {
        const folio = obtenerFolioOrden(orden);
        const label = `${folio} · ${orden.marca || 'Genérica'} ${orden.modelo || 'N/A'}`;
        select.innerHTML += `<option value="${escaparHTML(label)}">${escaparHTML(folio)} · ${escaparHTML(orden.marca || 'Genérica')} ${escaparHTML(orden.modelo || 'N/A')}</option>`;
    });
}

async function registrarGarantia() {
    const folio = document.getElementById('gar-folio').value.trim();
    const cliente = document.getElementById('gar-cliente').value.trim();
    const equipo = document.getElementById('gar-equipo').value.trim();
    const dias = Number(document.getElementById('gar-dias').value || 0);
    if (!folio || !cliente || !equipo || dias <= 0) return alert('Completa todos los datos de la garantía.');
    const inicio = new Date();
    const vence = new Date(inicio.getTime() + dias * 86400000);
    (await leerModulo('garantias')).push({ id: Date.now(), folio, cliente, equipo, vence: vence.toLocaleDateString() });
    await guardarModulo('garantias');
    ['gar-folio', 'gar-cliente', 'gar-dias'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('gar-equipo').value = '';
    cargarListaModulo('garantias', 'lista-garantias', 'No hay garantías registradas.', garantia => `<div class="flex justify-between bg-[#131c2e] border border-slate-800 rounded-lg p-3"><span class="text-white">${escaparHTML(garantia.folio)} · ${escaparHTML(garantia.cliente)} · ${escaparHTML(garantia.equipo)}</span><strong class="text-amber-300">Vence: ${escaparHTML(garantia.vence)}</strong></div>`);
}

async function cargarModulo(seccionId) {
    if (['equipos', 'categorias', 'marcas', 'modelos'].includes(seccionId)) return cargarCatalogo(seccionId);
    if (seccionId === 'inventario') return cargarInventario();
    if (seccionId === 'pos') return cargarPOS();
    if (seccionId === 'caja') {
        cargarCaja();
        cargarReportes();
        return;
    }
    if (seccionId === 'cotizaciones') return cargarListaModulo('cotizaciones', 'lista-cotizaciones', 'No hay cotizaciones.', cotizacion => `<div class="flex justify-between bg-[#131c2e] border border-slate-800 rounded-lg p-3"><span class="text-white">${escaparHTML(cotizacion.cliente)} · ${escaparHTML(cotizacion.detalle)} · ${escaparHTML(cotizacion.estado)}</span><strong class="text-emerald-300">$${cotizacion.monto.toFixed(2)}</strong></div>`);
    if (seccionId === 'facturas') return cargarListaModulo('facturas', 'lista-facturas', 'No hay recibos registrados.', factura => `<div class="flex justify-between bg-[#131c2e] border border-slate-800 rounded-lg p-3"><span class="text-white">${escaparHTML(factura.detalle)} · ${escaparHTML(factura.metodo || 'POS')}</span><strong class="text-emerald-300">$${factura.total.toFixed(2)}</strong></div>`);
    if (seccionId === 'garantias') {
        await cargarEquiposEntregados();
        return cargarListaModulo('garantias', 'lista-garantias', 'No hay garantías registradas.', garantia => `<div class="flex justify-between bg-[#131c2e] border border-slate-800 rounded-lg p-3"><span class="text-white">${escaparHTML(garantia.folio)} · ${escaparHTML(garantia.cliente)} · ${escaparHTML(garantia.equipo)}</span><strong class="text-amber-300">Vence: ${escaparHTML(garantia.vence)}</strong></div>`);
    }
    if (seccionId === 'reportes-caja') {
        return cargarReportes();
    }
}

async function cargarDashboard() {
    const puedeVerOrdenes = tienePermisoActual('reparaciones', 'ver');
    const puedeVerInventario = tienePermisoActual('inventario', 'ver');
    const puedeVerCaja = tienePermisoActual('caja', 'ver');
    const puedeVerGarantias = tienePermisoActual('garantias', 'ver');
    const [ordenes, inventario, caja, garantias] = await Promise.all([
        puedeVerOrdenes ? (ipc ? ipc.invoke('get-ordenes') : JSON.parse(localStorage.getItem('pw_ordenes') || '[]')) : Promise.resolve([]),
        puedeVerInventario ? leerModulo('inventario') : Promise.resolve([]),
        puedeVerCaja ? leerModulo('caja') : Promise.resolve([]),
        puedeVerGarantias ? leerModulo('garantias') : Promise.resolve([])
    ]);
    const abiertas = ordenes.filter(orden => !['Entregado', 'Cancelado'].includes(orden.estado || 'Pendiente')).length;
    const ingresos = caja.filter(movimiento => movimiento.tipo === 'ingreso').reduce((total, movimiento) => total + Number(movimiento.monto || 0), 0);
    const bajoStock = inventario.filter(item => Number(item.stock) <= Number(item.minimo)).length;
    const garantiasActivas = garantias.filter(garantia => new Date(garantia.vence) >= new Date()).length;
    const metricas = [
        ['wrench', 'Órdenes abiertas', puedeVerOrdenes ? abiertas : 'Sin acceso', 'text-blue-300', 'bg-blue-500/10'],
        ['wallet', 'Ingresos registrados', puedeVerCaja ? `$${ingresos.toFixed(2)}` : 'Sin acceso', 'text-emerald-300', 'bg-emerald-500/10'],
        ['package-alert', 'Refacciones bajo mínimo', puedeVerInventario ? bajoStock : 'Sin acceso', 'text-amber-300', 'bg-amber-500/10'],
        ['shield-check', 'Garantías activas', puedeVerGarantias ? garantiasActivas : 'Sin acceso', 'text-violet-300', 'bg-violet-500/10']
    ];
    document.getElementById('dashboard-metricas').innerHTML = metricas.map(([icono, titulo, valor, color, fondo]) => `<div class="bg-[#0d131f] border border-slate-800 rounded-xl p-4"><div class="flex items-center justify-between"><span class="text-xs text-slate-400">${titulo}</span><span class="w-8 h-8 rounded-lg ${fondo} ${color} flex items-center justify-center"><i data-lucide="${icono}" class="w-4 h-4"></i></span></div><strong class="block text-xl text-white mt-3">${valor}</strong></div>`).join('');
    document.getElementById('dashboard-ordenes').innerHTML = !puedeVerOrdenes ? '<p class="text-xs text-slate-500 italic">Sin acceso a reparaciones.</p>' : ordenes.length ? ordenes.slice(0, 5).map(orden => `<div class="flex items-center justify-between gap-3 rounded-lg bg-[#131c2e] p-3"><div class="min-w-0"><strong class="block text-xs text-white truncate">${escaparHTML(obtenerFolioOrden(orden))} · ${escaparHTML(orden.marca)} ${escaparHTML(orden.modelo)}</strong><span class="text-[11px] text-slate-500 truncate block">${escaparHTML(orden.falla)}</span></div><span class="text-[10px] whitespace-nowrap text-slate-300">${escaparHTML(orden.estado || 'Pendiente')}</span></div>`).join('') : '<p class="text-xs text-slate-500 italic">No hay órdenes registradas.</p>';
    document.getElementById('dashboard-inventario').innerHTML = !puedeVerInventario ? '<p class="text-xs text-slate-500 italic">Sin acceso a inventario.</p>' : inventario.length ? inventario.slice().sort((a, b) => (Number(a.stock) - Number(a.minimo)) - (Number(b.stock) - Number(b.minimo))).slice(0, 5).map(item => `<div class="flex items-center justify-between rounded-lg bg-[#131c2e] p-3"><span class="text-xs text-white">${escaparHTML(item.nombre)}</span><span class="text-[11px] ${Number(item.stock) <= Number(item.minimo) ? 'text-amber-300' : 'text-emerald-300'}">${item.stock} disponibles</span></div>`).join('') : '<p class="text-xs text-slate-500 italic">No hay refacciones registradas.</p>';
    lucide.createIcons();
}

async function hashPasswordWeb(password, salt) {
    const datos = new TextEncoder().encode(`${salt}:${password}`);
    const hash = await crypto.subtle.digest('SHA-256', datos);
    return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function obtenerEstadoAuthWeb() {
    return { tieneUsuarios: Boolean(localStorage.getItem('pw_usuario_admin')) };
}

async function configurarAdminWeb(datos) {
    if ((await obtenerEstadoAuthWeb()).tieneUsuarios) throw new Error('La configuración inicial ya fue completada');
    if (!datos.nombre.trim() || !datos.usuario.trim()) throw new Error('Nombre y usuario son obligatorios');
    if (datos.password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres');
    const salt = crypto.randomUUID();
    const passwordHash = await hashPasswordWeb(datos.password, salt);
    const usuario = { id: 1, nombre: datos.nombre.trim(), usuario: datos.usuario.trim().toLowerCase(), salt, passwordHash, rol: 'administrador', sucursal_nombre: 'Sucursal principal' };
    localStorage.setItem('pw_usuario_admin', JSON.stringify(usuario));
    return usuario;
}

async function iniciarSesionWeb(datos) {
    const usuario = JSON.parse(localStorage.getItem('pw_usuario_admin') || 'null');
    if (!usuario || usuario.usuario !== datos.usuario.trim().toLowerCase() || usuario.passwordHash !== await hashPasswordWeb(datos.password, usuario.salt)) {
        throw new Error('Usuario o contraseña incorrectos');
    }
    return usuario;
}

function mostrarErrorAuth(mensaje) {
    const error = document.getElementById('auth-error');
    error.textContent = mensaje;
    error.classList.remove('hidden');
}

function limpiarErrorAuth() {
    const error = document.getElementById('auth-error');
    error.textContent = '';
    error.classList.add('hidden');
}

function cambiarFormularioAuth(formulario) {
    limpiarErrorAuth();
    document.getElementById('auth-login').classList.toggle('hidden', formulario !== 'login');
    document.getElementById('auth-setup').classList.toggle('hidden', formulario !== 'setup');
}

function activarSesion(sesion) {
    sesionActual = sesion;
    Object.keys(modulosBD).forEach(clave => delete modulosBD[clave]);
    document.getElementById('pantalla-auth').classList.add('hidden');
    document.getElementById('header-usuario').textContent = `${sesion.nombre} · ${sesion.sucursal_nombre || 'Sucursal principal'} · ${sesion.rol}`;
    aplicarPermisosInterfaz();
    cargarSelectorSucursales();
    cargarConfiguracion();
    if (tienePermisoActual('clientes', 'ver')) cargarClientes();
    if (tienePermisoActual('reparaciones', 'ver')) cargarOrdenes();
    if (tienePermisoActual('catalogos', 'ver')) {
        cargarCatalogo('marcas');
        cargarCatalogo('modelos');
        cargarCatalogo('categorias');
    }
    cargarDashboard();
}

const permisoPorSeccion = {
    pos: 'pos', configuracion: 'configuracion', clientes: 'clientes', equipos: 'equipos', categorias: 'catalogos',
    marcas: 'catalogos', modelos: 'catalogos', inventario: 'inventario', reparaciones: 'reparaciones', caja: 'caja',
    cotizaciones: 'cotizaciones', facturas: 'facturas', garantias: 'garantias', usuarios: 'tecnicos', sucursales: 'sucursales', permisos: 'usuarios'
};

function tienePermisoActual(modulo, accion = 'ver') {
    if (!sesionActual?.permisos) return true;
    return sesionActual.permisos?.[modulo]?.[accion] === true;
}

function puedeAdministrarUsuarios() {
    return Boolean(ipc && sesionActual?.modalidad === 'local' && tienePermisoActual('usuarios', 'ver'));
}

function aplicarPermisosInterfaz() {
    if (!sesionActual?.permisos) return;
    Object.entries(permisoPorSeccion).forEach(([seccion, modulo]) => {
        const boton = document.getElementById(`btn-${seccion}`);
        if (boton) boton.classList.toggle('hidden', !tienePermisoActual(modulo, 'ver'));
    });
    const botonPermisos = document.getElementById('btn-permisos');
    if (botonPermisos) botonPermisos.classList.toggle('hidden', !puedeAdministrarUsuarios());
}

async function cargarSelectorSucursales() {
    const selector = document.getElementById('selector-sucursal');
    if (!selector || !sesionActual) return;
    const sucursales = ipc ? await ipc.invoke('get-sucursales') : JSON.parse(localStorage.getItem('pw_sucursales') || '[]');
    selector.innerHTML = sucursales.map(sucursal => `<option value="${sucursal.id}">${escaparHTML(sucursal.nombre)}</option>`).join('');
    selector.value = String(sesionActual.sucursal_id);
    selector.classList.toggle('hidden', sucursales.length <= 1);
}

async function cambiarSucursalDesdeUI(sucursalId) {
    if (!sucursalId || String(sucursalId) === String(sesionActual?.sucursal_id)) return;
    try {
        sesionActual = ipc ? await ipc.invoke('switch-sucursal', Number(sucursalId)) : { ...sesionActual, sucursal_id: Number(sucursalId) };
        Object.keys(modulosBD).forEach(clave => delete modulosBD[clave]);
        document.getElementById('header-usuario').textContent = `${sesionActual.nombre} · ${sesionActual.sucursal_nombre || 'Sucursal activa'} · ${sesionActual.rol}`;
        nav('escritorio');
        const cargas = [cargarConfiguracion(), cargarDashboard()];
        if (tienePermisoActual('clientes', 'ver')) cargas.push(cargarClientes());
        if (tienePermisoActual('reparaciones', 'ver')) cargas.push(cargarOrdenes());
        await Promise.all(cargas);
        await cargarSelectorSucursales();
    } catch (error) {
        alert(`No se pudo cambiar de sucursal: ${error.message}`);
        cargarSelectorSucursales();
    }
}

function aplicarTema(tema) {
    const temas = ['aurora', 'carbon', 'ocean', 'ember', 'cyberpunk', 'redline', 'cupertino', 'violet', 'titanium'];
    const seleccionado = temas.includes(tema) ? tema : 'aurora';
    document.body.dataset.theme = seleccionado;
    localStorage.setItem('pw_tema', seleccionado);
    const selector = document.getElementById('cfg-tema');
    if (selector) selector.value = seleccionado;
    if (ipc && sesionActual) ipc.invoke('save-config', { clave: 'tema_interfaz', valor: seleccionado }).catch(() => {});
}

function aplicarDensidad(densidad) {
    const seleccionada = ['normal', 'compacta'].includes(densidad) ? densidad : 'normal';
    document.body.dataset.density = seleccionada === 'compacta' ? 'compact' : 'comfortable';
    localStorage.setItem('pw_densidad', seleccionada);
    const selector = document.getElementById('cfg-densidad');
    if (selector) selector.value = seleccionada;
    if (ipc && sesionActual) ipc.invoke('save-config', { clave: 'interfaz_densidad', valor: seleccionada }).catch(() => {});
}

function aplicarMovimientoReducido(reducir) {
    const activado = Boolean(reducir);
    document.body.dataset.motion = activado ? 'reduced' : 'full';
    localStorage.setItem('pw_reducir_movimiento', activado ? '1' : '0');
    const control = document.getElementById('cfg-reducir-movimiento');
    if (control) control.checked = activado;
    if (ipc && sesionActual) ipc.invoke('save-config', { clave: 'interfaz_reducir_movimiento', valor: activado ? '1' : '0' }).catch(() => {});
}

async function actualizarCatalogoOnline() {
    if (!ipc) return;
    try {
        const resultado = await ipc.invoke('refresh-online-catalog');
        if (resultado.nuevos > 0) {
            Object.keys(modulosBD).forEach(clave => delete modulosBD[clave]);
            await Promise.all([cargarCatalogo('marcas'), cargarCatalogo('modelos')]);
        }
        console.info(`Catálogo online actualizado: ${resultado.nuevos} modelos nuevos`);
    } catch (error) {
        console.warn('No se pudo actualizar el catálogo online:', error.message);
    }
}

async function inicializarAutenticacion() {
    if (ipc) {
        const recordado = await ipc.invoke('get-remembered-login');
        if (recordado) {
            document.getElementById('login-usuario').value = recordado.usuario || '';
            document.getElementById('login-password').value = recordado.password || '';
            document.getElementById('login-recordar').checked = true;
        }
    } else {
        document.getElementById('login-usuario').value = localStorage.getItem('pw_usuario_recordado') || '';
    }
    const estado = ipc ? await ipc.invoke('get-auth-status') : await obtenerEstadoAuthWeb();
    if (!estado.tieneUsuarios) {
        document.getElementById('auth-setup').classList.remove('hidden');
        document.getElementById('auth-login').classList.add('hidden');
        document.getElementById('auth-subtitulo').textContent = 'Crea el administrador de esta instalación para comenzar.';
        return;
    }
    document.getElementById('auth-login').classList.remove('hidden');
    document.getElementById('auth-setup').classList.add('hidden');
}

function seleccionarModalidad(modalidad) {
    document.getElementById('pantalla-modalidad').classList.add('hidden');
    document.getElementById('pantalla-auth').classList.remove('hidden');
    document.getElementById('auth-login').classList.toggle('hidden', modalidad !== 'local');
    document.getElementById('auth-sync').classList.toggle('hidden', modalidad !== 'sincronizada');
    document.getElementById('auth-setup').classList.add('hidden');
    document.getElementById('auth-subtitulo').textContent = modalidad === 'local'
        ? 'Inicia sesión localmente en este equipo.'
        : 'Valida tu correo, contraseña y licencia en el servidor central.';
    if (modalidad === 'sincronizada' && !ipc && location.protocol !== 'file:') {
        document.getElementById('sync-url').value = location.origin;
        document.getElementById('sync-url').readOnly = true;
    }
    if (modalidad === 'local') inicializarAutenticacion();
}

function volverASeleccionModalidad() {
    document.getElementById('pantalla-auth').classList.add('hidden');
    document.getElementById('pantalla-modalidad').classList.remove('hidden');
    limpiarErrorAuth();
}

async function iniciarSesion() {
    limpiarErrorAuth();
    const datos = {
        url: document.getElementById('local-url').value,
        usuario: document.getElementById('login-usuario').value,
        password: document.getElementById('login-password').value,
        recordar: document.getElementById('login-recordar').checked
    };
    try {
        const sesion = ipc ? await ipc.invoke('login', datos) : await iniciarSesionWeb(datos);
        if (!ipc) {
            if (datos.recordar) localStorage.setItem('pw_usuario_recordado', datos.usuario.trim().toLowerCase());
            else localStorage.removeItem('pw_usuario_recordado');
        }
        activarSesion(sesion);
    } catch (error) {
        mostrarErrorAuth(error.message);
    }
}

async function iniciarSesionSincronizada() {
    limpiarErrorAuth();
    const datos = {
        url: document.getElementById('sync-url').value,
        email: document.getElementById('sync-email').value,
        password: document.getElementById('sync-password').value
    };
    try {
        const baseUrl = normalizarUrlServidorSync(datos.url);
        if (ipc) {
            const sesion = await ipc.invoke('login-online', { url: baseUrl, identificador: datos.email, email: datos.email, password: datos.password });
            sesion.sync_url = baseUrl;
            await ipc.invoke('sync-now', { url: baseUrl, token: '' });
            activarSesion(sesion);
            return;
        }
        const respuesta = await fetch(`${baseUrl}/api/license/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identificador: datos.email, email: datos.email, password: datos.password })
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok) throw new Error(resultado.error || 'No se pudo validar la licencia');
        if (!resultado.accessToken) throw new Error('El servidor no entregó una sesión segura para sincronizar');
        const sesion = {
            id: resultado.usuarioId || 0,
            nombre: resultado.nombre || resultado.email,
            usuario: resultado.usuario || resultado.email,
            rol: resultado.rol || 'usuario',
            organizacion_id: resultado.organizacionId || resultado.organizacion_id || resultado.organizacionNombre,
            sucursal_id: resultado.sucursalId || resultado.sucursal_id || resultado.sucursalNombre,
            organizacion_nombre: resultado.organizacionNombre,
            sucursal_nombre: resultado.sucursalNombre,
            modalidad: 'sincronizada',
            plan: 'membresia',
            sync_url: baseUrl,
            access_token: resultado.accessToken
        };
        const sesionAnterior = sesionActual;
        sesionActual = sesion;
        migrarDatosWebSinSucursal(sesion);
        try {
            await sincronizarSnapshotWeb(sesion, true);
        } catch (error) {
            sesionActual = sesionAnterior;
            throw error;
        }
        activarSesion(sesion);
    } catch (error) {
        mostrarErrorAuth(error.message);
    }
}

async function crearAdministrador() {
    limpiarErrorAuth();
    const datos = {
        nombre: document.getElementById('setup-nombre').value,
        usuario: document.getElementById('setup-usuario').value,
        password: document.getElementById('setup-password').value
    };
    if (datos.password !== document.getElementById('setup-confirmar').value) {
        mostrarErrorAuth('Las contraseñas no coinciden');
        return;
    }
    try {
        const sesion = ipc ? await ipc.invoke('setup-admin', datos) : await configurarAdminWeb(datos);
        activarSesion(sesion);
    } catch (error) {
        mostrarErrorAuth(error.message);
    }
}

async function cerrarSesion() {
    if (!confirm('¿Deseas cerrar la sesión actual?')) return;
    if (ipc) await ipc.invoke('logout');
    sesionActual = null;
    document.getElementById('pantalla-auth').classList.remove('hidden');
    document.getElementById('auth-subtitulo').textContent = 'Inicia sesión para acceder al sistema.';
    cambiarFormularioAuth('login');
    document.getElementById('login-password').value = '';
}

// Navegación entre Secciones
function nav(seccionId) {
    const moduloProtegido = permisoPorSeccion[seccionId];
    if (sesionActual?.permisos && moduloProtegido && !tienePermisoActual(moduloProtegido, 'ver')) return;
    if (seccionId === 'permisos' && !puedeAdministrarUsuarios()) return;
    document.querySelectorAll('main > section, #sec-usuarios, #sec-clientes, #sec-sucursales').forEach(sec => sec.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('bg-[#0d2319]', 'text-[#00ff66]', 'neon-border');
        btn.classList.add('text-slate-300', 'text-slate-400');
    });

    const secObj = document.getElementById(`sec-${seccionId}`);
    if (secObj) secObj.classList.remove('hidden');

    const btnActivo = document.getElementById(`btn-${seccionId}`);
    if (btnActivo) {
        btnActivo.classList.add('bg-[#0d2319]', 'text-[#00ff66]', 'neon-border');
        btnActivo.classList.remove('text-slate-300', 'text-slate-400');
    }

    if (seccionId === 'reparaciones') cargarOrdenes();
    if (seccionId === 'clientes') cargarClientes();
    if (seccionId === 'inventario') cargarInventario();
    if (seccionId === 'cotizaciones') cargarInventarioCotizador();
    if (seccionId === 'permisos') cargarPanelUsuarios();
    cargarModulo(seccionId);
}

// Alternar visibilidad de grupos
function toggleGrupo(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden');
}

// Configuración de Taller
function claveConfiguracionFolio(campo, sesion = sesionActual) {
    const organizacionId = sesion?.organizacion_id || 1;
    const sucursalId = sesion?.sucursal_id || 1;
    return `folio_${campo}_${organizacionId}_${sucursalId}`;
}

function obtenerFolioOrden(orden) {
    return String(orden?.folio || `FOL-${orden?.id ?? ''}`);
}

async function reservarFolioOrdenWeb() {
    const configuracion = JSON.parse(localStorage.getItem('pw_config') || '{}');
    const prefijo = String(configuracion[claveConfiguracionFolio('prefijo')] || 'A').trim().toUpperCase();
    const digitos = Math.max(1, Math.min(10, Number.parseInt(configuracion[claveConfiguracionFolio('digitos')] || '4', 10) || 4));
    const inicio = Math.max(1, Number.parseInt(configuracion[claveConfiguracionFolio('inicio')] || '1', 10) || 1);
    if (!/^[A-Z]$/.test(prefijo)) throw new Error('El prefijo del folio debe ser una sola letra.');

    if (sesionActual?.access_token && sesionActual.sync_url) {
        const respuesta = await fetch(new URL('/api/orders/folio', sesionActual.sync_url), {
            method: 'POST',
            headers: { Authorization: `Bearer ${sesionActual.access_token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ organizacionId: sesionActual.organizacion_id, sucursalId: sesionActual.sucursal_id, inicio })
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok) throw new Error(resultado.error || 'No se pudo reservar el folio en el servidor.');
        return { folio: `${prefijo}-${String(resultado.numero).padStart(digitos, '0')}`, folio_numero: resultado.numero };
    }

    const claveSecuencia = `pw_ultimo_folio_${sesionActual?.organizacion_id || 1}_${sesionActual?.sucursal_id || 1}`;
    const anterior = Number.parseInt(localStorage.getItem(claveSecuencia) || '0', 10) || 0;
    const numero = Math.max(anterior + 1, inicio);
    localStorage.setItem(claveSecuencia, String(numero));
    return { folio: `${prefijo}-${String(numero).padStart(digitos, '0')}`, folio_numero: numero };
}

async function cargarConfiguracion() {
    let config = {};
    if (ipc) config = await ipc.invoke('get-config');
    else config = JSON.parse(localStorage.getItem('pw_config') || '{}');

    aplicarTema(config.tema_interfaz || localStorage.getItem('pw_tema') || 'aurora');
    aplicarDensidad(config.interfaz_densidad || localStorage.getItem('pw_densidad') || 'normal');
    aplicarMovimientoReducido((config.interfaz_reducir_movimiento ?? localStorage.getItem('pw_reducir_movimiento') ?? '0') === '1');

    if (config.taller_nombre === 'PandoWorkshop') {
        config.taller_nombre = 'Mi taller de reparaciones';
        if (!ipc) localStorage.setItem('pw_config', JSON.stringify(config));
    }

    if (config.taller_nombre) {
        document.getElementById('app-taller-nombre').innerText = config.taller_nombre;
        document.getElementById('header-taller-nombre').innerText = config.taller_nombre;
        document.getElementById('cfg-nombre-taller').value = config.taller_nombre;
    }
    if (config.taller_logo) {
        document.getElementById('logo-icon-default').classList.add('hidden');
        const img = document.getElementById('logo-img-custom');
        img.src = config.taller_logo;
        img.classList.remove('hidden');
    }

    const camposConfig = {
        'cfg-pais': config.region_pais || 'MX',
        'cfg-moneda': config.region_moneda || 'MXN',
        'cfg-formato-fecha': config.region_formato_fecha || 'DD/MM/YYYY',
        'cfg-zona-horaria': config.region_zona_horaria || 'America/Mexico_City',
        'cfg-separador-decimal': config.region_separador_decimal || '.',
        'cfg-pie-ticket': config.ticket_pie_texto || 'Gracias por confiar en nosotros.',
        'cfg-sync-url': config.sync_url || (ipc ? 'http://localhost:3000' : location.origin),
        'cfg-sync-token': ipc ? config.sync_token || '' : ''
    };
    Object.entries(camposConfig).forEach(([id, valor]) => {
        const campo = document.getElementById(id);
        if (campo) campo.value = valor;
    });
    const clavePrefijo = claveConfiguracionFolio('prefijo');
    const claveInicio = claveConfiguracionFolio('inicio');
    const claveDigitos = claveConfiguracionFolio('digitos');
    document.getElementById('cfg-folio-prefijo').value = config[clavePrefijo] || 'A';
    document.getElementById('cfg-folio-inicio').value = config[claveInicio] || '1';
    document.getElementById('cfg-folio-digitos').value = config[claveDigitos] || '4';
    document.getElementById('cfg-folio-sucursal').textContent = `Organización: ${sesionActual?.organizacion_nombre || sesionActual?.organizacion_id || 'Local'} · Sucursal: ${sesionActual?.sucursal_nombre || sesionActual?.sucursal_id || 'Principal'}`;
    document.getElementById('cfg-ticket-mostrar-logo').checked = config.ticket_mostrar_logo !== '0';
    document.getElementById('cfg-ticket-mostrar-nombre').checked = config.ticket_mostrar_nombre !== '0';
}

function convertirImagenABase64(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => document.getElementById('cfg-logo-base64').value = e.target.result;
        reader.readAsDataURL(file);
    }
}

async function guardarAjustesTaller() {
    const prefijoFolio = document.getElementById('cfg-folio-prefijo').value.trim().toUpperCase();
    const inicioFolio = Number(document.getElementById('cfg-folio-inicio').value);
    const digitosFolio = Number(document.getElementById('cfg-folio-digitos').value);
    if (!/^[A-Z]$/.test(prefijoFolio)) return alert('El prefijo del folio debe ser una sola letra.');
    if (!Number.isSafeInteger(inicioFolio) || inicioFolio < 1) return alert('El siguiente número del folio debe ser un entero mayor que cero.');
    if (!Number.isInteger(digitosFolio) || digitosFolio < 1 || digitosFolio > 10) return alert('Los dígitos del folio deben estar entre 1 y 10.');

    const nuevoNombre = document.getElementById('cfg-nombre-taller').value || 'Mi taller de reparaciones';
    const nuevoLogo = document.getElementById('cfg-logo-base64').value || '';
    const configuracion = {
        taller_nombre: nuevoNombre,
        taller_logo: nuevoLogo,
        region_pais: document.getElementById('cfg-pais').value,
        region_moneda: document.getElementById('cfg-moneda').value,
        region_formato_fecha: document.getElementById('cfg-formato-fecha').value,
        region_zona_horaria: document.getElementById('cfg-zona-horaria').value,
        region_separador_decimal: document.getElementById('cfg-separador-decimal').value,
        ticket_pie_texto: document.getElementById('cfg-pie-ticket').value.trim(),
        ticket_mostrar_logo: document.getElementById('cfg-ticket-mostrar-logo').checked ? '1' : '0',
        ticket_mostrar_nombre: document.getElementById('cfg-ticket-mostrar-nombre').checked ? '1' : '0',
        sync_url: document.getElementById('cfg-sync-url').value.trim(),
        sync_token: document.getElementById('cfg-sync-token').value.trim(),
        [claveConfiguracionFolio('prefijo')]: prefijoFolio,
        [claveConfiguracionFolio('inicio')]: String(inicioFolio),
        [claveConfiguracionFolio('digitos')]: String(digitosFolio)
    };

    if (ipc) {
        await Promise.all(Object.entries(configuracion).map(([clave, valor]) => ipc.invoke('save-config', { clave, valor })));
    } else {
        const anterior = JSON.parse(localStorage.getItem('pw_config') || '{}');
        localStorage.setItem('pw_config', JSON.stringify({ ...anterior, ...configuracion }));
        if (sesionActual?.modalidad === 'sincronizada') await sincronizarSnapshotWeb(sesionActual);
    }
    await cargarConfiguracion();
    alert('¡Configuración guardada exitosamente!');
}

async function sincronizarAhora() {
    const url = document.getElementById('cfg-sync-url').value.trim();
    const token = document.getElementById('cfg-sync-token').value.trim();
    const estado = document.getElementById('sync-estado');
    estado.textContent = 'Sincronizando...';
    estado.className = 'text-[11px] text-amber-300';
    try {
        if (ipc) {
            const resultado = await ipc.invoke('sync-now', { url, token });
            estado.textContent = `Sincronizado: ${resultado.modulos.length} módulos`;
        } else {
            if (!sesionActual?.access_token) throw new Error('Inicia sesión con tu suscripción antes de sincronizar');
            sesionActual.sync_url = url.replace(/\/$/, '') || location.origin;
            await sincronizarSnapshotWeb(sesionActual);
            estado.textContent = 'Sincronización completada';
        }
        estado.className = 'text-[11px] text-emerald-300';
        Object.keys(modulosBD).forEach(clave => delete modulosBD[clave]);
        cargarModulo('pos');
    } catch (error) {
        estado.textContent = error.message;
        estado.className = 'text-[11px] text-rose-300';
    }
}

// Carga dinámica de modelos
async function cargarModelosPorMarca() {
    const marca = document.getElementById('rep-marca').value;
    const select = document.getElementById('rep-modelo');
    select.innerHTML = '<option value="">-- Selecciona modelo --</option>';
    const modelosDB = await leerModulo('modelos');
    const modelos = modelosDB.filter(modelo => modelo.marca === marca).map(modelo => modelo.nombre);
    const modelosFinales = [...new Set(modelos)].sort((a, b) => a.localeCompare(b));
    modelosFinales.forEach(modelo => select.innerHTML += `<option value="${escaparHTML(modelo)}">${escaparHTML(modelo)}</option>`);
}

function mostrarGuiaControladores(mostrar = true) {
    document.getElementById('rep-device-drivers')?.classList.toggle('hidden', !mostrar);
}

async function aplicarDatosDispositivo(dispositivo) {
    const estado = document.getElementById('rep-device-status');
    const marca = document.getElementById('rep-marca');
    const modelo = document.getElementById('rep-modelo');
    const identificador = document.getElementById('rep-imei');
    const sistema = document.getElementById('rep-sistema-detectado');
    const yaTieneDatos = marca.value || modelo.value || identificador.value;
    if (yaTieneDatos && !confirm('La lectura reemplazará marca, modelo e identificador actuales. ¿Continuar?')) {
        estado.textContent = 'Lectura cancelada; se conservaron los datos actuales.';
        return false;
    }

    const tipoEquipo = document.getElementById('rep-tipo-equipo');
    if (dispositivo.tipo_equipo) tipoEquipo.value = dispositivo.tipo_equipo;
    if (dispositivo.marca && ![...marca.options].some(opcion => opcion.value === dispositivo.marca)) {
        marca.add(new Option(dispositivo.marca, dispositivo.marca));
    }
    if (dispositivo.marca) {
        marca.value = dispositivo.marca;
        await cargarModelosPorMarca();
    }
    if (dispositivo.modelo) {
        if (![...modelo.options].some(opcion => opcion.value === dispositivo.modelo)) {
            modelo.add(new Option(dispositivo.modelo, dispositivo.modelo));
        }
        modelo.value = dispositivo.modelo;
    }
    if (dispositivo.identificador) identificador.value = dispositivo.identificador;
    if (dispositivo.sistema) sistema.value = dispositivo.sistema;
    const detallesTecnicos = [
        dispositivo.sistema,
        dispositivo.imei2 ? `IMEI2: ${dispositivo.imei2}` : '',
        dispositivo.frp ? `FRP: ${dispositivo.frp}` : '',
        dispositivo.security_patch ? `Parche: ${dispositivo.security_patch}` : ''
    ].filter(Boolean);
    const diagnosticoTecnico = [...detallesTecnicos, dispositivo.tipo_identificador].filter(Boolean).join(' · ');
    if (diagnosticoTecnico) sistema.value = diagnosticoTecnico;
    const etiquetaEquipo = [dispositivo.marca, dispositivo.modelo].filter(Boolean).join(' ');
    estado.textContent = `${dispositivo.plataforma}: ${etiquetaEquipo}${detallesTecnicos.length ? ` · ${detallesTecnicos.join(' · ')}` : dispositivo.tipo_identificador ? ` · ${dispositivo.tipo_identificador}` : ''}`;
    return true;
}

async function reconocerTelefonoConectado() {
    const estado = document.getElementById('rep-device-status');
    mostrarGuiaControladores(false);
    if (!ipc) {
        estado.textContent = 'La lectura USB requiere la aplicación de escritorio; el navegador web no puede ejecutar ADB ni los controladores locales.';
        mostrarGuiaControladores(true);
        return;
    }

    estado.textContent = 'Buscando teléfono autorizado por USB…';
    try {
        const resultado = await ipc.invoke('identify-device');
        if (resultado.status !== 'found') {
            const mensajes = {
                'missing-tools': 'No se encontraron ADB ni las herramientas Apple. Instala las herramientas/controladores y vuelve a intentar.',
                'no-device': 'No se detectó un teléfono. Revisa cable, modo USB y controladores.',
                unauthorized: 'El teléfono Android está conectado, pero falta aceptar la autorización de depuración USB en el dispositivo.',
                multiple: 'Hay varios teléfonos conectados. Desconecta los demás y vuelve a intentar.',
                'mtp-partial': 'Windows detectó el teléfono por MTP, pero no publicó un modelo legible. Se omitieron los campos que no están disponibles; prueba con otro modo USB si necesitas identificación completa.',
                error: resultado.message || 'No se pudo consultar el dispositivo.'
            };
            estado.textContent = mensajes[resultado.status] || 'No se pudo identificar el teléfono conectado.';
            mostrarGuiaControladores(true);
            return;
        }

        await aplicarDatosDispositivo(resultado.device);
    } catch (error) {
        estado.textContent = `No se pudo identificar el teléfono: ${error.message}`;
        mostrarGuiaControladores(true);
    }
}

// ==========================================
// CLIENTES (Cargar, Guardar y Eliminar)
// ==========================================

async function cargarClientes() {
    if (ipc) clientesBD = await ipc.invoke('get-clientes');
    else clientesBD = JSON.parse(localStorage.getItem('pw_clientes') || '[]');
    
    const cont = document.getElementById('lista-clientes-tabla');
    if (!clientesBD.length) {
        cont.innerHTML = `<p class="text-slate-500 italic">No hay clientes registrados.</p>`;
        return;
    }
    
    let html = '<div class="space-y-2">';
    clientesBD.forEach(c => {
        html += `<div class="bg-[#131c2e] p-3 rounded-xl border border-slate-800/80 flex justify-between items-center hover:border-slate-700 transition">
            <div>
                <div class="font-bold text-white">${escaparHTML(c.nombre)}</div>
                <div class="text-[11px] text-slate-400">${escaparHTML(c.telefono)} ${c.email ? '| ' + escaparHTML(c.email) : ''}</div>
            </div>
            <div class="flex items-center gap-1">
                <button onclick="verHistorialCliente('${c.id}')" class="p-2 text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 rounded-lg transition" title="Ver historial"><i data-lucide="history" class="w-4 h-4"></i></button>
                <button onclick="eliminarCliente('${c.id}')" class="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition" title="Eliminar cliente"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </div>
        </div>`;
    });
    
    cont.innerHTML = html + '</div>';
    lucide.createIcons();
}

async function guardarCliente() {
    const nombre = document.getElementById('cli-nombre').value;
    const telefono = document.getElementById('cli-telefono').value;
    if (!nombre || !telefono) return alert('Por favor completa Nombre y Teléfono');

    if (ipc) await ipc.invoke('add-cliente', { nombre, telefono, email: document.getElementById('cli-email').value });
    else {
        clientesBD.push({ id: Date.now(), nombre, telefono, email: document.getElementById('cli-email').value });
        localStorage.setItem('pw_clientes', JSON.stringify(clientesBD));
    }
    
    document.getElementById('cli-nombre').value = '';
    document.getElementById('cli-telefono').value = '';
    document.getElementById('cli-email').value = '';
    
    cargarClientes();
}

async function eliminarCliente(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) return;

    if (ipc) {
        await ipc.invoke('delete-cliente', id);
    } else {
        clientesBD = clientesBD.filter(c => c.id != id);
        localStorage.setItem('pw_clientes', JSON.stringify(clientesBD));
    }
    
    cargarClientes();
}

// ==========================================
// REPARACIONES / ÓRDENES Y ESTADOS
// ==========================================

function obtenerClaseEstado(estado) {
    switch (estado) {
        case 'Pendiente':
            return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
        case 'En Diagnóstico':
            return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
        case 'Esperando Refacción':
            return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
        case 'Listo':
            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        case 'Entregado':
            return 'bg-slate-700/30 text-slate-400 border-slate-700';
        case 'Cancelado':
            return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
        default:
            return 'bg-slate-800 text-slate-300 border-slate-700';
    }
}

function obtenerDatoQROrden(orden) {
    if (sesionActual?.modalidad === 'sincronizada' && sesionActual.sync_url && orden.token_seguimiento) {
        return new URL(`/seguimiento.html?token=${encodeURIComponent(orden.token_seguimiento)}`, sesionActual.sync_url).toString();
    }
    return `${obtenerFolioOrden(orden)}|${orden.marca} ${orden.modelo}|${orden.estado || 'Pendiente'}`;
}

async function cambiarEstadoOrden(id, nuevoEstado) {
    const ordenActual = ordenesBD.find(orden => String(orden.id) === String(id));
    const estadoAnterior = ordenActual?.estado || 'Pendiente';
    if (nuevoEstado === 'Entregado' && estadoAnterior !== 'Entregado') return abrirCobroEntrega(id);
    if (ipc) {
        await ipc.invoke('update-estado-orden', { id, estado: nuevoEstado });
    } else {
        const orden = ordenesBD.find(o => o.id == id);
        if (orden) {
            orden.estado = nuevoEstado;
            orden.historial_estados = orden.historial_estados || [];
            if (estadoAnterior !== nuevoEstado) orden.historial_estados.push({ estado_anterior: estadoAnterior, estado_nuevo: nuevoEstado, fecha: new Date().toISOString(), nota: 'Cambio desde la lista de órdenes' });
            localStorage.setItem('pw_ordenes', JSON.stringify(ordenesBD));
        }
    }
    
    await cargarOrdenes();
    if (estadoAnterior !== nuevoEstado && confirm('Estado actualizado. ¿Preparar el aviso para el cliente por WhatsApp?')) abrirWhatsAppEstadoOrden(id);
}

let cobroEntregaPendiente = null;

function obtenerImportePagosReparacion(ventas, reparacionId) {
    return ventas.filter(venta => {
        if (venta.origen !== 'Reparación') return false;
        let detalles = venta.detalles;
        if (typeof detalles === 'string') {
            try { detalles = JSON.parse(detalles); } catch { detalles = []; }
        }
        const orden = ordenesBD.find(item => Number(item.id) === Number(reparacionId));
        return (orden && String(venta.detalle || '').includes(`${obtenerFolioOrden(orden)} ·`))
            || String(venta.detalle || '').includes(`FOL-${reparacionId} ·`)
            || (Array.isArray(detalles) && detalles.some(item => Number(item.reparacion_id) === Number(reparacionId)));
    }).reduce((total, venta) => total + Number(venta.total || 0), 0);
}

async function abrirCobroEntrega(reparacionId) {
    try {
        if (sesionActual?.modalidad === 'sincronizada') {
            if (ipc) await ipc.invoke('sync-pull', { url: sesionActual.sync_url });
            else await sincronizarSnapshotWeb(sesionActual);
        }
        const [ordenes, ventas] = await Promise.all([
            ipc ? ipc.invoke('get-ordenes') : Promise.resolve(JSON.parse(localStorage.getItem('pw_ordenes') || '[]')),
            ipc ? ipc.invoke('get-ventas') : Promise.resolve(JSON.parse(localStorage.getItem('pw_facturas') || '[]'))
        ]);
        ordenesBD = ordenes;
        const orden = ordenes.find(item => String(item.id) === String(reparacionId));
        if (!orden) throw new Error('No se encontró la orden. Actualiza y vuelve a intentarlo.');
        if (orden.estado === 'Entregado') throw new Error('Esta orden ya fue entregada.');
        if (orden.estado === 'Cancelado') throw new Error('No se puede cobrar una orden cancelada.');
        const abonos = Number(orden.anticipo || 0) + obtenerImportePagosReparacion(ventas, reparacionId);
        const saldo = Math.max(0, Number(orden.costo_estimado || 0) - abonos);
        cobroEntregaPendiente = { id: orden.id, saldo, detalleAbierto: Boolean(document.querySelector('[data-modal-reparacion="true"]')) };
        document.getElementById('cobro-entrega-folio').textContent = obtenerFolioOrden(orden);
        document.getElementById('cobro-entrega-equipo').textContent = `${orden.marca} ${orden.modelo} · ${orden.cliente_nombre || 'Cliente'}`;
        document.getElementById('cobro-total').textContent = `$${Number(orden.costo_estimado || 0).toFixed(2)}`;
        document.getElementById('cobro-abonos').textContent = `$${abonos.toFixed(2)}`;
        document.getElementById('cobro-saldo').textContent = `$${saldo.toFixed(2)}`;
        document.getElementById('cobro-confirmar').textContent = saldo > 0 ? 'Cobrar y entregar' : 'Entregar equipo';
        document.getElementById('modal-cobro-entrega').classList.remove('hidden');
    } catch (error) {
        alert(`No se abrió el cobro: ${error.message}`);
        await cargarOrdenes();
    }
}

async function cancelarCobroEntrega() {
    const pendiente = cobroEntregaPendiente;
    cobroEntregaPendiente = null;
    document.getElementById('modal-cobro-entrega').classList.add('hidden');
    await cargarOrdenes();
    if (pendiente?.detalleAbierto) {
        const reparacion = ordenesBD.find(item => String(item.id) === String(pendiente.id));
        const selector = document.getElementById('detalle-estado-select');
        if (selector && reparacion) selector.value = reparacion.estado || 'Pendiente';
    }
}

async function confirmarCobroEntrega() {
    if (!cobroEntregaPendiente) return;
    const boton = document.getElementById('cobro-confirmar');
    boton.disabled = true;
    const pendiente = cobroEntregaPendiente;
    const metodo = document.getElementById('cobro-metodo').value;
    try {
        if (ipc) {
            await ipc.invoke('cobrar-reparacion', { id: pendiente.id, monto: pendiente.saldo, metodo });
        } else {
            const ordenes = JSON.parse(localStorage.getItem('pw_ordenes') || '[]');
            const orden = ordenes.find(item => String(item.id) === String(pendiente.id));
            if (!orden || orden.estado === 'Entregado') throw new Error('La orden ya no está pendiente de entrega.');
            const syncId = crypto.randomUUID();
            const fecha = new Date().toISOString();
            if (pendiente.saldo > 0) {
                const ventas = JSON.parse(localStorage.getItem('pw_facturas') || '[]');
                ventas.push({
                    id: Date.now(), sync_id: syncId, origen: 'Reparación', reparacion_id: orden.id,
                    detalle: `Cobro reparación ${obtenerFolioOrden(orden)} · ${orden.marca} ${orden.modelo}`,
                    cantidad: 1, total: pendiente.saldo, subtotal: pendiente.saldo, descuento: 0, impuesto: 0,
                    metodo, fecha, cliente_id: orden.cliente_id || null, cliente_nombre: orden.cliente_nombre || '',
                    cliente_telefono: orden.cliente_telefono || '',
                    detalles: [{ tipo: 'cobro_reparacion', reparacion_id: orden.id, equipo: `${orden.marca} ${orden.modelo}`, subtotal: pendiente.saldo }]
                });
                localStorage.setItem('pw_facturas', JSON.stringify(ventas));
                const config = JSON.parse(localStorage.getItem('pw_config') || '{}');
                const caja = Array.isArray(config.modulo_caja) ? config.modulo_caja : [];
                caja.push({ id: Date.now() + 1, sync_id: syncId, tipo: 'ingreso', concepto: `Cobro reparación ${obtenerFolioOrden(orden)}`, monto: pendiente.saldo, fecha });
                localStorage.setItem('pw_config', JSON.stringify({ ...config, modulo_caja: caja }));
            }
            const estadoAnterior = orden.estado || 'Pendiente';
            orden.estado = 'Entregado';
            orden.saldo = 0;
            orden.fecha_entrega = fecha;
            orden.historial_estados = orden.historial_estados || [];
            orden.historial_estados.push({ estado_anterior: estadoAnterior, estado_nuevo: 'Entregado', fecha, nota: pendiente.saldo > 0 ? `Cobro $${pendiente.saldo.toFixed(2)} · ${metodo}` : 'Saldo previamente liquidado' });
            localStorage.setItem('pw_ordenes', JSON.stringify(ordenes));
        }

        ['facturas', 'caja'].forEach(clave => delete modulosBD[clave]);
        if (sesionActual?.modalidad === 'sincronizada') {
            try {
                if (ipc) await ipc.invoke('sync-now', { url: sesionActual.sync_url, token: '' });
                else await sincronizarSnapshotWeb(sesionActual);
            } catch (errorSync) {
                mostrarEstadoSyncWeb(`Cobro guardado; sync pendiente: ${errorSync.message}`);
            }
        }
        cobroEntregaPendiente = null;
        document.getElementById('modal-cobro-entrega').classList.add('hidden');
        await cargarOrdenes();
        if (pendiente.detalleAbierto) {
            document.querySelector('[data-modal-reparacion="true"]')?.remove();
            await abrirDetalleReparacion(pendiente.id);
        }
        if (confirm('Cobro guardado y equipo entregado. ¿Preparar el aviso para el cliente por WhatsApp?')) abrirWhatsAppEstadoOrden(pendiente.id);
    } catch (error) {
        alert(`No se pudo completar la entrega: ${error.message}`);
    } finally {
        boton.disabled = false;
    }
}

function abrirWhatsAppEstadoOrden(id) {
    const orden = ordenesBD.find(item => String(item.id) === String(id));
    if (!orden) return alert('No se encontró la orden.');
    const cliente = clientesBD.find(item => String(item.id) === String(orden.cliente_id));
    const telefono = String(cliente?.telefono || orden.cliente_telefono || '').replace(/\D/g, '');
    if (telefono === '0000000000' || telefono.length < 10) return alert('Esta orden no tiene un teléfono de contacto válido.');
    let configuracion = {};
    try { configuracion = JSON.parse(localStorage.getItem('pw_config') || '{}'); } catch {}
    const codigosPais = { MX: '52', CO: '57', US: '1', CA: '1', AR: '54', CL: '56', PE: '51', ES: '34' };
    const codigoPais = codigosPais[String(configuracion.region_pais || 'MX').toUpperCase()];
    const numero = telefono.length === 10 && codigoPais ? `${codigoPais}${telefono}` : telefono;
    const urlSeguimiento = sesionActual?.modalidad === 'sincronizada' && orden.token_seguimiento
        ? `\nConsulta el estado aquí: ${new URL(`/seguimiento.html?token=${encodeURIComponent(orden.token_seguimiento)}`, sesionActual.sync_url).toString()}`
        : '';
    const mensaje = `Hola ${cliente?.nombre || 'cliente'}, te compartimos una actualización de tu reparación ${obtenerFolioOrden(orden)} (${orden.marca} ${orden.modelo}): ${orden.estado || 'Pendiente'}.${urlSeguimiento}`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank', 'noopener,noreferrer');
}

async function cargarOrdenes() {
    if (ipc) ordenesBD = await ipc.invoke('get-ordenes');
    else ordenesBD = JSON.parse(localStorage.getItem('pw_ordenes') || '[]');

    const cont = document.getElementById('contenedor-lista-reparaciones');
    if (!ordenesBD.length) {
        cont.innerHTML = `<p class="text-slate-500 italic text-xs">No hay órdenes registradas.</p>`;
        return;
    }

    const estadosPosibles = [
        'Pendiente',
        'En Diagnóstico',
        'Esperando Refacción',
        'Listo',
        'Entregado',
        'Cancelado'
    ];
    
    let html = '';
    ordenesBD.forEach(o => {
        const estadoActual = o.estado || 'Pendiente';
        const claseBadge = obtenerClaseEstado(estadoActual);

        let opcionesHTML = '';
        estadosPosibles.forEach(est => {
            const selected = est === estadoActual ? 'selected' : '';
            opcionesHTML += `<option value="${est}" ${selected} class="bg-[#0d131f] text-white">${est}</option>`;
        });

        // Construir detalle rápido de estado físico para previsualización
        let detallesFisicos = [];
        if (o.estado_fisico) {
            if (o.estado_fisico.rayones) detallesFisicos.push("Rayones");
            if (o.estado_fisico.tapa_rota) detallesFisicos.push("Tapa Rota");
            if (o.estado_fisico.despintado) detallesFisicos.push("Despintado");
            if (o.estado_fisico.camara_rota) detallesFisicos.push("Cristal Cámara Roto");
            if (o.estado_fisico.huella_fallo) detallesFisicos.push("Huella/FaceID Fallo");
            if (o.estado_fisico.chasis_doblado) detallesFisicos.push("Chasis Doblado");
        }
        const textoFisico = detallesFisicos.length > 0 ? detallesFisicos.join(", ") : "Sin detalles estéticos registrados";

        html += `<div class="bg-[#131c2e] p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition">
            <div>
            <div class="font-bold text-white text-sm">${escaparHTML(o.marca)} ${escaparHTML(o.modelo)} - <span class="text-[#00ff66]">${escaparHTML(obtenerFolioOrden(o))}</span></div>
            <div class="text-xs text-slate-400 mt-0.5">Falla: ${escaparHTML(o.falla)} | Medidor: ${escaparHTML(o.voltaje || 0)}V - ${escaparHTML(o.amperage || o.amperaje || 0)}A</div>
            <div class="text-[11px] text-rose-300/80 mt-0.5">Estado físico: ${escaparHTML(textoFisico)}</div>
            <div class="text-[11px] text-emerald-400/90 mt-1 font-mono">Costo: $${escaparHTML(o.costo_estimado || 0)} | Anticipo: $${escaparHTML(o.anticipo || 0)}</div>
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
                <select onchange="cambiarEstadoOrden(${Number(o.id)}, this.value)" class="text-xs px-3 py-1.5 rounded-xl border font-medium cursor-pointer focus:outline-none transition ${claseBadge}">
                    ${opcionesHTML}
                </select>

                <button onclick="abrirDetalleReparacion(${Number(o.id)})" class="p-2 text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10 rounded-lg transition" title="Detalle reparación"><i data-lucide="clipboard-list" class="w-4 h-4"></i></button>
                <button onclick="imprimirTicketOrden(${Number(o.id)})" class="p-2 text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 rounded-lg transition" title="Imprimir ticket"><i data-lucide="printer" class="w-4 h-4"></i></button>
                <button onclick="abrirWhatsAppEstadoOrden(${Number(o.id)})" class="p-2 text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10 rounded-lg transition" title="Preparar aviso de WhatsApp"><i data-lucide="message-circle" class="w-4 h-4"></i></button>
                <button onclick="eliminarOrden(${Number(o.id)})" class="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition" title="Eliminar orden"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </div>
        </div>`;
    });
    
    cont.innerHTML = html;
    lucide.createIcons();
}

async function verHistorialCliente(clienteId) {
    const cliente = clientesBD.find(registro => String(registro.id) === String(clienteId));
    if (!cliente) return;
    const ordenes = ipc ? await ipc.invoke('get-ordenes') : JSON.parse(localStorage.getItem('pw_ordenes') || '[]');
    const historial = ordenes.filter(orden => String(orden.cliente_id) === String(clienteId));
    const detalle = historial.length ? historial.map(orden => `${obtenerFolioOrden(orden)} · ${orden.marca} ${orden.modelo} · ${orden.estado || 'Pendiente'} · $${orden.costo_estimado || 0}`).join('\n') : 'Sin órdenes registradas.';
    alert(`Historial de ${cliente.nombre}\n\n${detalle}`);
}

function imprimirTicketOrden(id) {
    const orden = ordenesBD.find(registro => String(registro.id) === String(id));
    if (!orden) return;
    const cliente = clientesBD.find(registro => String(registro.id) === String(orden.cliente_id));
    const datosQR = encodeURIComponent(obtenerDatoQROrden(orden));
    const ventana = window.open('', '_blank', 'width=420,height=760');
    if (!ventana) return alert('Permite las ventanas emergentes para imprimir el ticket.');
    const folio = escaparHTML(obtenerFolioOrden(orden));
    ventana.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Ticket ${folio}</title><style>body{font-family:Arial,sans-serif;color:#111;width:80mm;margin:0 auto;padding:12px;font-size:12px}h1{text-align:center;font-size:18px;margin:0 0 8px}.line{border-top:1px dashed #777;margin:10px 0}.row{display:flex;justify-content:space-between;gap:12px;margin:5px 0}.muted{color:#555;font-size:11px}img{display:block;width:120px;height:120px;margin:14px auto}button{width:100%;padding:10px;border:0;background:#111;color:#fff;font-weight:bold}@media print{button{display:none}}</style></head><body><h1>Mi taller de reparaciones</h1><div class="muted" style="text-align:center">Ticket de recepción · ${folio}</div><div class="line"></div><div class="row"><strong>Cliente</strong><span>${escaparHTML(cliente?.nombre || 'Sin cliente')}</span></div><div class="row"><strong>Equipo</strong><span>${escaparHTML(orden.marca)} ${escaparHTML(orden.modelo)}</span></div><div class="row"><strong>Falla</strong><span>${escaparHTML(orden.falla)}</span></div><div class="row"><strong>Estado</strong><span>${escaparHTML(orden.estado || 'Pendiente')}</span></div><div class="row"><strong>Costo</strong><span>$${escaparHTML(orden.costo_estimado || 0)}</span></div><div class="row"><strong>Anticipo</strong><span>$${escaparHTML(orden.anticipo || 0)}</span></div><img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${datosQR}" alt="QR de seguimiento"><div class="muted" style="text-align:center">Conserva este folio para consultar tu reparación.</div><div class="line"></div><button onclick="window.print()">Imprimir</button></body></html>`);
    ventana.document.close();
}

async function abrirModalReparacion() {
    await cargarMarcasFormulario();
    if (ipc) clientesBD = await ipc.invoke('get-clientes');
    else clientesBD = JSON.parse(localStorage.getItem('pw_clientes') || '[]');

    const select = document.getElementById('rep-cliente-select');
    select.innerHTML = '<option value="">-- Seleccionar de la lista --</option>';
    clientesBD.forEach(c => select.innerHTML += `<option value="${escaparHTML(c.id)}">${escaparHTML(c.nombre)} (${escaparHTML(c.telefono)})</option>`);
    document.getElementById('rep-imei').value = '';
    document.getElementById('rep-sistema-detectado').value = '';
    document.getElementById('rep-device-status').textContent = '';
    mostrarGuiaControladores(false);
    
    document.getElementById('modal-reparacion').classList.remove('hidden');
}

function abrirRecepcionExpress() {
    document.getElementById('form-recepcion-express').reset();
    document.getElementById('express-cliente').value = 'Cliente de mostrador';
    document.getElementById('express-tipo').value = 'Celular / Smartphone';
    document.getElementById('modal-recepcion-express').classList.remove('hidden');
    document.getElementById('express-marca').focus();
}

function cerrarRecepcionExpress() {
    document.getElementById('modal-recepcion-express').classList.add('hidden');
}

function normalizarTelefonoCliente(telefono) {
    return String(telefono || '').replace(/\D/g, '');
}

async function guardarRecepcionExpress() {
    const nombre = document.getElementById('express-cliente').value.trim() || 'Cliente de mostrador';
    const telefonoIngresado = document.getElementById('express-telefono').value.trim();
    const telefono = telefonoIngresado || '0000000000';
    const datosOrden = {
        tipo_equipo: document.getElementById('express-tipo').value,
        marca: document.getElementById('express-marca').value.trim(),
        modelo: document.getElementById('express-modelo').value.trim(),
        falla: document.getElementById('express-falla').value.trim(),
        servicios: {},
        bloqueos: {},
        estado_fisico: {},
        checklist: {},
        tecnico: 'Técnico Principal',
        costo_estimado: 0,
        anticipo: 0,
        estado: 'Pendiente',
        token_seguimiento: crypto.randomUUID()
    };
    if (!datosOrden.marca || !datosOrden.modelo || !datosOrden.falla) return alert('Completa marca, modelo y falla reportada.');

    const boton = document.querySelector('#form-recepcion-express button[type="submit"]');
    boton.disabled = true;
    try {
        const clientes = ipc ? await ipc.invoke('get-clientes') : JSON.parse(localStorage.getItem('pw_clientes') || '[]');
        const telefonoNormalizado = normalizarTelefonoCliente(telefono);
        let cliente = telefonoIngresado
            ? clientes.find(item => normalizarTelefonoCliente(item.telefono) === telefonoNormalizado)
            : clientes.find(item => item.telefono === '0000000000' && item.nombre === 'Cliente de mostrador');

        if (!cliente) {
            if (ipc) {
                const resultadoCliente = await ipc.invoke('add-cliente', { nombre, telefono, email: '' });
                cliente = (await ipc.invoke('get-clientes')).find(item => Number(item.id) === Number(resultadoCliente.lastInsertRowid));
            } else {
                cliente = { id: Math.max(0, ...clientes.map(item => Number(item.id) || 0)) + 1, nombre, telefono, email: '', fecha_registro: new Date().toISOString() };
                clientes.push(cliente);
                localStorage.setItem('pw_clientes', JSON.stringify(clientes));
            }
        }
        if (!cliente?.id) throw new Error('No se pudo guardar o localizar al cliente.');
        datosOrden.cliente_id = cliente.id;

        if (ipc) {
            const resultadoOrden = await ipc.invoke('add-orden', datosOrden);
            datosOrden.id = Number(resultadoOrden.lastInsertRowid);
            datosOrden.folio = resultadoOrden.folio;
            datosOrden.folio_numero = resultadoOrden.folio_numero;
            datosOrden.cliente_nombre = cliente.nombre;
            datosOrden.cliente_telefono = cliente.telefono;
            if (sesionActual?.modalidad === 'sincronizada') await ipc.invoke('sync-now', { url: sesionActual.sync_url, token: '' });
        } else {
            const ordenes = JSON.parse(localStorage.getItem('pw_ordenes') || '[]');
            const folio = await reservarFolioOrdenWeb();
            datosOrden.id = Math.max(0, ...ordenes.map(item => Number(item.id) || 0)) + 1;
            datosOrden.folio = folio.folio;
            datosOrden.folio_numero = folio.folio_numero;
            datosOrden.cliente_nombre = cliente.nombre;
            datosOrden.cliente_telefono = cliente.telefono;
            datosOrden.fecha = new Date().toISOString();
            ordenes.push(datosOrden);
            localStorage.setItem('pw_ordenes', JSON.stringify(ordenes));
            if (sesionActual?.modalidad === 'sincronizada') await sincronizarSnapshotWeb(sesionActual);
        }

        clientesBD = ipc ? await ipc.invoke('get-clientes') : JSON.parse(localStorage.getItem('pw_clientes') || '[]');
        ordenesBD = ipc ? await ipc.invoke('get-ordenes') : JSON.parse(localStorage.getItem('pw_ordenes') || '[]');
        cerrarRecepcionExpress();
        nav('reparaciones');
        mostrarQROrden(datosOrden);
        if (document.getElementById('express-aviso-whatsapp').checked && telefonoIngresado) abrirWhatsAppEstadoOrden(datosOrden.id);
        else if (document.getElementById('express-aviso-whatsapp').checked) alert('La orden quedó registrada; para WhatsApp agrega un teléfono al cliente.');
    } catch (error) {
        alert(`No se pudo registrar la recepción: ${error.message}`);
    } finally {
        boton.disabled = false;
    }
}

function cerrarModalReparacion() {
    document.getElementById('modal-reparacion').classList.add('hidden');
}

function mostrarQROrden(orden) {
    const qr = document.getElementById('orden-qr-imagen');
    const folio = document.getElementById('orden-qr-folio');
    const equipo = document.getElementById('orden-qr-equipo');
    const destino = obtenerDatoQROrden(orden);
    const datos = encodeURIComponent(destino);
    qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${datos}`;
    qr.alt = `Código QR de la orden ${obtenerFolioOrden(orden)}`;
    folio.textContent = obtenerFolioOrden(orden);
    equipo.textContent = `${orden.marca} ${orden.modelo}`;
    const enlaceSeguimiento = document.getElementById('orden-qr-enlace');
    const esEnlace = destino.startsWith('https://') || destino.startsWith('http://');
    enlaceSeguimiento.href = esEnlace ? destino : '#';
    enlaceSeguimiento.classList.toggle('hidden', !esEnlace);
    document.getElementById('orden-qr-mensaje').textContent = esEnlace
        ? 'Escanea el código para consultar el estado actualizado de la reparación.'
        : 'Este QR identifica la orden; el seguimiento en línea requiere una suscripción.';
    document.getElementById('modal-orden-qr').classList.remove('hidden');
}

function cerrarQROrden() {
    document.getElementById('modal-orden-qr').classList.add('hidden');
}

function imprimirQROrden() {
    const imagen = document.getElementById('orden-qr-imagen').src;
    const folio = document.getElementById('orden-qr-folio').textContent;
    const equipo = document.getElementById('orden-qr-equipo').textContent;
    const ventana = window.open('', '_blank', 'width=420,height=620');
    if (!ventana) return alert('Permite las ventanas emergentes para imprimir el QR.');
    ventana.document.write(`<html><head><title>${escaparHTML(folio)}</title><style>body{font-family:Arial;text-align:center;padding:24px}img{width:260px;height:260px}.muted{color:#555}</style></head><body><h2>Mi taller de reparaciones</h2><h3>${escaparHTML(folio)}</h3><p class="muted">${escaparHTML(equipo)}</p><img src="${escaparHTML(imagen)}" alt="QR"><script>window.onload=()=>window.print()<\/script></body></html>`);
    ventana.document.close();
}

async function guardarOrdenReparacion() {
    const orden = {
        cliente_id: document.getElementById('rep-cliente-select').value,
        tipo_equipo: document.getElementById('rep-tipo-equipo').value,
        marca: document.getElementById('rep-marca').value,
        modelo: document.getElementById('rep-modelo').value,
        imei: document.getElementById('rep-imei').value.trim(),
        diagnostico: document.getElementById('rep-sistema-detectado').value.trim(),
        falla: document.getElementById('rep-falla').value,
        
        servicios: {
            microsoldadura: document.getElementById('chk-microsoldadura').checked,
            centro_carga: document.getElementById('chk-centro-carga').checked,
            bateria: document.getElementById('chk-bateria').checked,
            pantalla: document.getElementById('chk-pantalla').checked,
            limpieza: document.getElementById('chk-limpieza').checked
        },

        bloqueos: {
            pin: document.getElementById('chk-pin').checked,
            pass: document.getElementById('chk-pass').checked,
            patron: document.getElementById('chk-patron').checked,
            clave: document.getElementById('rep-clave-usuario').value,
            frp: document.getElementById('chk-frp').checked,
            icloud: document.getElementById('chk-icloud').checked,
            miaccount: document.getElementById('chk-miaccount').checked,
            simlock: document.getElementById('chk-simlock').checked,
            payjoy: document.getElementById('chk-payjoy').checked,
            macropay: document.getElementById('chk-macropay').checked,
            otro_credito: document.getElementById('rep-otro-credito').value
        },

        // PROTECCIÓN DE TALLER (Condiciones Físicas)
        estado_fisico: {
            rayones: document.getElementById('chk-rayones').checked,
            tapa_rota: document.getElementById('chk-tapa-rota').checked,
            despintado: document.getElementById('chk-despintado').checked,
            camara_rota: document.getElementById('chk-camara-rota').checked,
            huella_fallo: document.getElementById('chk-huella-fallo').checked,
            chasis_doblado: document.getElementById('chk-chasis-doblado').checked,
            pantalla_despegada: document.getElementById('chk-pantalla-despegada').checked,
            botones_dañados: document.getElementById('chk-botones-dañados').checked,
            humedad_sulfato: document.getElementById('chk-humedad-sulfato').checked,
            falta_tornillos: document.getElementById('chk-falta-tornillos').checked,
            sin_sim_sd: document.getElementById('chk-sin-sim-sd').checked,
            observaciones: document.getElementById('rep-observaciones-fisicas').value
        },

        voltaje: parseFloat(document.getElementById('rep-voltaje').value) || 0,
        amperaje: parseFloat(document.getElementById('rep-amperaje').value) || 0,
        checklist: {
            enciende: document.getElementById('chk-enciende').checked,
            touch_ok: document.getElementById('chk-touch-ok').checked,
            carga_ok: document.getElementById('chk-carga-ok').checked,
            camaras_ok: document.getElementById('chk-camaras-ok').checked
        },

        tecnico: document.getElementById('rep-tecnico').value,
        costo_estimado: parseFloat(document.getElementById('rep-costo').value) || 0,
        anticipo: parseFloat(document.getElementById('rep-anticipo').value) || 0,
        estado: 'Pendiente',
        token_seguimiento: crypto.randomUUID()
    };

    if (!orden.cliente_id || !orden.marca || !orden.modelo || !orden.falla.trim()) {
        alert('Selecciona un cliente, marca, modelo e ingresa la falla reportada.');
        return;
    }

    if (orden.costo_estimado < 0 || orden.anticipo < 0 || orden.anticipo > orden.costo_estimado) {
        alert('Revisa el costo y el anticipo. El anticipo no puede superar el costo ni ser negativo.');
        return;
    }

    try {
        let resultado;
        if (ipc) {
            resultado = await ipc.invoke('add-orden', orden);
            orden.id = Number(resultado.lastInsertRowid);
            orden.folio = resultado.folio;
            orden.folio_numero = resultado.folio_numero;
        } else {
            const folio = await reservarFolioOrdenWeb();
            orden.id = Date.now();
            orden.folio = folio.folio;
            orden.folio_numero = folio.folio_numero;
            ordenesBD.push(orden);
            localStorage.setItem('pw_ordenes', JSON.stringify(ordenesBD));
        }

        if (sesionActual?.modalidad === 'sincronizada') {
            try {
                if (ipc) await ipc.invoke('sync-now', { url: sesionActual.sync_url, token: '' });
                else await sincronizarSnapshotWeb(sesionActual);
            } catch (error) {
                mostrarEstadoSyncWeb(error.message);
            }
        }

        cerrarModalReparacion();
        mostrarQROrden(orden);
        nav('reparaciones');
    } catch (error) {
        alert(`No se pudo guardar la orden: ${error.message}`);
    }
}

async function eliminarOrden(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta orden de reparación?')) return;

    if (ipc) {
        await ipc.invoke('delete-orden', id);
    } else {
        ordenesBD = ordenesBD.filter(o => o.id != id);
        localStorage.setItem('pw_ordenes', JSON.stringify(ordenesBD));
    }
    
    cargarOrdenes();
}
let resultadosBusquedaGlobal = [];
let indiceBusquedaGlobal = 0;
let versionBusquedaGlobal = 0;

function normalizarBusquedaGlobal(valor) {
    return String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function abrirBuscadorGlobal() {
    if (!sesionActual) return;
    const modal = document.getElementById('modal-buscador-global');
    const entrada = document.getElementById('buscador-global-input');
    modal.classList.remove('hidden');
    entrada.value = '';
    buscarGlobal('');
    setTimeout(() => entrada.focus(), 0);
    lucide.createIcons();
}

function cerrarBuscadorGlobal() {
    document.getElementById('modal-buscador-global').classList.add('hidden');
}

async function buscarGlobal(consulta) {
    const version = ++versionBusquedaGlobal;
    const termino = normalizarBusquedaGlobal(consulta);
    const accesos = [
        { tipo: 'navegar', seccion: 'reparaciones', titulo: 'Órdenes de reparación', detalle: 'Abrir todas las órdenes', icono: 'wrench', texto: 'ordenes reparaciones taller' },
        { tipo: 'navegar', seccion: 'clientes', titulo: 'Clientes', detalle: 'Abrir el directorio de clientes', icono: 'users', texto: 'clientes contactos' },
        { tipo: 'navegar', seccion: 'inventario', titulo: 'Inventario', detalle: 'Consultar existencias y piezas', icono: 'package', texto: 'inventario existencias piezas stock' },
        { tipo: 'navegar', seccion: 'pos', titulo: 'Punto de venta', detalle: 'Abrir el POS', icono: 'shopping-cart', texto: 'pos ventas cobros' },
        { tipo: 'navegar', seccion: 'caja', titulo: 'Caja', detalle: 'Consultar movimientos y cortes', icono: 'wallet', texto: 'caja movimientos cortes' },
        { tipo: 'navegar', seccion: 'reportes', titulo: 'Reportes', detalle: 'Ver resultados del taller', icono: 'chart-no-axes-combined', texto: 'reportes informes analisis' }
    ];
    const contenedor = document.getElementById('resultados-busqueda-global');
    contenedor.innerHTML = '<p class="px-3 py-5 text-center text-xs text-slate-500">Buscando en el taller...</p>';

    try {
        const [clientes, ordenes, inventario] = await Promise.all([
            ipc ? ipc.invoke('get-clientes') : JSON.parse(localStorage.getItem('pw_clientes') || '[]'),
            ipc ? ipc.invoke('get-ordenes') : JSON.parse(localStorage.getItem('pw_ordenes') || '[]'),
            ipc ? ipc.invoke('get-inventario') : leerModulo('inventario')
        ]);
        if (version !== versionBusquedaGlobal) return;
        clientesBD = clientes;
        ordenesBD = ordenes;
        const resultados = termino ? accesos.filter(item => normalizarBusquedaGlobal(`${item.titulo} ${item.texto}`).includes(termino)) : accesos;
        const coincide = texto => normalizarBusquedaGlobal(texto).includes(termino);

        if (termino) {
            ordenes.filter(item => coincide([item.id, item.imei, item.marca, item.modelo, item.falla, item.estado, item.cliente_nombre, item.cliente_telefono].join(' ')))
                .slice(0, 12).forEach(item => resultados.push({ tipo: 'orden', id: item.id, titulo: `${obtenerFolioOrden(item)} · ${item.marca || ''} ${item.modelo || ''}`, detalle: `${item.estado || 'Pendiente'} · ${item.cliente_nombre || 'Sin cliente'} · ${item.falla || ''}`, icono: 'wrench' }));
            clientes.filter(item => coincide([item.nombre, item.telefono, item.email].join(' ')))
                .slice(0, 8).forEach(item => resultados.push({ tipo: 'cliente', id: item.id, titulo: item.nombre, detalle: `${item.telefono || ''}${item.email ? ` · ${item.email}` : ''}`, icono: 'user-round' }));
            inventario.filter(item => coincide([item.nombre, item.sku, item.marca, item.categoria].join(' ')))
                .slice(0, 8).forEach(item => resultados.push({ tipo: 'producto', id: item.id, titulo: item.nombre, detalle: `${item.sku || 'Sin SKU'} · ${item.stock ?? 0} disponibles`, icono: 'package' }));
            if (!resultados.length) resultados.push({ tipo: 'vacio', titulo: 'Sin resultados', detalle: 'Prueba con un folio, IMEI, teléfono o nombre de pieza.', icono: 'search-x' });
        } else {
            ordenes.slice(0, 5).forEach(item => resultados.push({ tipo: 'orden', id: item.id, titulo: `${obtenerFolioOrden(item)} · ${item.marca || ''} ${item.modelo || ''}`, detalle: `${item.estado || 'Pendiente'} · ${item.cliente_nombre || 'Orden reciente'}`, icono: 'clock-3' }));
        }

        resultadosBusquedaGlobal = resultados.slice(0, 25);
        indiceBusquedaGlobal = 0;
        contenedor.innerHTML = resultadosBusquedaGlobal.map((item, indice) => `
            <button type="button" role="option" aria-selected="${indice === indiceBusquedaGlobal}" onclick="seleccionarResultadoGlobal(${indice})" class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${indice === indiceBusquedaGlobal ? 'bg-[#173326] text-white' : 'text-slate-300 hover:bg-[#131c2e]'}" ${item.tipo === 'vacio' ? 'disabled' : ''}>
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#131c2e] text-emerald-300"><i data-lucide="${item.icono}" class="h-4 w-4"></i></span>
                <span class="min-w-0 flex-1"><strong class="block truncate text-xs">${escaparHTML(item.titulo)}</strong><span class="mt-1 block truncate text-[11px] text-slate-500">${escaparHTML(item.detalle)}</span></span>
                ${item.tipo === 'navegar' ? '<span class="text-[10px] text-slate-500">Abrir</span>' : ''}
            </button>`).join('');
        lucide.createIcons();
    } catch (error) {
        contenedor.innerHTML = `<p class="px-3 py-5 text-center text-xs text-rose-300">No se pudo buscar: ${escaparHTML(error.message)}</p>`;
    }
}

async function seleccionarResultadoGlobal(indice) {
    const resultado = resultadosBusquedaGlobal[indice];
    if (!resultado || resultado.tipo === 'vacio') return;
    cerrarBuscadorGlobal();
    if (resultado.tipo === 'navegar') return nav(resultado.seccion);
    if (resultado.tipo === 'orden') {
        nav('reparaciones');
        await cargarOrdenes();
        return abrirDetalleReparacion(resultado.id);
    }
    if (resultado.tipo === 'cliente') {
        nav('clientes');
        await cargarClientes();
        return verHistorialCliente(resultado.id);
    }
    if (resultado.tipo === 'producto') {
        nav('inventario');
        await cargarInventario();
        return abrirEditarProducto(resultado.id);
    }
}

window.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        abrirBuscadorGlobal();
        return;
    }
    const modal = document.getElementById('modal-buscador-global');
    if (!modal || modal.classList.contains('hidden')) return;
    if (event.key === 'Escape') {
        event.preventDefault();
        cerrarBuscadorGlobal();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const direccion = event.key === 'ArrowDown' ? 1 : -1;
        const disponibles = resultadosBusquedaGlobal.map((item, indice) => item.tipo === 'vacio' ? -1 : indice).filter(indice => indice >= 0);
        if (!disponibles.length) return;
        event.preventDefault();
        const posicion = disponibles.indexOf(indiceBusquedaGlobal);
        indiceBusquedaGlobal = disponibles[(posicion + direccion + disponibles.length) % disponibles.length];
        const opciones = document.querySelectorAll('#resultados-busqueda-global [role="option"]');
        opciones.forEach((opcion, indice) => {
            const activo = indice === indiceBusquedaGlobal;
            opcion.setAttribute('aria-selected', String(activo));
            opcion.classList.toggle('bg-[#173326]', activo);
            opcion.classList.toggle('text-white', activo);
            opcion.classList.toggle('text-slate-300', !activo);
        });
        const seleccionado = opciones[indiceBusquedaGlobal];
        seleccionado?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter') {
        event.preventDefault();
        seleccionarResultadoGlobal(indiceBusquedaGlobal);
    }
});

// Inicialización general
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('pantalla-auth').classList.add('hidden');
    document.getElementById('pantalla-modalidad').classList.remove('hidden');
    if (!ipc && location.protocol !== 'file:') {
        const urlLogin = document.getElementById('sync-url');
        const urlConfig = document.getElementById('cfg-sync-url');
        urlLogin.value = location.origin;
        urlLogin.readOnly = true;
        urlConfig.value = location.origin;
        urlConfig.readOnly = true;
        document.getElementById('sync-token-config').classList.add('hidden');
    }
    cargarInventarioCotizador();
});