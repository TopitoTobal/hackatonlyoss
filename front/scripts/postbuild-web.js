/* Inyecta metadatos PWA y el service worker en el export web de Expo.
   Expo copia front/public/* a dist/; este script solo parchea los index.html. */
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');

const HEAD = `    <meta name="theme-color" content="#065f46" />
    <meta name="description" content="Mapa de movilización accesible con GPS, rutas y pedidos de ayuda." />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Campus" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="apple-touch-icon" href="/icon-180.png" />
    <link rel="icon" type="image/png" href="/icon-192.png" />
`;

const SW = `  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').catch(function () {});
      });
    }
  </script>
`;

function indexFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entrada) => {
    const ruta = path.join(dir, entrada.name);
    if (entrada.isDirectory()) return indexFiles(ruta);
    return entrada.name === 'index.html' ? [ruta] : [];
  });
}

let changes = 0;
for (const archivo of indexFiles(dist)) {
  let html = fs.readFileSync(archivo, 'utf8');
  if (!html.includes('rel="manifest"')) {
    html = html.replace('<head>', `<head>\n${HEAD}`);
    changes++;
  }
  html = html.replace('<html lang="en">', '<html lang="es">');
  html = html.replace('<title>hackatonlyoss</title>', '<title>Campus Accesible · UTFSM</title>');

  const esRaiz = path.relative(dist, archivo) === 'index.html';
  if (esRaiz && !html.includes("register('/sw.js')")) {
    html = html.replace('</body>', `${SW}</body>`);
  }
  fs.writeFileSync(archivo, html);
}

console.log(`PWA inyectada en ${changes} archivo(s) (manifest, iconos y service worker).`);
