import * as Location from 'expo-location'
import { Linking, Platform } from 'react-native'

import type { PermissionOutcome } from './types'

export async function ensureForegroundPermissions(): Promise<PermissionOutcome> {
  const servicesEnabled = await Location.hasServicesEnabledAsync()

  if (!servicesEnabled) {
    return {
      ok: false,
      reason: 'services-disabled',
      message: 'Los servicios de ubicación están desactivados en el dispositivo.',
      canAskAgain: true,
    }
  }

  const current = await Location.getForegroundPermissionsAsync()
  const response =
    current.status === 'granted'
      ? current
      : await Location.requestForegroundPermissionsAsync()

  if (response.status !== 'granted') {
    return {
      ok: false,
      reason: 'foreground-denied',
      message: 'Permiso de ubicación denegado. Habilítalo en ajustes de la app.',
      canAskAgain: response.canAskAgain,
    }
  }

  return { ok: true, foreground: response }
}

export async function ensureBackgroundPermissions(): Promise<PermissionOutcome> {
  if (Platform.OS === 'web') {
    return {
      ok: false,
      reason: 'unavailable',
      message: 'La ubicación en segundo plano no está disponible en la web.',
      canAskAgain: false,
    }
  }

  const foreground = await ensureForegroundPermissions()
  if (!foreground.ok) return foreground

  const available = await Location.isBackgroundLocationAvailableAsync()
  if (!available) {
    return {
      ok: false,
      reason: 'unavailable',
      message:
        'Este build no soporta ubicación en segundo plano. Usa un development build de Expo.',
      canAskAgain: false,
    }
  }

  const current = await Location.getBackgroundPermissionsAsync()
  const response =
    current.status === 'granted'
      ? current
      : await Location.requestBackgroundPermissionsAsync()

  if (response.status !== 'granted') {
    return {
      ok: false,
      reason: 'background-denied',
      message:
        'Permiso de ubicación en segundo plano denegado. En Android 11+ debes activarlo manualmente en ajustes.',
      canAskAgain: response.canAskAgain,
    }
  }

  return {
    ok: true,
    foreground: foreground.foreground,
    background: response,
  }
}

export function openLocationSettings(): Promise<void> {
  return Linking.openSettings()
}
