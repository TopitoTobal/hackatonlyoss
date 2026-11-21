# Módulo GPS / movimiento (`backend/`)

Responsable de la gestión de ubicación y movimiento del mapa de movilización.
El mapa visual con Tailwind vive en `front/`; este módulo solo produce datos
normalizados (puntos, rutas, eventos y texto accesible) para que el front los
consuma.

## Instalación (en la app de Expo)

```sh
npx expo install expo-location expo-task-manager expo-haptics
```

## Configuración de `app.json`

El seguimiento en segundo plano necesita permisos nativos, así que hay que
hacer un **development build** (Expo Go no lo soporta) y configurar el plugin:

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

En Android 11+ el permiso de segundo plano se activa desde los ajustes del
sistema. Hay un helper `openLocationSettings()` para llevar al usuario allí.

## Registrar las tareas en segundo plano

`TaskManager.defineTask` debe ejecutarse en el scope raíz del bundle. Importa
el archivo `tasks` una sola vez, al inicio del layout raíz de la app:

```ts
// front/app/_layout.tsx (o el archivo raíz que use Danko)
import '../../backend/src/tasks'
```

Si la app de Expo está en la raíz del repo en vez de `front/`, ajusta la ruta.

## Uso: tracking en primer plano

```ts
import * as Location from 'expo-location'
import { startForegroundTracking, movementStatsToText } from '../../backend/src'

const tracker = await startForegroundTracking({
  accuracy: Location.Accuracy.High,
  distanceIntervalM: 5,
})

tracker.subscribe((sample) => {
  console.log(sample.computedSpeedMps, sample.isMoving)
})

const texto = movementStatsToText(tracker.getStats())
tracker.stop()
```

## Uso: background + geofences

```ts
import {
  backgroundLocations,
  geofenceEvents,
  geofenceEventToText,
  startBackgroundTracking,
  startGeofencing,
  type GeofenceRegion,
} from '../../backend/src'

await startBackgroundTracking()
await startGeofencing([
  { id: 'punto-encuentro', latitude: 20.67, longitude: -103.35, radiusM: 150 },
])

backgroundLocations.subscribe((points) => {
  // points: GpsPoint[] -> alimenta la capa Rutas
})

geofenceEvents.subscribe((event) => {
  console.log(geofenceEventToText(event, 'Punto de encuentro'))
})
```

## Alertas de seguridad (pared + salida del camino)

`createSafetyMonitor()` evalúa cada posición y vibra cuando el usuario está
cerca de una pared o cuando se sale del recorrido activo. La alarma de pared
viene activa por defecto; la de salida del camino hay que habilitarla
explícitamente.

```ts
import {
  createSafetyMonitor,
  safetyAlerts,
  type WallSegment,
  type RoutePath,
} from './backend/src'

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
  name: 'Ruta principal',
  points: [
    { latitude: 20.67, longitude: -103.35 },
    { latitude: 20.6705, longitude: -103.3498 },
  ],
}

const monitor = createSafetyMonitor({
  walls: paredes,
  routes: [camino],
  activeRouteId: camino.id,
  wallAlertDistanceM: 3,
  offPathDistanceM: 8,
  offPathConsecutiveSamples: 3,
  cooldownMs: 5_000,
})

monitor.setOffPathAlertsEnabled(true) // habilitar aviso de salida del camino

safetyAlerts.subscribe((alert) => {
  // alert.text -> anunciar con lector de pantalla / vista de lista
})

// Si usas startForegroundTracking, pásalo directamente:
startForegroundTracking({ safetyMonitor: monitor })
```

Para tracking en segundo plano, suscríbete a `backgroundLocations` y llama a
`monitor.evaluate(point)` por cada posición.

### Ajustes en caliente

- `setWalls(walls)` / `setRoutes(routes)` / `setActiveRoute(id)`.
- `setWallAlertsEnabled(bool)`, `setOffPathAlertsEnabled(bool)`.
- `setVibrationEnabled(bool)` para silenciar las vibraciones.
- `reset()` limpia el estado de desvío y los cooldowns.

### Comportamiento

- Pared: distancia al segmento más cercano; avisa al superar el umbral
  (3 m por defecto) con vibración de tipo `Error`.
- Salida del camino: distancia a la polilínea; hay que superar el umbral
  (8 m) durante varias muestras consecutivas (3 por defecto) para evitar
  falsos positivos; vibra con tipo `Warning`.
- Cooldown de 5 s por alerta para no repetir la vibración constantemente.
- La vibración usa `expo-haptics`; en iOS puede no vibrar con bajo consumo,
  Taptic Engine desactivado o cámara/dictado en uso.

## Salida de datos

- `pointsToFeatureCollection(points)` → `FeatureCollection` de puntos.
- `routeToFeature(points)` → `Feature` tipo `LineString` para la capa Rutas.
- `movementStatsToText(stats)` → resumen en español para lectores de pantalla.
- `geofenceEventToText(event, nombre)` → aviso accesible de entrada/salida.

## Nota de integración con Metro

Si la app de Expo está dentro de `front/` y el módulo se importa desde
`backend/`, Metro puede necesitar observar el repo completo:

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

## Límites conocidos

- iOS permite hasta 20 geofences simultáneas; Android hasta 100.
- El tracking en segundo plano se detiene si el usuario cierra la app.
- En iOS, el sistema reinicia la app al recibir un evento de geofence; en
  Android no.
