import * as Location from 'expo-location'
import { Platform } from 'react-native'
import type { LocationSubscription } from 'expo-location'

import {
  DEFAULT_FOREGROUND_DISTANCE_INTERVAL_M,
  DEFAULT_MAX_ACCURACY_M,
  DEFAULT_STATIONARY_SPEED_MPS,
} from './constants'
import { createEmitter, type Emitter, type Unsubscribe } from './events'
import { MovementTracker, toGpsPoint } from './movement'
import { ensureForegroundPermissions } from './permissions'
import type { SafetyMonitor } from './safety'
import type {
  AccuracyOption,
  GpsPoint,
  MovementSample,
  MovementStats,
} from './types'

export interface ForegroundTrackingOptions {
  accuracy?: AccuracyOption
  distanceIntervalM?: number
  timeIntervalMs?: number
  maxAccuracyM?: number
  stationarySpeedMps?: number
  onError?: (message: string) => void
  safetyMonitor?: SafetyMonitor
}

export interface ForegroundTracker {
  stop(): void
  getPoints(): GpsPoint[]
  getStats(): MovementStats
  subscribe(listener: (sample: MovementSample) => void): Unsubscribe
  samples: Emitter<MovementSample>
}

/**
 * Tracking mientras la app está en primer plano. Para segundo plano usa
 * `startBackgroundTracking` del módulo `background`.
 */
/* En web, el watch de expo-location no entrega muestras de forma confiable en
   Safari iOS. Usamos la API del navegador directamente y emitimos las mismas
   MovementSample, así front/App.tsx no cambia. */
async function startWebForegroundTracking(
  options: ForegroundTrackingOptions = {},
): Promise<ForegroundTracker> {
  const permiso = await ensureForegroundPermissions()
  if (!permiso.ok) throw new Error(permiso.message)

  const tracker = new MovementTracker({
    maxAccuracyM: options.maxAccuracyM ?? DEFAULT_MAX_ACCURACY_M,
    stationarySpeedMps:
      options.stationarySpeedMps ?? DEFAULT_STATIONARY_SPEED_MPS,
  })
  const samples: Emitter<MovementSample> = createEmitter()

  const emitir = (pos: GeolocationPosition) => {
    const punto: GpsPoint = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracyM: pos.coords.accuracy ?? null,
      altitudeM: pos.coords.altitude ?? null,
      speedMps: pos.coords.speed ?? null,
      headingDeg: pos.coords.heading ?? null,
      timestamp: pos.timestamp,
    }
    const sample = tracker.push(punto)
    samples.emit(sample)

    if (options.safetyMonitor && sample.isAccurate) {
      void options.safetyMonitor.evaluate(sample)
    }
  }

  /* Primera muestra inmediata: el punto aparece aunque el watch tarde. */
  const inicial = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000,
    })
  })
  emitir(inicial)

  const watchId = navigator.geolocation.watchPosition(
    emitir,
    (error) => options.onError?.(error.message || String(error)),
    { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
  )

  return {
    stop: () => navigator.geolocation.clearWatch(watchId),
    getPoints: () => tracker.getPoints(),
    getStats: () => tracker.getStats(),
    subscribe: samples.subscribe,
    samples,
  }
}

export async function startForegroundTracking(
  options: ForegroundTrackingOptions = {},
): Promise<ForegroundTracker> {
  if (Platform.OS === 'web') return startWebForegroundTracking(options)

  const permission = await ensureForegroundPermissions()
  if (!permission.ok) throw new Error(permission.message)

  const tracker = new MovementTracker({
    maxAccuracyM: options.maxAccuracyM ?? DEFAULT_MAX_ACCURACY_M,
    stationarySpeedMps:
      options.stationarySpeedMps ?? DEFAULT_STATIONARY_SPEED_MPS,
  })
  const samples: Emitter<MovementSample> = createEmitter()

  const subscription: LocationSubscription = await Location.watchPositionAsync(
    {
      accuracy: options.accuracy ?? Location.Accuracy.High,
      distanceInterval:
        options.distanceIntervalM ?? DEFAULT_FOREGROUND_DISTANCE_INTERVAL_M,
      ...(options.timeIntervalMs !== undefined
        ? { timeInterval: options.timeIntervalMs }
        : {}),
    },
    (location) => {
      const sample = tracker.push(toGpsPoint(location))
      samples.emit(sample)

      if (options.safetyMonitor && sample.isAccurate) {
        void options.safetyMonitor.evaluate(sample)
      }
    },
    (message) => options.onError?.(message),
  )

  return {
    stop: () => subscription.remove(),
    getPoints: () => tracker.getPoints(),
    getStats: () => tracker.getStats(),
    subscribe: samples.subscribe,
    samples,
  }
}
