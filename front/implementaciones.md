# Implementaciones disponibles para el front

**Estado:** el módulo de GPS y movimiento ya está en `backend/` (commit `2fe9c61`).  
Este archivo es el handoff para quien construye el mapa con Tailwind: aquí está
todo lo que ya puedes consumir desde `front/`. El mapa vive en
`front/index.html` y se carga desde `App.tsx` a través de `Mapa.tsx`
(`WebView` en nativo, `Mapa.web.tsx` con `iframe` en web), enviándole la
ubicación del GPS con `postMessage({ type: 'position', x, y, latitude, longitude, accuracyM })`
y el estado del pedido de ayuda con `postMessage({ type: 'ayuda', activo })`.
La conversión lat/lng → píxeles del plano está en `App.tsx` (`aPuntoPlano`).
En el prototipo el primer fix GPS preciso se ancla al centro del plano
`(690, 500)` y los puntos siguientes son desplazamientos relativos desde ahí
(0,75 m por píxel).
`setUserPosition()` mueve el punto azul y, si hay una navegación activa,
actualiza el tramo restante y el próximo giro sin volver a seleccionar el
edificio ni repetir la voz automática en cada muestra.
Además, en web el seguimiento usa `navigator.geolocation.watchPosition()` directo
en `backend/src/tracker.ts` (con una primera muestra vía `getCurrentPosition()`),
porque el `watchPositionAsync` de `expo-location` no entregaba muestras en Safari
iOS. Las muestras siguen siendo `MovementSample` normales: speed, stats, alertas
y filtro por `isAccurate` quedan igual.

En iOS Safari, `expo-location` intenta usar `navigator.permissions.query` (no
soportado por Safari) y falla antes de mostrar el diálogo. Por eso `backend/src/
permissions.ts` usa en web un camino directo con `navigator.geolocation.
getCurrentPosition()`, disparado desde el toque del usuario en los botones de la
portada. Si se abre una URL con `?modo=` directo, el botón **Activar GPS** de la
barra permite pedir el permiso manualmente. La web debe servirse por HTTPS
(Netlify lo hace); por HTTP en una IP local Safari no pedirá la ubicación.

El botón **Generar ruta** traza el recorrido más corto por los senderos hasta la
entrada del edificio elegido. El interior de los edificios es esquemático hasta
que haya planos oficiales.

### Selección guiada en modo no vidente

Solo al entrar como **no vidente** aparecen dos flechas grandes abajo
(`#ciegoPrev` / `#ciegoNext`) y se oculta el panel de información. El edificio
inicial es el más cercano al punto azul; cada flecha recorre la lista de oeste a
este y el TTS anuncia *"Edificio seleccionado: X…"*. Tocar cualquier otro punto
de la pantalla (o pulsar Enter/Espacio fuera de las flechas) confirma la
elección, oculta las flechas y llama a `generarRuta(selected)`. A partir de ahí
la navegación existente guía por voz los giros y la distancia restante; al
llegar, las flechas vuelven a aparecer para elegir otro destino. Mientras se
está eligiendo se suspende la entrada automática al interior, para que el
plano esquemático no interrumpa la selección.

En modo **vidente** el mapa muestra a las personas **no videntes conectadas**
como puntos morados con un ID corto y efímero, y un contador accesible arriba a
la izquierda. La presencia usa MQTT sobre WSS
(`wss://broker.emqx.io:8084/mqtt`, tema `hackatonlyoss/campus/presencia/v1`):
sin credenciales, sin nombres y sin historial. Los pares expiran a los 12 s sin
actualización. Cada muestra GPS se publica (con un mínimo de 400 ms entre
envíos) y un latido cada 2 s mantiene el `ts` fresco aunque el navegador
espacie las muestras; en web además se sondea `getCurrentPosition` cada 2 s
junto a `watchPosition`. Si el broker no está disponible, la capa se oculta y el
GPS y la voz siguen funcionando con normalidad.

### Pedido de ayuda (botón del teléfono)

