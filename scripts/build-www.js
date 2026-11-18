// Copia web/ -> www/ y aplica parches para modo APK.
const fs = require('fs'), path = require('path');
const src = path.join(__dirname, '..', 'web'), dst = path.join(__dirname, '..', 'www');
fs.rmSync(dst, { recursive: true, force: true });
fs.mkdirSync(dst, { recursive: true });
for (const f of fs.readdirSync(src)) fs.copyFileSync(path.join(src, f), path.join(dst, f));

function patch(file, fn) {
  const p = path.join(dst, file);
  const a = fs.readFileSync(p, 'utf8'), b = fn(a);
  if (a === b) console.warn('AVISO: sin cambios en', file);
  fs.writeFileSync(p, b);
}

patch('index.html', h => {
  h = h.replace(/<link[^>]*manifest\.webmanifest[^>]*>\s*/g, '');
  // quitar registro del service worker
  h = h.replace(/navigator\.serviceWorker\.register\([^)]*\)/g, 'Promise.resolve()');
  // quitar el script duplicado de funciones-usuarios.js
  let n = 0;
  h = h.replace(/<script[^>]*src="funciones-usuarios\.js"[^>]*><\/script>\s*/g, m => (++n === 1 ? m : ''));
  // shim antes de app.js
  h = h.replace(/(<script[^>]*src="app\.js"[^>]*><\/script>)/, '<script src="mobile-shim.js"></script>\n$1');
  // modo solo local: ocultar opcion sincronizada y cambiar modalidad, saltar la pantalla de eleccion
  const extra = `<style>#pantalla-modalidad button[onclick*="sincronizada"],button[onclick*="volverASeleccionModalidad"]{display:none!important}</style>
<script>window.addEventListener('load',function(){var p=document.getElementById('pantalla-modalidad');if(p&&!p.classList.contains('hidden')&&typeof seleccionarModalidad==='function')seleccionarModalidad('local');});</script>`;
  h = h.replace('</body>', extra + '\n</body>');
  return h;
});

patch('app.js', js => {
  js = js.split("location.protocol !== 'file:'").join("location.protocol !== 'file:' && !window.ES_APK");
  js = js.split(': location.origin)').join(': (window.TALLER_SERVER_URL || location.origin))');
  return js;
});
console.log('www listo');
