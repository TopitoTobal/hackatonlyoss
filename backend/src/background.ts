import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import { Platform } from 'react-native'

import {
  ANDROID_GEOFENCE_LIMIT,
  BACKGROUND_LOCATION_TASK,
  DEFAULT_BACKGROUND_DISTANCE_INTERVAL_M,
  GEOFENCING_TASK,
  IOS_GEOFENCE_LIMIT,
} from './constants'
import { ensureBackgroundPermissions } from './permissions'
import type { GeofenceRegion, TaskAccuracyOption } from './types'

import './tasks'

export interface BackgroundTrackingOptions {
  accuracy?: TaskAccuracyOption
  distanceIntervalM?: number
  timeIntervalMs?: number
  deferredDistanceM?: number
  deferredIntervalMs?: number
  showIndicator?: boolean
  notificationTitle?: string
  notificationBody?: string
}

async function assertTaskManagerAvailable(): Promise<void> {
  const available = await TaskManager.isAvailableAsync()

  if (!available) {
    throw new Error(
      'Las tareas en segundo plano requieren un development build de Expo; Expo Go no las soporta.',
    )
  }
}

export async function startBackgroundTracking(
  options: BackgroundTrackingOptions = {},
): Promise<void> {
  const permission = await ensureBackgroundPermissions()
  if (!permission.ok) throw new Error(permission.message)

  await assertTaskManagerAvailable()

  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: options.accuracy ?? Location.Accuracy.Balanced,
    distanceInterval:
      options.distanceIntervalM ?? DEFAULT_BACKGROUND_DISTANCE_INTERVAL_M,
    ...(options.timeIntervalMs !== undefined
      ? { timeInterval: options.timeIntervalMs }
      : {}),
    ...(options.deferredDistanceM
      ? { deferredUpdatesDistance: options.deferredDistanceM }
      : {}),
    ...(options.deferredIntervalMs
      ? { deferredUpdatesInterval: options.deferredIntervalMs }
      : {}),
    showsBackgroundLocationIndicator: options.showIndicator ?? true,
    foregroundService: {
      notificationTitle: options.notificationTitle ?? 'Ubicación activa',
      notificationBody:
        options.notificationBody ?? 'Registrando tu ruta de movilización.',
    },
  })
}

export async function stopBackgroundTracking(): Promise<void> {
  if (await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK)) {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK)
  }
}

export async function isBackgroundTrackingActive(): Promise<boolean> {
  return Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK)
}

/**
 * Inicia (o reemplaza) las geofences activas. En iOS se reporta el estado
 * inicial al arrancar la app; en Android el límite es mayor.
 */
export async function startGeofencing(
  regions: GeofenceRegion[],
): Promise<void> {
  const permission = await ensureBackgroundPermissions()
  if (!permission.ok) throw new Error(permission.message)

  await assertTaskManagerAvailable()

  const limit = Platform.OS === 'ios' ? IOS_GEOFENCE_LIMIT : ANDROID_GEOFENCE_LIMIT
  if (regions.length > limit) {
    throw new Error(
      `Demasiadas geofences: ${regions.length}. El máximo en ${Platform.OS} es ${limit}.`,
    )
  }

  await Location.startGeofencingAsync(
    GEOFENCING_TASK,
    regions.map((region) => ({
      identifier: region.id,
      latitude: region.latitude,
      longitude: region.longitude,
      radius: region.radiusM,
      notifyOnEnter: region.notifyOnEnter ?? true,
      notifyOnExit: region.notifyOnExit ?? true,
    })),
  )
}

/** Alias semántico: `startGeofencingAsync` ya reemplaza la lista completa. */
export const updateGeofences = startGeofencing

export async function stopGeofencing(): Promise<void> {
  if (await Location.hasStartedGeofencingAsync(GEOFENCING_TASK)) {
    await Location.stopGeofencingAsync(GEOFENCING_TASK)
  }
}

export async function isGeofencingActive(): Promise<boolean> {
  return Location.hasStartedGeofencingAsync(GEOFENCING_TASK)
}