En modo **no vidente** aparece un botón **Pedir ayuda** en la barra superior.
Al tocarlo se publica un aviso en el tema MQTT
`hackatonlyoss/campus/ayuda/v1` (mismo broker WSS que la presencia) con el ID
efímero, el rol, `lat`/`lng`/`acc` del GPS satelital crudo y un `ts`. Mientras
está activo se repite cada 2 s; al volver a tocar el botón se publica
`activo: false` y desaparece. Cambiar de modo o detener el GPS también cancela
el pedido.

En modo **vidente**, cada pedido activo se dibuja como un marcador rojo con un
`!` y un anillo, con `<title>` accesible, y aparece un banner rojo arriba con
el ID y la distancia/dirección (`"NV-XXXX a 12 metros al norte"`). El aviso se
anuncia por `aria-live="assertive"` al llegar, y se cancela/expira a los 12 s
sin actualización. En el teléfono de quien pide ayuda, el botón cambia a
**Cancelar ayuda** y un texto `aria-live="assertive"` confirma el estado.

La posición que se envía es la del GPS del emisor y se convierte con el mismo
marco de primer fix (`geoAPlano`), por lo que el marcador cae donde corresponde
aunque cada celular haya empezado en un lugar distinto. No se envían nombres,
rutas ni historial; solo el ID efímero y la ubicación mientras el pedido está
activo. Si el broker falla, el botón y el GPS siguen funcionando, pero nadie
recibe el aviso.

#### Ir a ayudar (enganche con el generador de rutas)

Cuando hay pedidos activos, el banner del vidente muestra un botón **Ir a
ayudar** (o **Ver ruta** si ya está calculada). Al tocarlo se genera una ruta
desde la posición actual hasta la persona más cercana que pidió ayuda y se
dibuja como una **línea roja discontinua** en `#rutaLayer`, con un `<title>`
accesible y un anuncio por voz con la distancia y dirección. La ruta se
recalcula mientras la persona se mueve y se borra automáticamente si el pedido
se cancela, expira o se cambia de modo.

El generador de rutas de Danko se puede conectar sin tocar este código
registrándolo desde el mapa:

```js
window.registrarGeneradorRutas(function (args) {
  // args.desde = { x, y } en pixeles del plano; args.hasta = { x, y }
  // Debe devolver [{ x, y }, ...] o { puntos: [{ x, y }, ...] }.
  return [{ x: args.desde.x, y: args.desde.y }, { x: args.hasta.x, y: args.hasta.y }]
})
```

También se detectan `window.generarRuta`, `window.generarRutaHacia` y
`window.rutas.generar`, con las mismas dos firmas aceptadas
(`fn({ desde, hasta })` o `fn(desde, hasta)`). **Con el módulo de Danko ya
subido**, `rutaHaciaPunto()` usa preferentemente su grafo (`GRAFO` y
`mejorRuta()`): elige el nodo más cercano a la persona que pidió ayuda y
concatena el destino real, así el recorrido va por los mismos senderos que la
ruta azul a edificios. El gancho `window.registrarGeneradorRutas(fn)` sigue
disponible para un generator externo. Como respaldo final, `rutaPorSenderos()`
arma un grafo con los vértices de `g[stroke="#475569"] path` y hace Dijkstra.
El contrato de `postMessage` no cambia.

La precisión se fusiona entre pares siguiendo el RFC, con un **árbol de
confianza** que evita el arrastre entre personas:

- Cada mensaje publica su **GPS satelital crudo** (`lat`, `lng`, `acc`) y un
  campo `obs` con lo que oyó de otros nodos. Nunca se publica la posición ya
  fusionada: hacerlo creaba un bucle de realimentación y, cuando alguien se
  alejaba, su estimado arrastraba al del otro.
- El reporte que un nodo hace **de sí mismo** es la referencia (`propio: true`).
  Las observaciones de terceros entran solo como corrección secundaria, con
  peso `0.35` (o `0.56` si el observador es vidente), decaimiento de 5 s y un
  filtro de coherencia: si difieren de la referencia más de `max(25 m, 3σpropia + 3σajena)`
  se descartan.
