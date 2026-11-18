# Taller Celulares – APK (Capacitor)

## Compilar local
    npm install
    npx cap add android      # solo la primera vez
    npm run sync             # copia web/ a www/ con parches y sincroniza
    npx cap open android     # Android Studio -> Build > Build APK(s)

## Compilar en la nube
Sube esta carpeta a GitHub: el workflow `.github/workflows/apk.yml` genera `app-debug.apk` como artefacto.

## Modo de uso en APK
- Modo local: datos en localStorage del dispositivo (no Electron/SQLite).
- Solo uso local personal: la opción sincronizada está oculta y la app abre directo en modo local.
- No disponibles en APK: detección USB, panel de usuarios/permisos, importación de catálogo PDF/XLSX (requiere servidor), impresión de tickets.
- Tailwind y Lucide se cargan por CDN (requiere internet). Para uso offline, descárgalos a `web/` y cambia las etiquetas <script>.
