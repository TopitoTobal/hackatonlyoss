import { haversineDistanceM } from './movement'
import type { LatLng } from './types'

const METERS_PER_DEGREE_LAT = 111_320

interface PointXY {
  x: number
  y: number
}

/**
 * Proyección local aproximada en metros. Suficiente para distancias cortas
 * (obstáculos y desvíos de ruta dentro de una misma zona).
 */
function project(point: LatLng, origin: LatLng): PointXY {
  const metersPerDegreeLng =
    METERS_PER_DEGREE_LAT * Math.cos((origin.latitude * Math.PI) / 180)

  return {
    x: (point.longitude - origin.longitude) * metersPerDegreeLng,
    y: (point.latitude - origin.latitude) * METERS_PER_DEGREE_LAT,
  }
}

/** Distancia en metros de un punto a un segmento de pared. */
export function distancePointToSegmentM(
  point: LatLng,
  start: LatLng,
  end: LatLng,
): number {
  const p = project(point, start)
  const b = project(end, start)
  const dx = b.x
  const dy = b.y
  const lengthSquared = dx * dx + dy * dy

  if (lengthSquared === 0) {
    return Math.hypot(p.x, p.y)
  }

  const t = Math.max(
    0,
    Math.min(1, (p.x * dx + p.y * dy) / lengthSquared),
  )

  return Math.hypot(p.x - t * dx, p.y - t * dy)
}

/** Distancia en metros de un punto a una polilínea (ruta). */
export function distanceToPolylineM(point: LatLng, points: LatLng[]): number {
  if (points.length === 0) return Number.POSITIVE_INFINITY

  if (points.length === 1) {
    return haversineDistanceM(point, points[0])
  }

  let minimum = Number.POSITIVE_INFINITY

  for (let index = 0; index < points.length - 1; index += 1) {
    minimum = Math.min(
      minimum,
      distancePointToSegmentM(point, points[index], points[index + 1]),
    )
  }

  return minimum
}
