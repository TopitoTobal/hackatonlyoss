import type {
  LocationOptions,
  LocationPermissionResponse,
  LocationTaskOptions,
} from 'expo-location'

export interface LatLng {
  latitude: number
  longitude: number
}

/** Posición normalizada, independiente de la librería de mapas que use el front. */
export interface GpsPoint extends LatLng {
  accuracyM: number | null
  altitudeM: number | null
  speedMps: number | null
  headingDeg: number | null
  timestamp: number
}

/** Posición + datos de movimiento calculados respecto al punto anterior. */
export interface MovementSample extends GpsPoint {
  distanceFromPreviousM: number
  elapsedMs: number
  computedSpeedMps: number | null
  computedHeadingDeg: number | null
  isMoving: boolean
}

export interface MovementStats {
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

export interface TrackingConfig {
  maxAccuracyM: number
  stationarySpeedMps: number
}

export interface GeofenceRegion extends LatLng {
  id: string
  radiusM: number
  notifyOnEnter?: boolean
  notifyOnExit?: boolean
}

export interface GeofenceEvent {
  type: 'enter' | 'exit'
  regionId: string
  timestamp: number
}

export type PermissionFailureReason =
  | 'services-disabled'
  | 'foreground-denied'
  | 'background-denied'
  | 'unavailable'

export type PermissionOutcome =
  | {
      ok: true
      foreground: LocationPermissionResponse
      background?: LocationPermissionResponse
    }
  | {
      ok: false
      reason: PermissionFailureReason
      message: string
      canAskAgain: boolean
    }

export interface WallSegment {
  id: string
  start: LatLng
  end: LatLng
  name?: string
}

export interface RoutePath {
  id: string
  points: LatLng[]
  name?: string
}

export interface SafetyAlert {
  type: 'wall' | 'off-path'
  id: string
  distanceM: number
  text: string
  timestamp: number
}

export interface SafetyMonitorConfig {
  walls: WallSegment[]
  routes: RoutePath[]
  activeRouteId?: string
  wallAlertDistanceM: number
  offPathDistanceM: number
  offPathConsecutiveSamples: number
  cooldownMs: number
  vibrationEnabled: boolean
  wallAlertsEnabled: boolean
  offPathAlertsEnabled: boolean
}

export type AccuracyOption = LocationOptions['accuracy']
export type TaskAccuracyOption = LocationTaskOptions['accuracy']
