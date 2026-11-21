# Implementaciones disponibles para el front

**Estado:** el módulo de GPS y movimiento ya está en `backend/` (commit `2fe9c61`).  
Este archivo es el handoff para quien construye el mapa con Tailwind: aquí está
todo lo que ya puedes consumir desde `front/`. El mapa vive en
`front/index.html` y `App.tsx` lo carga en un `WebView`, enviándole la
ubicación del GPS con `postMessage({ type: 'position', x, y })`.
La conversión lat/lng → píxeles del plano está en `App.tsx` (`aPuntoPlano`)
y usa una referencia aproximada pendiente de georreferenciar.

El componente `Mapa` tiene dos implementaciones: `Mapa.tsx` usa `WebView` en
iOS/Android y `Mapa.web.tsx` usa un `<iframe>` en navegador, porque
`react-native-webview` no está soportado en web. Ambas reciben la posición por
props y le envían al mapa el mismo mensaje (`{ type: 'position', x, y }`), así
que el GPS funciona igual en los dos casos.

## Ver avances en local

Ya hay una app Expo mínima en esta misma carpeta con un panel que muestra
estado del GPS, última posición, estadísticas y alertas:

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
- Los puntos con precisión peor que `maxAccuracyM` (default 50 m) se descartan.
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
