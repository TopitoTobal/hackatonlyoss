import * as Location from 'expo-location'

import {
  DEFAULT_MAX_ACCURACY_M,
  DEFAULT_STATIONARY_SPEED_MPS,
} from './constants'
import type {
  GpsPoint,
  LatLng,
  MovementSample,
  MovementStats,
  TrackingConfig,
} from './types'

const EARTH_RADIUS_M = 6_371_000

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180
const toDegrees = (radians: number): number => (radians * 180) / Math.PI

export function toGpsPoint(location: Location.LocationObject): GpsPoint {
  const coords = location.coords

  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    accuracyM: coords.accuracy ?? null,
    altitudeM: coords.altitude ?? null,
    speedMps: coords.speed ?? null,
    headingDeg: coords.heading ?? null,
    timestamp: location.timestamp,
  }
}

/** Distancia en metros entre dos coordenadas (fórmula de Haversine). */
export function haversineDistanceM(a: LatLng, b: LatLng): number {
  const dLat = toRadians(b.latitude - a.latitude)
  const dLng = toRadians(b.longitude - a.longitude)
  const lat1 = toRadians(a.latitude)
  const lat2 = toRadians(b.latitude)

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2

  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Rumbo en grados (0 = norte, 90 = este). */
export function bearingDeg(a: LatLng, b: LatLng): number {
  const lat1 = toRadians(a.latitude)
  const lat2 = toRadians(b.latitude)
  const dLng = toRadians(b.longitude - a.longitude)

  const y = Math.sin(dLng) * Math.cos(lat2)
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)

  return (toDegrees(Math.atan2(y, x)) + 360) % 360
}

export function computeSample(
  previous: GpsPoint | null,
  current: GpsPoint,
  stationarySpeedMps: number = DEFAULT_STATIONARY_SPEED_MPS,
  maxAccuracyM: number = DEFAULT_MAX_ACCURACY_M,
): MovementSample {
  const distanceFromPreviousM = previous
    ? haversineDistanceM(previous, current)
    : 0
  const elapsedMs = previous
    ? Math.max(0, current.timestamp - previous.timestamp)
    : 0

  const computedSpeedMps =
    current.speedMps ??
    (elapsedMs > 0 ? distanceFromPreviousM / (elapsedMs / 1000) : null)

  const computedHeadingDeg =
    current.headingDeg ??
    (previous && distanceFromPreviousM > 0
      ? bearingDeg(previous, current)
      : null)

  return {
    ...current,
    distanceFromPreviousM,
    elapsedMs,
    computedSpeedMps,
    computedHeadingDeg,
    isMoving:
      computedSpeedMps !== null && computedSpeedMps >= stationarySpeedMps,
    isAccurate:
      current.accuracyM === null || current.accuracyM <= maxAccuracyM,
  }
}

/**
 * Acumula puntos y estadísticas de movimiento. Las posiciones con precisión
 * peor que `maxAccuracyM` se emiten igual para que la UI pueda mostrarlas,
 * pero no cuentan para la ruta ni para las estadísticas.
 */
export class MovementTracker {
  private readonly points: GpsPoint[] = []
  private readonly samples: MovementSample[] = []
  private readonly config: TrackingConfig

  private distanceM = 0
  private movingDistanceM = 0
  private movingTimeMs = 0
  private stoppedTimeMs = 0
  private maxSpeedMps = 0

  constructor(config: Partial<TrackingConfig> = {}) {
    this.config = {
      maxAccuracyM: config.maxAccuracyM ?? DEFAULT_MAX_ACCURACY_M,
      stationarySpeedMps:
        config.stationarySpeedMps ?? DEFAULT_STATIONARY_SPEED_MPS,
    }
  }

  push(point: GpsPoint): MovementSample {
    const previous = this.points[this.points.length - 1] ?? null
    const sample = computeSample(
      previous,
      point,
      this.config.stationarySpeedMps,
      this.config.maxAccuracyM,
    )

    if (sample.isAccurate) {
      this.points.push(point)
      this.samples.push(sample)

      this.distanceM += sample.distanceFromPreviousM

      if (sample.isMoving) {
        this.movingDistanceM += sample.distanceFromPreviousM
        this.movingTimeMs += sample.elapsedMs
      } else {
        this.stoppedTimeMs += sample.elapsedMs
      }

      if (sample.computedSpeedMps !== null) {
        this.maxSpeedMps = Math.max(this.maxSpeedMps, sample.computedSpeedMps)
      }
    }

    return sample
  }

  getPoints(): GpsPoint[] {
    return [...this.points]
  }

  getSamples(): MovementSample[] {
    return [...this.samples]
  }

  getStats(): MovementStats {
    const first = this.points[0]
    const last = this.points[this.points.length - 1]
    const lastSample = this.samples[this.samples.length - 1]
    const durationMs =
      first && last ? Math.max(0, last.timestamp - first.timestamp) : 0

    return {
      distanceM: this.distanceM,
      movingDistanceM: this.movingDistanceM,
      durationMs,
      movingTimeMs: this.movingTimeMs,
      stoppedTimeMs: this.stoppedTimeMs,
      averageSpeedMps:
        durationMs > 0 ? this.distanceM / (durationMs / 1000) : 0,
      maxSpeedMps: this.maxSpeedMps,
      currentSpeedMps: lastSample?.computedSpeedMps ?? null,
      currentHeadingDeg: lastSample?.computedHeadingDeg ?? null,
      isMoving: lastSample?.isMoving ?? false,
      sampleCount: this.samples.length,
    }
  }

  reset(): void {
    this.points.length = 0
    this.samples.length = 0
    this.distanceM = 0
    this.movingDistanceM = 0
    this.movingTimeMs = 0
    this.stoppedTimeMs = 0
    this.maxSpeedMps = 0
  }
}