- Sobre esa referencia se aplica un **filtro temporal tipo Kalman** en lat/lng.
  La incertidumbre crece `0.8 m × √Δt` sin datos. Un salto grande se sigue
  (ganancia ≥ 0.85) solo si el nodo propio lo confirma con una muestra fresca
  y es compatible con 8 m/s; si no, se descarta como outlier.
- El resultado alimenta la detección de interior, pero **no se publica**.
  El anillo morado usa la σ fusionada: con 1 señal de ±12 m da ~13 m, con 3
  señales consistentes baja a ~7,5 m y con 5 a ~5,8 m. En pantalla se indica
  el número de señales cuando es mayor que 1. **No se usa altura ni piso**:
  el RFC sigue vigente para BLE/UWB y el grafo completo.

El mismo marco compartido permite detectar edificio: `edificioEn()` prueba los
rectángulos de `BUILDINGS` con ~6 m de tolerancia. Si la persona en modo
**no vidente** queda dentro de un edificio durante 3 muestras seguidas, el mapa
selecciona esa **letra** y abre automáticamente su vista interior; si sale,
vuelve al mapa. La salida manual bloquea la reentrada automática por 15 s. En
el interior, el punto azul del plano esquemático sigue el GPS real (anclado al
entrar) y se anuncia cada 10 m recorridos. La card de acciones muestra un botón
**Salir interior** sincronizado con el diálogo, porque el botón del mapa queda
debajo de esa card. En el mapa del vidente, el edificio donde está cada par se
resalta con un marco morado discontinuo.

Cada dispositivo publica también su `latitude`/`longitude`/`accuracyM` crudos.
El receptor convierte la posición ajena con **su propio primer fix como origen**
(`PRESENCIA.origen` dentro de `geoAPlano`), así los puntos caen en el mismo
marco local aunque cada celular haya empezado en un lugar distinto. Ese ancla
**no se recalibra con cada muestra**: si se usara el fix actual, al caminar los
pares se desplazarían justo en la dirección contraria (norte→sur, este→oeste).
El plano es sur-arriba / este-derecha (norte abajo): la latitud creciente suma
`y` y la longitud creciente suma `x`, lo mismo que usa `App.tsx` en
`aPuntoPlano()`. Las indicaciones por voz salen de `info()` con `atan2(dx, dy)`,
por lo que `0°` es norte, `90°` este, `180°` sur y `270°` oeste. El zoom llega a **12×**,
con una barra de escala métrica arriba a la izquierda. Al acercar, cada par
muestra un anillo discontinuo con su precisión GPS (`accuracyM`) y la distancia
al punto propio en metros. Con esto el salón de la hackathon se puede
inspeccionar a pocos metros (de 1 a 10 m por píxel de pantalla según el zoom).

## Instalación como app web (PWA)

Para no depender de compilar el APK, el export web queda listo para
**instalar desde el navegador** como una app más en el teléfono.

- `front/public/manifest.webmanifest`: nombre `Campus Accesible · UTFSM`,
  `display: standalone`, orientación vertical, colores del mapa e íconos
  192/512 px con `purpose: any maskable`.
- `front/public/icon-192.png`, `icon-180.png` e `icon-512.png`: generados con
  `python3 front/scripts/generate-icons.py` usando la misma foto y el logo
  **Orienta** del splash (fondo blanco, letras amarillo/rojo/azul). El ícono de
  180 px es el `apple-touch-icon`. Los URLs llevan `?v=5` y el service worker
  subió a `campus-accesible-v5` para no reutilizar el ícono viejo. Como Android
  guarda el ícono al instalar, hay que borrar el acceso directo y volver a
  agregar la PWA para verlo.
- `front/public/sw.js`: service worker con caché del cascarón
  (`/`, `/index.html`, manifest e íconos). La navegación usa red primero y el
  `index.html` cacheado como respaldo; los assets usan caché primero. MQTT/WSS
  no se intercepta.
- `front/scripts/postbuild-web.js`: después de `expo export` inyecta en los
  `index.html` de `front/dist` el `<link rel="manifest">`, los meta de tema,
  el `apple-touch-icon`, los `apple-touch-startup-image`, el título en español
  y el registro del service worker. Se ejecuta solo desde
  `npm --prefix front run build:web`, así que Netlify (`npm run build` en la
  raíz) lo incluye sin cambios.

