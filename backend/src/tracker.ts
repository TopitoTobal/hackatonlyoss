import * as Location from 'expo-location'
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
export async function startForegroundTracking(
  options: ForegroundTrackingOptions = {},
): Promise<ForegroundTracker> {
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
      if (sample) {
        samples.emit(sample)
        if (options.safetyMonitor) {
          void options.safetyMonitor.evaluate(sample)
        }
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
