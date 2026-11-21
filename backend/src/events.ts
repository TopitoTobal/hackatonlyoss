export type Unsubscribe = () => void

export interface Emitter<T> {
  subscribe(listener: (payload: T) => void): Unsubscribe
  emit(payload: T): void
  clear(): void
}

export function createEmitter<T>(): Emitter<T> {
  const listeners = new Set<(payload: T) => void>()

  return {
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    emit(payload) {
      listeners.forEach((listener) => {
        try {
          listener(payload)
        } catch (error) {
          console.warn('[gps] listener falló:', error)
        }
      })
    },
    clear() {
      listeners.clear()
    },
  }
}

/** Lotes de posiciones recibidos por la tarea de ubicación en segundo plano. */
export const backgroundLocations = createEmitter<import('./types').GpsPoint[]>()

/** Eventos de entrada/salida de geofences. */
export const geofenceEvents = createEmitter<import('./types').GeofenceEvent>()