#### Splash

Los splash tienen **fondo blanco**, la palabra **Orienta** con las letras en
amarillo/rojo/azul (`#f59e0b`, `#b91c1c`, `#1d4ed8`) y el subtítulo
`Campus accesible · UTFSM`. Se generan con
`python3 front/scripts/generate-splash.py` en cuatro tamaños:
`1242x2688`, `1284x2778`, `1290x2796` (iOS) y `1080x1920` (Android/nativo).

El script busca una foto del app en `front/public/splash-foto.webp` (también
acepta `.png`, `.jpg` o `.jpeg`), la mete centrada con bordes redondeados y
compone el texto debajo. Si no hay foto, dibuja un pin morado de respaldo para
que el build nunca falle. Para usar la foto real: copiarla a esa ruta, correr
el generador y `npm --prefix front run build:web`. `front/app.json` apunta el
splash nativo a `public/splash-1080x1920.png` con fondo blanco.

Además del splash del sistema, `front/App.tsx` muestra un **splash interno**
durante 1,8 s apenas se abre la app, **antes de elegir vidente o no vidente**
(en web y en nativo), con el mismo PNG `/splash-1080x1920.png`. Se puede tocar
para saltarlo. El `<Splash />` está en el `View` raíz, por fuera del condicional
de modo, para que cubra también la pantalla de selección. Esto evita el problema
de que una PWA **ya instalada** conserva el `apple-touch-startup-image` con el
que se instaló: el overlay siempre muestra la versión nueva. El service worker
subió a `campus-accesible-v5` y ahora cachea también el splash y la foto con
un URL versionado (`/splash-1080x1920.png?v=5`), para que un PWA instalado con
el pin de respaldo no siga sirviendo esa imagen vieja desde el caché.

Si el splash del sistema no cambia después de un deploy, hay que **borrar la
app de la pantalla de inicio y volver a agregarla** (iOS guarda ese archivo al
instalar). El splash interno, en cambio, aparece con solo recargar.

En **Android**, Chrome no usa un PNG de splash: pinta el fondo con
`theme_color` del manifest y encima el ícono. Por eso `theme_color` y
`background_color` son `#ffffff`; el splash con la foto y la palabra Orienta
lo aporta el overlay interno de `App.tsx`, que se ve después del splash de
Chrome. Si la PWA ya estaba instalada, hay que desinstalarla y volver a
instalarla desde la URL de Netlify para que Chrome tome el manifest nuevo.

En la portada aparece el botón **Instalar app web**:

- En Chrome/Android dispara el prompt nativo `beforeinstallprompt`.
- En iOS Safari muestra: *Compartir → Agregar a pantalla de inicio*. No se
  puede disparar el prompt desde JS en Safari, por eso son instrucciones.

Después de instalar se abre en pantalla completa, sin barras del navegador, y
sigue pidiendo ubicación por HTTPS igual que la web. Requiere Netlify (o
cualquier servidor HTTPS): el service worker y la geolocalización no funcionan
por `http://IP-local`. Si el usuario ya tiene la pestaña abierta, debe recargar
una vez después de cada deploy para tomar el service worker nuevo.

### Accesibilidad y responsive

- El mapa tiene un `<h1>` oculto, instrucciones para lectores de pantalla
  (`#mapa-instrucciones`), una región `#announcer` (`role="status"`) y foco
  visible con doble contorno. La voz automática se puede desactivar (guardado
  en `localStorage`) para no duplicar la lectura de un lector de pantalla.
- Las indicaciones incluyen **distancia en metros** (`METROS_POR_PIXEL = 0.75`,
  el mismo valor de `App.tsx`) y dirección cardinal. El panel ya no tiene
  botones de "Mi ubicación" ni de zoom: se cierra con la **X** superior derecha,
  tocando fuera de él o con `Escape`; el zoom se hace con rueda o pellizco.
- El panel se desplaza internamente si no cabe; nunca se sale del viewport. Se
  respetan zonas seguras (`env(safe-area-inset-*)`) y `100dvh`.
