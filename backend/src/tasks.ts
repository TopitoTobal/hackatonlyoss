import { GeofencingEventType } from 'expo-location'
import type { LocationObject } from 'expo-location'
import * as TaskManager from 'expo-task-manager'

import {
  BACKGROUND_LOCATION_TASK,
  GEOFENCING_TASK,
} from './constants'
import { backgroundLocations, geofenceEvents } from './events'
import { toGpsPoint } from './movement'

const canDefineTasks =
  typeof TaskManager.isTaskDefined === 'function' &&
  typeof TaskManager.defineTask === 'function'

/**
 * Define las tareas en segundo plano. DEBE ejecutarse en el scope raíz del
 * bundle, no dentro de un componente. Importa este archivo desde el layout
 * raíz de la app (por ejemplo `app/_layout.tsx`).
 */
if (canDefineTasks && !TaskManager.isTaskDefined(BACKGROUND_LOCATION_TASK)) {
  TaskManager.defineTask(BACKGROUND_LOCATION_TASK, ({ data, error }) => {
    if (error) {
      console.warn('[gps] error en tarea de ubicación:', error.message)
      return
    }

    const locations = (data as { locations?: LocationObject[] } | undefined)
      ?.locations

    if (locations?.length) {
      backgroundLocations.emit(locations.map(toGpsPoint))
    }
  })
}

if (canDefineTasks && !TaskManager.isTaskDefined(GEOFENCING_TASK)) {
  TaskManager.defineTask(GEOFENCING_TASK, ({ data, error }) => {
    if (error) {
      console.warn('[gps] error en tarea de geofencing:', error.message)
      return
    }

    const payload = data as
      | {
          eventType?: number
          region?: { identifier?: string }
        }
      | undefined

    if (!payload?.region) return

    const type =
      payload.eventType === GeofencingEventType.Enter
        ? 'enter'
        : payload.eventType === GeofencingEventType.Exit
          ? 'exit'
          : null

    if (!type) return

    geofenceEvents.emit({
      type,
      regionId: payload.region.identifier ?? 'unknown',
      timestamp: Date.now(),
    })
  })
}

export function areGpsTasksDefined(): boolean {
  return (
    canDefineTasks &&
    TaskManager.isTaskDefined(BACKGROUND_LOCATION_TASK) &&
    TaskManager.isTaskDefined(GEOFENCING_TASK)
  )
}
