import '../backend/src/tasks'

import { StatusBar } from 'expo-status-bar'
import * as Location from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import {
  AccessibilityInfo,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  createSafetyMonitor,
  ensureForegroundPermissions,
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

/* Prototipo: el primer fix GPS preciso se ancla al centro del plano (690, 500).
   Los puntos siguientes son desplazamientos relativos desde ahí, con la misma
   escala de 0,75 m por píxel. No hay georreferenciación absoluta todavía. */
const CENTRO = { x: 690, y: 500 }
const METROS_POR_PIXEL = 0.75

type Origen = { latitude: number; longitude: number }

function aPuntoPlano(
  latitude: number,
  longitude: number,
  origen: Origen,
): PuntoPlano {
  const metrosPorGradoLat = 111_320
  const metrosPorGradoLng =
    111_320 * Math.cos((origen.latitude * Math.PI) / 180)
  const dx = ((longitude - origen.longitude) * metrosPorGradoLng) / METROS_POR_PIXEL
  const dy = (-(latitude - origen.latitude) * metrosPorGradoLat) / METROS_POR_PIXEL
  return { x: CENTRO.x + dx, y: CENTRO.y + dy }
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
function Selector({
  onElegir,
  onPedirGPS,
}: {
  onElegir: (modo: Modo) => void
  onPedirGPS: () => void
}) {
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
        onPress={() => { onPedirGPS(); onElegir('vidente') }}
        style={({ pressed }) => [
          styles.opcion,
          styles.opcionVidente,
          pressed && styles.opcionPresionada,
        ]}
      >
        <Text style={styles.opcionTextoClaro}>Soy vidente</Text>
      </Pressable>

      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Soy no vidente. Abrir mapa con voz automática."
        onPress={() => { onPedirGPS(); onElegir('no-vidente') }}
        style={({ pressed }) => [
          styles.opcion,
          styles.opcionNoVidente,
          pressed && styles.opcionPresionada,
        ]}
      >
        <Text style={styles.opcionTextoOscuro}>Soy no vidente</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={() => hablar(opciones)}
        style={({ pressed }) => [styles.escuchar, pressed && styles.opcionPresionada]}
      >
        <Text style={styles.escucharTexto}>Escuchar las opciones</Text>
      </Pressable>
    </View>
  )
}

export default function App() {
  const trackerRef = useRef<ForegroundTracker | null>(null)
  const monitorRef = useRef<SafetyMonitor | null>(null)

  const [modo, setModo] = useState<Modo | null>(() => modoActual())
  const [punto, setPunto] = useState<PuntoPlano>({
    x: CENTRO.x,
    y: CENTRO.y,
  })
  const [estado, setEstado] = useState('Detenido')
  const [ultimaPosicion, setUltimaPosicion] = useState('—')
  const [estadisticas, setEstadisticas] = useState('—')
  const [alerta, setAlerta] = useState('Sin alertas')
  const [muestras, setMuestras] = useState(0)
  const [velocidad, setVelocidad] = useState('—')
  const arrancandoRef = useRef(false)
  const origenRef = useRef<Origen | null>(null)

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
    origenRef.current = null
    setPunto({ x: CENTRO.x, y: CENTRO.y })

    try {
      const tracker = await startForegroundTracking({
        accuracy: Location.Accuracy.High,
        safetyMonitor: monitorRef.current ?? undefined,
        onError: (mensaje) => setEstado(`Error GPS: ${mensaje}`),
      })

      trackerRef.current = tracker

      tracker.subscribe((muestra) => {
        if (muestra.isAccurate) {
          if (!origenRef.current) {
            origenRef.current = {
              latitude: muestra.latitude,
              longitude: muestra.longitude,
            }
          }
          const plano = aPuntoPlano(
            muestra.latitude,
            muestra.longitude,
            origenRef.current,
          )
          setPunto({
            ...plano,
            latitude: muestra.latitude,
            longitude: muestra.longitude,
            accuracyM: muestra.accuracyM,
          })
        }
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

  async function pedirGPS() {
    const permiso = await ensureForegroundPermissions()
    if (!permiso.ok) setEstado(`Error GPS: ${permiso.message}`)
  }

  function detener() {
    trackerRef.current?.stop()
    trackerRef.current = null
    setEstado('Detenido')
    setMuestras(0)
    setVelocidad('—')
    origenRef.current = null
    setPunto({ x: CENTRO.x, y: CENTRO.y })
  }

  function irAModo(nuevo: Modo) {
    const win: any = globalThis as any
    if (win.history?.pushState) win.history.pushState({}, '', RUTAS[nuevo])
    origenRef.current = null
    setPunto({ x: CENTRO.x, y: CENTRO.y })
    setModo(nuevo)
  }

  function volver() {
    const win: any = globalThis as any
    if (win.history?.pushState) win.history.pushState({}, '', '/')
    setModo(null)
  }

  if (!modo) return <Selector onElegir={irAModo} onPedirGPS={() => void pedirGPS()} />

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
            <Text style={styles.textoBoton}>← Modo</Text>
          </Pressable>
          <Text style={styles.estado} accessibilityLiveRegion="polite">
            {modo === 'vidente' ? 'Vidente' : 'No vidente'} · {estado} · muestras:{' '}
            {muestras}
          </Text>
          <View style={styles.boton}>
            <Button
              title="Activar GPS"
              accessibilityLabel="Activar permiso de ubicación y comenzar a seguir el GPS"
              onPress={() => void iniciar()}
              color="#065f46"
            />
          </View>
          <View style={styles.boton}>
            <Button title="Detener" onPress={detener} color="#991b1b" />
          </View>
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