- Zoom estilo Google Maps: `minZoom()` es dinámico (`max(ancho/1312, alto/985)`)
  y el plano siempre cubre la pantalla; `clamp()` impide panear más allá de sus
  bordes, así que al alejar al máximo no aparece fondo vacío ni se corta la UI.
- El plano base se redibujó como mapa continuo: un patrón de manzanas cubre todo
  el lienzo y el campus, la Avenida Placeres y las calles llegan hasta los cuatro
  bordes. No quedan franjas lisas ("bordes blancos") alrededor del dibujo.
- El catastro tiene 18 edificios y 2 canchas clickeables (`8007` y `TENIS`),
  que se nombran y se pueden elegir como destino igual que los edificios.
  Cambios principales respecto a la versión
  anterior: **C** quedó en `(750, 372, 460×110)` (borde sur y=317, 5 px al norte
  de Avenida Placeres) y su lado este se alinea con **B** `(835, 510, 290×130)`;
  **A** pasó a `(840, 720, 170×210)` y **U** a `(710, 690, 60×170)`, dejando un
  pasillo estrecho de 15 px entre ambos; **E** se corrió a `(1050, 780)` para no
  chocar con **F2**; **F2** y **L** usan ahora 48 px de ancho mínimo (mismo
  mínimo táctil que el render) y no se solapan con A/E ni con la cancha. Se
  agregaron los recintos pequeños **R2**, **J** y **O**.
- La cancha principal `8007` es `x=440, y=460, w=150, h=240` y la de tenis
  `x=1150, y=690, w=70, h=120`, corrida a la derecha para que no la tape el
  sendero de Subida San Luis. La ladera (curvas de nivel) queda al sur cerca de
  **H**. Los 25 senderos/calles están duplicados con exactamente el mismo `d`
  en la capa de contorno (`#94a3b8`, 24 px) y en la de relleno blanco (16 px).
- Las polilíneas de los 25 senderos están duplicadas en `PATHS` y se convierten
  en un grafo (`GRAFO`) con las entradas de `ENTRADAS`. `mejorRuta()` usa
  Dijkstra desde el sendero más cercano al punto azul. Todos los tramos que
  puede usar la ruta están dibujados: no quedan accesos invisibles ni atajos
  entre nodos cercanos que crucen edificios.
- Al pulsar **Generar ruta** se inicia una navegación: `#routeLine` muestra el
  tramo que falta (azul) y `#routeDone` el ya recorrido (gris). Cada posición
  del GPS se proyecta sobre la ruta; `#sheetRoute` indica metros restantes y el
  próximo giro. Si el punto azul se sale más de 45 px, la ruta se recalcula; si
  llega a la entrada, se anuncia la llegada. El botón pasa a **Detener ruta**.
  Los tres botones del panel son solo iconos (ruta, escuchar y voz automática,
  de izquierda a derecha); al tocarlos, el TTS dice qué hace cada opción. El
  glifo no intercepta el toque (`pointer-events: none`) para que todo el botón
  responda, y el cierre por toque externo solo se aplica al mapa.
- Queda pendiente una medición exacta en píxeles sobre el catastro original para
  los recintos pequeños y los giros de los senderos; las coordenadas actuales
  son una aproximación visual consistente con el lienzo de 1312×985. El puente
  `setUserPosition(x, y)`, el teclado y la voz no se modificaron.
- Los giros y la llegada se anuncian por voz (o por el lector de pantalla), pero
  no se repite el mismo aviso en cada muestra del GPS. Al cerrar el panel,
  cambiar de edificio o detener la navegación, la ruta se oculta.

El componente `Mapa` tiene dos implementaciones: `Mapa.tsx` usa `WebView` en
iOS/Android y `Mapa.web.tsx` usa un `<iframe>` en navegador, porque
`react-native-webview` no está soportado en web. Ambas reciben la posición por
props y le envían al mapa el mismo mensaje (`{ type: 'position', x, y }`), así
que el GPS funciona igual en los dos casos.

## Ver avances en local

