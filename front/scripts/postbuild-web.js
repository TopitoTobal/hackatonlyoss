/* Inyecta metadatos PWA y el service worker en el export web de Expo.
   Expo copia front/public/* a dist/; este script solo parchea los index.html. */
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');

const HEAD = `    <meta name="theme-color" content="#ffffff" />
    <meta name="description" content="Mapa de movilización accesible con GPS, rutas y pedidos de ayuda." />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Campus" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="apple-touch-icon" href="/icon-180.png?v=4" />
    <link rel="icon" type="image/png" href="/icon-192.png?v=4" />
    <link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" href="/splash-1125x2436.png?v=3" />
    <link rel="apple-touch-startup-image" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" href="/splash-1170x2532.png?v=3" />
    <link rel="apple-touch-startup-image" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" href="/splash-1179x2556.png?v=3" />
    <link rel="apple-touch-startup-image" media="(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3)" href="/splash-1206x2622.png?v=3" />
    <link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" href="/splash-1242x2688.png?v=3" />
    <link rel="apple-touch-startup-image" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" href="/splash-1284x2778.png?v=3" />
    <link rel="apple-touch-startup-image" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" href="/splash-1290x2796.png?v=3" />
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
