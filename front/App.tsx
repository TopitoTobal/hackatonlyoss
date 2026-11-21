import '../backend/src/tasks'

import { StatusBar } from 'expo-status-bar'
import * as Location from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'

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

import { MAPA_HTML } from './mapa-html'

const PAREDES: WallSegment[] = []
const CAMINO: RoutePath = { id: 'demo', points: [] }

/* El plano del mapa mide 1312x985 px y su centro es (690, 500).
   La referencia geográfica del centro es el campus (20.67, -103.35).
   TODO: sustituir por una georreferenciación real del plano. */
const PLANO = { centroX: 690, centroY: 500 }
const REFERENCIA = { latitude: 20.67, longitude: -103.35 }
const METROS_POR_PIXEL = 0.75

type PuntoPlano = { x: number; y: number }

function aPuntoPlano(latitude: number, longitude: number): PuntoPlano {
  const metrosPorGradoLat = 111_320
  const metrosPorGradoLng =
    111_320 * Math.cos((REFERENCIA.latitude * Math.PI) / 180)
  const dx = ((longitude - REFERENCIA.longitude) * metrosPorGradoLng) / METROS_POR_PIXEL
  const dy = (-(latitude - REFERENCIA.latitude) * metrosPorGradoLat) / METROS_POR_PIXEL
  return { x: PLANO.centroX + dx, y: PLANO.centroY + dy }
}

export default function App() {
  const webViewRef = useRef<WebView<object> | null>(null)
  const trackerRef = useRef<ForegroundTracker | null>(null)
  const monitorRef = useRef<SafetyMonitor | null>(null)
  const puntoRef = useRef<PuntoPlano>({ x: PLANO.centroX, y: PLANO.centroY })

  const [estado, setEstado] = useState('Detenido')
  const [ultimaPosicion, setUltimaPosicion] = useState('—')
  const [estadisticas, setEstadisticas] = useState('—')
  const [alerta, setAlerta] = useState('Sin alertas')

  function enviarPosicion(punto: PuntoPlano) {
    webViewRef.current?.postMessage(
      JSON.stringify({ type: 'position', x: punto.x, y: punto.y }),
    )
  }

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
        const punto = aPuntoPlano(muestra.latitude, muestra.longitude)
        puntoRef.current = punto
        enviarPosicion(punto)

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
      <StatusBar style="dark" />

      <WebView<object>
        ref={webViewRef}
        source={{ html: MAPA_HTML }}
        style={styles.mapa}
        originWhitelist={['*']}
        javaScriptEnabled
        onLoadEnd={() => enviarPosicion(puntoRef.current)}
      />

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.barra}>
          <Text style={styles.estado} accessibilityLiveRegion="polite">
            {estado}
          </Text>
          <View style={styles.boton}>
            <Button title="GPS" onPress={iniciar} color="#34d399" />
          </View>
          <View style={styles.boton}>
            <Button title="Detener" onPress={detener} color="#f87171" />
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.texto} numberOfLines={2}>
            {ultimaPosicion}
          </Text>
          <Text style={styles.texto} numberOfLines={2}>
            {estadisticas}
          </Text>
          <Text style={styles.alerta} accessibilityLiveRegion="polite">
            {alerta}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#e2e8f0',
  },
  mapa: {
    flex: 1,
    backgroundColor: '#e2e8f0',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    gap: 8,
  },
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  estado: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  boton: {
    width: 84,
  },
  info: {
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 12,
    padding: 10,
    gap: 4,
    alignSelf: 'flex-start',
    maxWidth: '92%',
  },
  texto: {
    color: '#e2e8f0',
    fontSize: 13,
  },
  alerta: {
    color: '#fcd34d',
    fontSize: 13,
  },
})