Ya hay una app Expo mínima en esta misma carpeta con un panel que muestra
estado del GPS, velocidad en km/h, última posición, estadísticas y alertas.
Al cargar la pantalla se pide permiso y se inicia el seguimiento solo; los
botones `Activar GPS` / `Detener` siguen disponibles para reiniciarlo o pausarlo,
y en modo no vidente se suma `Pedir ayuda` / `Cancelar ayuda`.

```sh
cd front
npm install
npm run dev
```

El servidor arranca en `http://localhost:19006` (opción **web**) y también
puedes abrirlo en Android/iOS con `npm run android` / `npm run ios`.
`App.tsx` es el punto de entrada; el mapa de Danko se conectará ahí.

Si editas `front/index.html`, regenera el HTML embebido con:

```sh
npm run build:mapa
```

Eso actualiza `front/mapa-html.ts` conservando UTF-8 (evita el mojibake).

## Deploy en Netlify

Hay un `netlify.toml` en la raíz. Netlify ejecuta `npm run build` en la raíz
(que instala las dependencias de `front/` con `npm ci` y luego corre
`expo export --platform web`) y publica `front/dist` con Node 22. Para probarlo:

1. Sube el repo a GitHub (ya está en `main`).
2. En Netlify → **Add new site → Import an existing project** → GitHub →
   selecciona `hackatonlyoss`.
3. Deja los valores que vienen en `netlify.toml` (Base directory `.`, Build
   command `npm run build`, Publish `front/dist` y `NODE_VERSION=22`) y pulsa
   **Deploy site**.
4. Abre la URL `https://<tu-sitio>.netlify.app` desde el celular.

### Rutas de la portada

La portada (equivalente a `index (4).html`) vive en `/`: pregunta si la persona
es vidente o no vidente y **no pide GPS** hasta que elige. Los enlaces llevan a:

- `/vidente/index.html` → redirige a `/?modo=vidente`: mapa visual, voz
  automática desactivada.
- `/no-vidente/index.html` → redirige a `/?modo=no-vidente`: mismo mapa con voz
  automática activada.

Los dos archivos de redirección viven en `front/public/` y Expo los copia al
`dist`, así que también funcionan en el servidor de desarrollo. `App.tsx` lee
el modo de `location.search` (y también acepta `location.pathname` como
compatibilidad). El botón **← Modo** vuelve a `/` y el historial funciona con
`popstate`. `Mapa.tsx` / `Mapa.web.tsx` envían al iframe
un mensaje `{ type: 'modo', modo }` antes de la primera posición GPS; el mapa
ajusta `autoVoice` según el modo y el botón "Voz automática" sigue pudiendo
cambiarlo.

El GPS necesita HTTPS (Netlify lo da por defecto) y permiso de ubicación del
navegador. En iOS Safari puede hacer falta tocar el botón `GPS` una vez si el
permiso automático no salta; en Android Chrome salta solo.

Para generar el `dist` en local sin Netlify:

```sh
npm --prefix front run build:web
```

---

## 1. Qué ya existe

| Necesidad | Función / export | Salida |
| --- | --- | --- |
| Permisos | `ensureForegroundPermissions()`, `ensureBackgroundPermissions()`, `openLocationSettings()` | `PermissionOutcome` |
| GPS en primer plano | `startForegroundTracking(options)` | `ForegroundTracker` |
| GPS en segundo plano | `startBackgroundTracking(options)`, `stopBackgroundTracking()`, `isBackgroundTrackingActive()` | `Promise<void>` / `Promise<boolean>` |
| Geofences | `startGeofencing(regions)`, `updateGeofences(regions)`, `stopGeofencing()`, `isGeofencingActive()` | `Promise<void>` / `Promise<boolean>` |
| Eventos en vivo | `backgroundLocations`, `geofenceEvents` | emisores con `.subscribe(cb)` |
| Cálculo de movimiento | `MovementTracker`, `computeSample()`, `haversineDistanceM()`, `bearingDeg()` | muestras y estadísticas |
| GeoJSON | `pointToFeature()`, `pointsToFeatureCollection()`, `routeToFeature()`, `toPosition()` | `Feature` / `FeatureCollection` |
| Accesibilidad | `movementStatsToText()`, `geofenceEventToText()`, `formatDistance()`, `formatSpeed()`, `formatHeading()` | texto en español |
| Alertas de seguridad | `createSafetyMonitor()`, `safetyAlerts` | vibración + `SafetyAlert` con texto |

