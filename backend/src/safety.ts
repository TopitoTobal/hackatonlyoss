import * as Haptics from 'expo-haptics'

import { createEmitter } from './events'
import { distancePointToSegmentM, distanceToPolylineM } from './geometry'
import { formatDistance } from './geojson'
import type {
  GpsPoint,
  RoutePath,
  SafetyAlert,
  SafetyMonitorConfig,
  WallSegment,
} from './types'

const DEFAULT_CONFIG: SafetyMonitorConfig = {
  walls: [],
  routes: [],
  wallAlertDistanceM: 3,
  offPathDistanceM: 8,
  offPathConsecutiveSamples: 3,
  cooldownMs: 5_000,
  vibrationEnabled: true,
  wallAlertsEnabled: true,
  offPathAlertsEnabled: false,
}

/** Avisos de proximidad a pared y de salida del camino. */
export const safetyAlerts = createEmitter<SafetyAlert>()

export type SafetyMonitor = ReturnType<typeof createSafetyMonitor>

export function createSafetyMonitor(
  overrides: Partial<SafetyMonitorConfig> = {},
): SafetyMonitor {
  let config: SafetyMonitorConfig = { ...DEFAULT_CONFIG, ...overrides }
  let offPathConsecutive = 0
  const lastAlertAt = new Map<string, number>()

  function getActiveRoute(): RoutePath | null {
    if (!config.activeRouteId) return config.routes[0] ?? null
    return config.routes.find((route) => route.id === config.activeRouteId) ?? null
  }

  function canAlert(key: string, now: number): boolean {
    const last = lastAlertAt.get(key)
    return last === undefined || now - last >= config.cooldownMs
  }

  async function vibrate(alert: SafetyAlert): Promise<void> {
    if (!config.vibrationEnabled) return

    try {
      await Haptics.notificationAsync(
        alert.type === 'wall'
          ? Haptics.NotificationFeedbackType.Error
          : Haptics.NotificationFeedbackType.Warning,
      )
    } catch (error) {
      console.warn('[gps] no se pudo vibrar:', error)
    }
  }

  async function evaluate(point: GpsPoint): Promise<SafetyAlert | null> {
    const now = Date.now()
    let alert: SafetyAlert | null = null

    if (config.wallAlertsEnabled && config.walls.length > 0) {
      let nearestWall: WallSegment | null = null
      let nearestDistance = Number.POSITIVE_INFINITY

      for (const wall of config.walls) {
        const distance = distancePointToSegmentM(point, wall.start, wall.end)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestWall = wall
        }
      }

      if (nearestWall && nearestDistance <= config.wallAlertDistanceM) {
        const key = `wall:${nearestWall.id}`

        if (canAlert(key, now)) {
          alert = {
            type: 'wall',
            id: nearestWall.id,
            distanceM: nearestDistance,
            text: `Precaución: pared cerca. ${nearestWall.name ?? 'Obstáculo'} a ${formatDistance(nearestDistance)}.`,
            timestamp: now,
          }
          lastAlertAt.set(key, now)
        }
      }
    }

    if (!alert && config.offPathAlertsEnabled) {
      const route = getActiveRoute()

      if (route) {
        const distance = distanceToPolylineM(point, route.points)

        if (distance > config.offPathDistanceM) {
          offPathConsecutive += 1
        } else {
          offPathConsecutive = 0
        }

        if (offPathConsecutive >= config.offPathConsecutiveSamples) {
          const key = `off-path:${route.id}`

          if (canAlert(key, now)) {
            alert = {
              type: 'off-path',
              id: route.id,
              distanceM: distance,
              text: `Precaución: te saliste del camino. Distancia al recorrido: ${formatDistance(distance)}.`,
              timestamp: now,
            }
            lastAlertAt.set(key, now)
          }
        }
      }
    }

    if (alert) {
      safetyAlerts.emit(alert)
      await vibrate(alert)
    }

    return alert
  }

  return {
    evaluate,
    updateConfig(partial: Partial<SafetyMonitorConfig>) {
      config = { ...config, ...partial }
    },
    setWalls(walls: WallSegment[]) {
      config = { ...config, walls }
    },
    setRoutes(routes: RoutePath[]) {
      config = { ...config, routes }
      if (
        config.activeRouteId &&
        !routes.some((route) => route.id === config.activeRouteId)
      ) {
        config = { ...config, activeRouteId: routes[0]?.id }
      }
    },
    setActiveRoute(routeId: string | null) {
      config = { ...config, activeRouteId: routeId ?? undefined }
      offPathConsecutive = 0
    },
    setWallAlertsEnabled(enabled: boolean) {
      config = { ...config, wallAlertsEnabled: enabled }
    },
    setOffPathAlertsEnabled(enabled: boolean) {
      config = { ...config, offPathAlertsEnabled: enabled }
      offPathConsecutive = 0
    },
    setVibrationEnabled(enabled: boolean) {
      config = { ...config, vibrationEnabled: enabled }
    },
    reset() {
      offPathConsecutive = 0
      lastAlertAt.clear()
    },
    getState() {
      return {
        config: { ...config },
        offPathConsecutive,
      }
    },
  }
}
