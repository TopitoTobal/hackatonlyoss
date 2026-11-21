import * as Location from 'expo-location'
import { Linking, Platform } from 'react-native'

import type { PermissionOutcome } from './types'

/* Safari iOS no implementa navigator.permissions.query({ name: 'geolocation' }).
   expo-location intenta usarlo en web y falla antes de mostrar el diálogo.
   En web pedimos el permiso directamente con getCurrentPosition(), que sí
   dispara el prompt de Safari cuando se llama desde un gesto del usuario. */
export async function ensureWebGeolocationPermissions(): Promise<PermissionOutcome> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return {
      ok: false,
      reason: 'unavailable',
      message: 'Este navegador no soporta geolocalización.',
      canAskAgain: false,
    }
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      () =>
        resolve({
          ok: true,
          foreground: {
            status: Location.PermissionStatus.GRANTED,
            granted: true,
            canAskAgain: true,
            expires: 'never',
          },
        }),
      (error) => {
        const denegado = error.code === error.PERMISSION_DENIED
        resolve({
          ok: false,
          reason: denegado ? 'foreground-denied' : 'unavailable',
          message: denegado
            ? 'Permiso de ubicación denegado. Actívalo en Ajustes → Safari → Sitios web → Ubicación.'
            : 'No se pudo obtener la ubicación. Revisa que el sitio se abra por HTTPS.',
          canAskAgain: !denegado,
        })
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    )
  })
}

export async function ensureForegroundPermissions(): Promise<PermissionOutcome> {
  /* En web usamos el camino directo: evita navigator.permissions (Safari iOS). */
  if (Platform.OS === 'web') return ensureWebGeolocationPermissions()

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