Todo se importa desde `backend/src`:

```ts
import { ... } from '../backend/src'
```

(la ruta exacta depende de dónde esté tu app dentro de `front/`).

---

## 2. Preparación en la app de Expo

```sh
npx expo install expo-location expo-task-manager expo-haptics
```

### `app.json`

```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Usamos tu ubicación para mostrar el mapa de movilización.",
          "locationAlwaysAndWhenInUsePermission": "Usamos tu ubicación en segundo plano para registrar rutas y avisar de alertas.",
          "isIosBackgroundLocationEnabled": true,
          "isAndroidBackgroundLocationEnabled": true,
          "isAndroidForegroundServiceEnabled": true
        }
      ]
    ]
  }
}
```

### Registrar tareas en segundo plano

En el archivo raíz de la app (por ejemplo `app/_layout.tsx`):

```ts
import '../backend/src/tasks'
```

Debe ir antes de cualquier navegación. Si no, las tareas de background y
geofencing no se registrarán.

### Metro (si la app está dentro de `front/`)

```js
// front/metro.config.js
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)
const root = path.resolve(__dirname, '..')

config.watchFolders = [root]
config.resolver.nodeModulesPaths = [
  path.resolve(root, 'node_modules'),
  path.resolve(__dirname, 'node_modules'),
]

module.exports = config
```

---

## 3. Ejemplos rápidos

### Seguir al usuario en primer plano

```ts
import * as Location from 'expo-location'
import {
  startForegroundTracking,
  movementStatsToText,
  type ForegroundTracker,
} from '../backend/src'

let tracker: ForegroundTracker | undefined

startForegroundTracking({
  accuracy: Location.Accuracy.High,
  distanceIntervalM: 5,
  onError: console.warn,
}).then((t) => {
  tracker = t

  t.subscribe((sample) => {
    // sample.latitude / sample.longitude -> posición del marcador
    // sample.computedSpeedMps -> velocidad en m/s
    // sample.computedHeadingDeg -> rumbo en grados
    // sample.isMoving -> en movimiento / parado
  })
})

// Al desmontar:
tracker?.stop()

// Texto para vista de lista / lector de pantalla:
const resumen = movementStatsToText(tracker!.getStats())
```

### Rutas en GeoJSON para la capa `Rutas`

```ts
import {
  pointsToFeatureCollection,
  routeToFeature,
} from '../backend/src'

const puntos = tracker!.getPoints()

const marcadores = pointsToFeatureCollection(puntos) // capa Puntos
const ruta = routeToFeature(puntos)                  // capa Rutas
```

`GeoJSON` usa `[longitud, latitud]`. El helper `toPosition(point)` ya hace la
conversión desde `{ latitude, longitude }`.

### Background y geofences

```ts
import {
  backgroundLocations,
  geofenceEvents,
  geofenceEventToText,
  startBackgroundTracking,
  startGeofencing,
  type GeofenceRegion,
} from '../backend/src'

await startBackgroundTracking()

const zonas: GeofenceRegion[] = [
  {
    id: 'punto-encuentro',
    latitude: 20.67,
    longitude: -103.35,
    radiusM: 150,
  },
]

await startGeofencing(zonas)

const offLocations = backgroundLocations.subscribe((points) => {
  // points: GpsPoint[] -> actualiza la capa Rutas
})

const offGeofences = geofenceEvents.subscribe((event) => {
  const aviso = geofenceEventToText(event, 'Punto de encuentro')
  // "Entraste a la zona ..." / "Saliste de la zona ..."
  // -> capa Alertas + vista accesible
})

// Al desmontar:
offLocations()
offGeofences()
```

---

### Alerta al acercarse a una pared / salirse del camino

