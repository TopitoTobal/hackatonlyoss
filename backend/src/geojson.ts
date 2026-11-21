import type {
  GeofenceEvent,
  GpsPoint,
  LatLng,
  MovementStats,
} from './types'

export type Position = [number, number]
type Properties = Record<string, unknown>

export interface PointFeature {
  type: 'Feature'
  geometry: { type: 'Point'; coordinates: Position }
  properties: Properties
}

export interface LineStringFeature {
  type: 'Feature'
  geometry: { type: 'LineString'; coordinates: Position[] }
  properties: Properties
}

export type GpsFeature = PointFeature | LineStringFeature

export interface FeatureCollection<T extends GpsFeature = GpsFeature> {
  type: 'FeatureCollection'
  features: T[]
}

/** GeoJSON usa [longitud, latitud]. */
export function toPosition(point: LatLng): Position {
  return [point.longitude, point.latitude]
}

export function pointToFeature(
  point: GpsPoint,
  properties: Properties = {},
): PointFeature {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: toPosition(point) },
    properties: {
      timestamp: point.timestamp,
      accuracyM: point.accuracyM,
      speedMps: point.speedMps,
      headingDeg: point.headingDeg,
      ...properties,
    },
  }
}

export function pointsToFeatureCollection(
  points: GpsPoint[],
  properties: Properties = {},
): FeatureCollection<PointFeature> {
  return {
    type: 'FeatureCollection',
    features: points.map((point) => pointToFeature(point, properties)),
  }
}

export function routeToFeature(
  points: GpsPoint[],
  properties: Properties = {},
): LineStringFeature {
  return {
    type: 'Feature',
    geometry: { type: 'LineString', coordinates: points.map(toPosition) },
    properties: {
      pointCount: points.length,
      ...properties,
    },
  }
}

function formatNumber(value: number, locale: string, digits = 1): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: digits,
  }).format(value)
}

export function formatDistance(meters: number, locale = 'es-ES'): string {
  return meters < 1000
    ? `${formatNumber(meters, locale, 0)} m`
    : `${formatNumber(meters / 1000, locale)} km`
}

export function formatDuration(ms: number, locale = 'es-ES'): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours} h ${minutes} min`
  }
  if (minutes > 0) {
    return `${minutes} min ${seconds} s`
  }
  return `${seconds} s`
}

export function formatSpeed(
  metersPerSecond: number | null,
  locale = 'es-ES',
): string {
  if (metersPerSecond === null) return 'velocidad no disponible'
  return `${formatNumber(metersPerSecond * 3.6, locale)} km/h`
}

const CARDINAL_POINTS = [
  'norte',
  'noreste',
  'este',
  'sureste',
  'sur',
  'suroeste',
  'oeste',
  'noroeste',
] as const

export function formatHeading(
  degrees: number | null,
  locale = 'es-ES',
): string {
  if (degrees === null) return 'rumbo no disponible'

  const normalized = ((degrees % 360) + 360) % 360
  const index = Math.round(normalized / 45) % CARDINAL_POINTS.length

  return `${CARDINAL_POINTS[index]} (${formatNumber(normalized, locale, 0)}°)`
}

/** Texto equivalente para lectores de pantalla y vista de lista. */
export function movementStatsToText(
  stats: MovementStats,
  locale = 'es-ES',
): string {
  return [
    `Distancia recorrida: ${formatDistance(stats.distanceM, locale)}`,
    `Tiempo: ${formatDuration(stats.durationMs, locale)}`,
    `Velocidad actual: ${formatSpeed(stats.currentSpeedMps, locale)}`,
    `Rumbo: ${formatHeading(stats.currentHeadingDeg, locale)}`,
  ].join('. ') + '.'
}

export function geofenceEventToText(
  event: GeofenceEvent,
  regionName?: string,
): string {
  const name = regionName ?? event.regionId
  return event.type === 'enter'
    ? `Entraste a la zona ${name}.`
    : `Saliste de la zona ${name}.`
}
