import '../backend/src/tasks'

import { MaterialIcons_400Regular } from '@expo-google-fonts/material-icons'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import * as Location from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import {
  AccessibilityInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import Icono from './Icono'

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

import Mapa, { type PuntoPlano } from './Mapa'
import { RUTAS, modoDeRuta, type Modo } from './modo'

const PAREDES: WallSegment[] = []
const CAMINO: RoutePath = { id: 'demo', points: [] }

/* El plano del mapa mide 1312x985 px y su centro es (690, 500).
   La referencia geográfica del centro es el campus (20.67, -103.35).
   TODO: sustituir por una georreferenciación real del plano. */
const PLANO = { centroX: 690, centroY: 500 }
const REFERENCIA = { latitude: 20.67, longitude: -103.35 }
const METROS_POR_PIXEL = 0.75

function aPuntoPlano(latitude: number, longitude: number): PuntoPlano {
  const metrosPorGradoLat = 111_320
  const metrosPorGradoLng =
    111_320 * Math.cos((REFERENCIA.latitude * Math.PI) / 180)
  const dx = ((longitude - REFERENCIA.longitude) * metrosPorGradoLng) / METROS_POR_PIXEL
  const dy = (-(latitude - REFERENCIA.latitude) * metrosPorGradoLat) / METROS_POR_PIXEL
  return { x: PLANO.centroX + dx, y: PLANO.centroY + dy }
}

function rutaActual(): string | undefined {
  return (globalThis as any).location?.pathname as string | undefined
}

function busquedaActual(): string | undefined {
  return (globalThis as any).location?.search as string | undefined
}

function modoActual(): Modo | null {
  return modoDeRuta(rutaActual(), busquedaActual())
}

/* Voz en web y aviso para lectores de pantalla en todas las plataformas. */
function hablar(texto: string) {
  AccessibilityInfo.announceForAccessibility(texto)
  try {
    const win: any = globalThis as any
    const Synth = win.SpeechSynthesisUtterance
    if (win.speechSynthesis && typeof Synth === 'function') {
      const u = new Synth(texto)
      u.lang = 'es-CL'
      win.speechSynthesis.cancel()
      win.speechSynthesis.speak(u)
    }
  } catch (e) {}
}

/* Portada equivalente a index (4).html: elige vidente / no vidente antes
   de pedir permisos de GPS o cargar el mapa. */
function Selector({ onElegir }: { onElegir: (modo: Modo) => void }) {
  const opciones =
    '¿Eres una persona vidente o no vidente? Primera opción: Soy vidente. Segunda opción: Soy no vidente.'

  return (
    <View style={styles.selector} accessibilityRole="main">
      <StatusBar style="dark" />
      <Text style={styles.selectorEyebrow}>Campus Casa Central · UTFSM</Text>
      <Text accessibilityRole="header" style={styles.selectorTitulo}>
        ¿Eres una persona vidente o no vidente?
      </Text>

      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Soy vidente. Abrir mapa visual."
        onPress={() => onElegir('vidente')}
        style={({ pressed }) => [
          styles.opcion,
          styles.opcionVidente,
          pressed && styles.opcionPresionada,
        ]}
      >
        <View style={styles.filaBoton}>
          <Icono name="visibility" size={30} color="#ffffff" />
          <Text style={styles.opcionTextoClaro}>Soy vidente</Text>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Soy no vidente. Abrir mapa con voz automática."
        onPress={() => onElegir('no-vidente')}
        style={({ pressed }) => [
          styles.opcion,
          styles.opcionNoVidente,
          pressed && styles.opcionPresionada,
        ]}
      >
        <View style={styles.filaBoton}>
          <Icono name="visibility_off" size={30} color="#000000" />
          <Text style={styles.opcionTextoOscuro}>Soy no vidente</Text>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={() => hablar(opciones)}
        style={({ pressed }) => [styles.escuchar, pressed && styles.opcionPresionada]}
      >
        <View style={styles.filaBoton}>
          <Icono name="volume_up" size={24} color="#000000" />
          <Text style={styles.escucharTexto}>Escuchar las opciones</Text>
        </View>
      </Pressable>
    </View>
  )
}

export default function App() {
  /* Iconos de Material Icons (Google Fonts) listos antes de mostrar la UI. */
  const [fuentesListas] = useFonts({ MaterialIcons: MaterialIcons_400Regular })

  const trackerRef = useRef<ForegroundTracker | null>(null)
  const monitorRef = useRef<SafetyMonitor | null>(null)

  const [modo, setModo] = useState<Modo | null>(() => modoActual())
  const [punto, setPunto] = useState<PuntoPlano>({
    x: PLANO.centroX,
    y: PLANO.centroY,
  })
  const [estado, setEstado] = useState('Detenido')
  const [ultimaPosicion, setUltimaPosicion] = useState('—')
  const [estadisticas, setEstadisticas] = useState('—')
  const [alerta, setAlerta] = useState('Sin alertas')
  const [muestras, setMuestras] = useState(0)
  const [velocidad, setVelocidad] = useState('—')
  const arrancandoRef = useRef(false)

  useEffect(() => {
    const win: any = globalThis as any
    if (!win.addEventListener) return
    const alCambiar = () => setModo(modoActual())
    win.addEventListener('popstate', alCambiar)
    return () => win.removeEventListener('popstate', alCambiar)
  }, [])

  useEffect(() => {
    /* La portada no pide GPS: solo se sigue la ubicación cuando ya elegimos modo. */
    if (!modo) return

    monitorRef.current = createSafetyMonitor({
      walls: PAREDES,
      routes: [CAMINO],
      activeRouteId: CAMINO.id,
    })

    const omitirAlerta = safetyAlerts.subscribe((nueva: SafetyAlert) => {
      setAlerta(nueva.text)
    })

    void iniciar(true)

    return () => {
      omitirAlerta()
      trackerRef.current?.stop()
      trackerRef.current = null
    }
  }, [modo])

  async function iniciar(auto = false) {
    if (trackerRef.current || arrancandoRef.current) return

    arrancandoRef.current = true
    setEstado('Solicitando permisos…')
    setMuestras(0)

    try {
      const tracker = await startForegroundTracking({
        accuracy: Location.Accuracy.High,
        safetyMonitor: monitorRef.current ?? undefined,
        onError: (mensaje) => setEstado(`Error GPS: ${mensaje}`),
      })

      trackerRef.current = tracker

      tracker.subscribe((muestra) => {
        setPunto(aPuntoPlano(muestra.latitude, muestra.longitude))
        setVelocidad(formatSpeed(muestra.computedSpeedMps))
        setUltimaPosicion(
          `${muestra.latitude.toFixed(5)}, ${muestra.longitude.toFixed(5)} · ±${muestra.accuracyM?.toFixed(0) ?? '?'} m${muestra.isAccurate ? '' : ' (baja precisión)'}`,
        )
        setEstadisticas(movementStatsToText(tracker.getStats()))
        setMuestras((total) => total + 1)
      })

      setEstado(auto ? 'Siguiendo ubicación (auto)' : 'Siguiendo ubicación')
    } catch (error) {
      setEstado(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      )
    } finally {
      arrancandoRef.current = false
    }
  }

  function detener() {
    trackerRef.current?.stop()
    trackerRef.current = null
    setEstado('Detenido')
    setMuestras(0)
    setVelocidad('—')
  }

  function irAModo(nuevo: Modo) {
    const win: any = globalThis as any
    if (win.history?.pushState) win.history.pushState({}, '', RUTAS[nuevo])
    setPunto({ x: PLANO.centroX, y: PLANO.centroY })
    setModo(nuevo)
  }

  function volver() {
    const win: any = globalThis as any
    if (win.history?.pushState) win.history.pushState({}, '', '/')
    setModo(null)
  }

  if (!fuentesListas) {
    return (
      <View style={styles.carga} accessibilityRole="main">
        <Text style={styles.texto}>Cargando…</Text>
      </View>
    )
  }

  if (!modo) return <Selector onElegir={irAModo} />

  return (
    <View style={styles.contenedor} accessibilityRole="main">
      <StatusBar style="dark" />

      <Mapa posicion={punto} modo={modo} />

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.barra}>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Volver a elegir modo"
            onPress={volver}
            style={styles.botonVolver}
          >
            <View style={styles.filaBoton}>
              <Icono name="arrow_back" size={18} color="#f8fafc" />
              <Text style={styles.textoBoton}>Modo</Text>
            </View>
          </Pressable>
          <Text style={styles.estado} accessibilityLiveRegion="polite">
            {modo === 'vidente' ? 'Vidente' : 'No vidente'} · {estado} · muestras:{' '}
            {muestras}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Iniciar GPS"
            onPress={() => void iniciar()}
            style={({ pressed }) => [
              styles.botonAccion,
              styles.botonGps,
              pressed && styles.opcionPresionada,
            ]}
          >
            <View style={styles.filaBoton}>
              <Icono name="location_on" size={18} color="#ffffff" />
              <Text style={styles.textoBotonAccion}>GPS</Text>
            </View>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Detener seguimiento"
            onPress={detener}
            style={({ pressed }) => [
              styles.botonAccion,
              styles.botonDetener,
              pressed && styles.opcionPresionada,
            ]}
          >
            <View style={styles.filaBoton}>
              <Icono name="stop" size={18} color="#ffffff" />
              <Text style={styles.textoBotonAccion}>Detener</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.info}>
          <Text style={styles.texto} numberOfLines={2}>
            Velocidad: {velocidad}
          </Text>
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
  selector: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    paddingTop: 56,
    paddingBottom: 32,
    gap: 12,
    justifyContent: 'center',
  },
  selectorEyebrow: {
    color: '#0369a1',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  selectorTitulo: {
    color: '#000000',
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  opcion: {
    minHeight: 128,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  opcionVidente: { backgroundColor: '#1e3a8a' },
  opcionNoVidente: { backgroundColor: '#facc15' },
  opcionPresionada: { opacity: 0.75 },
  opcionTextoClaro: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  opcionTextoOscuro: {
    color: '#000000',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  escuchar: {
    minHeight: 64,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  escucharTexto: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  contenedor: {
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
    flexWrap: 'wrap',
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
  botonVolver: {
    minHeight: 40,
    minWidth: 84,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  textoBoton: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  carga: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filaBoton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  botonAccion: {
    minHeight: 40,
    minWidth: 84,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  botonGps: { backgroundColor: '#065f46' },
  botonDetener: { backgroundColor: '#991b1b' },
  textoBotonAccion: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
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
