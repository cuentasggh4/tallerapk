// Ajustes para ejecutar en el APK (Capacitor). Se carga antes de app.js.
// Configura aquí la URL HTTPS de tu servidor de licencias/sincronización (opcional).
window.TALLER_SERVER_URL = window.TALLER_SERVER_URL || '';
window.ES_APK = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