```ts
import {
  createSafetyMonitor,
  safetyAlerts,
  type WallSegment,
  type RoutePath,
} from '../backend/src'

const paredes: WallSegment[] = [
  {
    id: 'pared-norte',
    name: 'Pared norte',
    start: { latitude: 20.6701, longitude: -103.3501 },
    end: { latitude: 20.6701, longitude: -103.3495 },
  },
]

const camino: RoutePath = {
  id: 'ruta-1',
  points: [
    { latitude: 20.67, longitude: -103.35 },
    { latitude: 20.6705, longitude: -103.3498 },
  ],
}

const monitor = createSafetyMonitor({
  walls: paredes,
  routes: [camino],
  activeRouteId: 'ruta-1',
})

monitor.setOffPathAlertsEnabled(true) // viene desactivado

safetyAlerts.subscribe((alert) => {
  // alert.type: 'wall' | 'off-path'
  // alert.text -> anunciar con lector de pantalla / vista de lista
  // la vibración ya la dispara el módulo
})

// Opción A: pasar el monitor al tracker
startForegroundTracking({ safetyMonitor: monitor })

// Opción B: background
backgroundLocations.subscribe((points) => {
  points.forEach((point) => void monitor.evaluate(point))
})
```

Podemos activar/desactivar cada alerta y la vibración en caliente:

```ts
monitor.setWallAlertsEnabled(true)
monitor.setOffPathAlertsEnabled(true)
monitor.setVibrationEnabled(false)
monitor.setWalls(nuevasParedes)
monitor.setActiveRoute('ruta-2')
```

---

## 4. Formatos de datos

```ts
type GpsPoint = {
  latitude: number
  longitude: number
  accuracyM: number | null
  altitudeM: number | null
  speedMps: number | null
  headingDeg: number | null
  timestamp: number
}

type MovementSample = GpsPoint & {
  distanceFromPreviousM: number
  elapsedMs: number
  computedSpeedMps: number | null
  computedHeadingDeg: number | null
  isMoving: boolean
  isAccurate: boolean
}

type MovementStats = {
  distanceM: number
  movingDistanceM: number
  durationMs: number
  movingTimeMs: number
  stoppedTimeMs: number
  averageSpeedMps: number
  maxSpeedMps: number
  currentSpeedMps: number | null
  currentHeadingDeg: number | null
  isMoving: boolean
  sampleCount: number
}

type GeofenceEvent = {
  type: 'enter' | 'exit'
  regionId: string
  timestamp: number
}

type WallSegment = {
  id: string
  start: { latitude: number; longitude: number }
  end: { latitude: number; longitude: number }
  name?: string
}

type RoutePath = {
  id: string
  points: { latitude: number; longitude: number }[]
  name?: string
}

type SafetyAlert = {
  type: 'wall' | 'off-path'
  id: string
  distanceM: number
  text: string
  timestamp: number
}
```

---

## 5. Limitaciones importantes

- El **background location requiere development build**; Expo Go no lo soporta.
- En Android 11+ el permiso de segundo plano se activa desde ajustes del
  sistema (`openLocationSettings()`).
- iOS: máximo **20** geofences; Android: máximo **100**.
- El tracking en segundo plano se detiene si el usuario cierra la app.
- Los puntos con precisión peor que `maxAccuracyM` (default 50 m) se siguen
  emitiendo (para que la UI no se quede frozen), pero no cuentan para la ruta
  ni las estadísticas; vienen con `isAccurate: false`. El mapa además
  publica los que están hasta 150 m para que los demás usuarios vean el
  movimiento aunque la persona esté dentro de un edificio.
- La velocidad se calcula en **m/s**; multiplica por 3.6 para km/h
  (`formatSpeed()` ya lo hace).
- En iOS la vibración puede no producirse con modo de bajo consumo, Taptic
  Engine desactivado, cámara activa o dictado en uso.
- La alerta de pared está activa por defecto; la de salida del camino hay que
  habilitarla con `setOffPathAlertsEnabled(true)`.

---

## 6. Documentación relacionada

- `documentacion/mapa-de-movilizacion.md`: propuesta de capas, criterios de
  accesibilidad y criterios de aceptación.
- `backend/README.md`: referencia completa del módulo GPS.
