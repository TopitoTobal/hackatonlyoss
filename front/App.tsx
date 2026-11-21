import '../backend/src/tasks'

import { StatusBar } from 'expo-status-bar'
import * as Location from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native'

import {
  createSafetyMonitor,
  formatSpeed,
  movementStatsToText,
  safetyAlerts,
  startForegroundTracking,
  type ForegroundTracker,
  type RoutePath,
  type SafetyAlert,
  type SafetyMonitor,
  type WallSegment,
} from '../backend/src'

const PAREDES: WallSegment[] = []
const CAMINO: RoutePath = { id: 'demo', points: [] }

export default function App() {
  const trackerRef = useRef<ForegroundTracker | null>(null)
  const monitorRef = useRef<SafetyMonitor | null>(null)

  const [estado, setEstado] = useState('Detenido')
  const [ultimaPosicion, setUltimaPosicion] = useState('—')
  const [estadisticas, setEstadisticas] = useState('—')
  const [alerta, setAlerta] = useState('Sin alertas')

  useEffect(() => {
    monitorRef.current = createSafetyMonitor({
      walls: PAREDES,
      routes: [CAMINO],
      activeRouteId: CAMINO.id,
    })

    const omitirAlerta = safetyAlerts.subscribe((nueva: SafetyAlert) => {
      setAlerta(nueva.text)
    })

    return () => {
      omitirAlerta()
      trackerRef.current?.stop()
      trackerRef.current = null
    }
  }, [])

  async function iniciar() {
    setEstado('Solicitando permisos…')

    try {
      const tracker = await startForegroundTracking({
        accuracy: Location.Accuracy.High,
        safetyMonitor: monitorRef.current ?? undefined,
        onError: (mensaje) => setEstado(`Error GPS: ${mensaje}`),
      })

      trackerRef.current = tracker

      tracker.subscribe((muestra) => {
        setUltimaPosicion(
          `${muestra.latitude.toFixed(5)}, ${muestra.longitude.toFixed(5)} · ${formatSpeed(muestra.computedSpeedMps)}`,
        )
        setEstadisticas(movementStatsToText(tracker.getStats()))
      })

      setEstado('Siguiendo ubicación')
    } catch (error) {
      setEstado(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  function detener() {
    trackerRef.current?.stop()
    trackerRef.current = null
    setEstado('Detenido')
  }

  return (
    <View style={styles.contenedor}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.contenido}>
        <Text style={styles.titulo}>hackatonlyoss</Text>
        <Text style={styles.subtitulo}>Panel de avances · GPS / movimiento</Text>

        <View style={styles.tarjeta}>
          <Text style={styles.etiqueta}>Estado</Text>
          <Text style={styles.valor}>{estado}</Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.etiqueta}>Última posición</Text>
          <Text style={styles.valor}>{ultimaPosicion}</Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.etiqueta}>Movimiento</Text>
          <Text style={styles.valor}>{estadisticas}</Text>
        </View>

        <View style={styles.tarjetaAlerta}>
          <Text style={styles.etiqueta}>Alertas de seguridad</Text>
          <Text style={styles.valorAlerta}>{alerta}</Text>
        </View>

        <View style={styles.botones}>
          <View style={styles.boton}>
            <Button title="Iniciar GPS" onPress={iniciar} color="#34d399" />
          </View>
          <View style={styles.boton}>
            <Button title="Detener" onPress={detener} color="#f87171" />
          </View>
        </View>

        <Text style={styles.nota}>
          El mapa interactivo de Danko se conectará aquí. Esta pantalla solo
          muestra lo que ya produce el módulo de backend.
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  contenido: {
    padding: 24,
    paddingTop: 64,
    gap: 16,
  },
  titulo: {
    color: '#f8fafc',
    fontSize: 30,
    fontWeight: '700',
  },
  subtitulo: {
    color: '#94a3b8',
    fontSize: 15,
    marginBottom: 8,
  },
  tarjeta: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
  },
  tarjetaAlerta: {
    backgroundColor: '#3f2d1a',
    borderRadius: 12,
    padding: 16,
  },
  etiqueta: {
    color: '#93c5fd',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  valor: {
    color: '#e2e8f0',
    fontSize: 16,
  },
  valorAlerta: {
    color: '#fcd34d',
    fontSize: 16,
  },
  botones: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  boton: {
    flex: 1,
  },
  nota: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 16,
  },
})
