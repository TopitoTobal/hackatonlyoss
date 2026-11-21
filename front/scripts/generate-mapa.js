const fs = require('fs')
const path = require('path')

const raiz = path.resolve(__dirname, '..')
const entrada = path.join(raiz, 'index.html')
const salida = path.join(raiz, 'mapa-html.ts')

const html = fs
  .readFileSync(entrada, 'utf8')
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${')

fs.writeFileSync(
  salida,
  '// Generado desde front/index.html. Edita ese archivo y vuelve a generar.\n' +
    'export const MAPA_HTML = `' +
    html +
    '`\n',
  'utf8',
)

console.log(`Generado ${path.relative(raiz, salida)} desde index.html`)
