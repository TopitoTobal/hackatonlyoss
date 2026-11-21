import '../backend/src/tasks'

import { MaterialIcons_400Regular } from '@expo-google-fonts/material-icons'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import * as Location from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import {
  AccessibilityInfo,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import Icono from './Icono'

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
        <View style={styles.filaOpcion}>
          <View style={styles.iconoVidente}>
            <Icono name="visibility" size={26} color="#1d4ed8" />
          </View>
          <View style={styles.opcionContenido}>
            <Text style={styles.opcionTexto}>Soy vidente</Text>
            <Text style={styles.opcionDetalle}>Mapa visual con GPS y rutas</Text>
          </View>
        </View>
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
        <View style={styles.filaOpcion}>
          <View style={styles.iconoNoVidente}>
            <Icono name="visibility_off" size={26} color="#92400e" />
          </View>
          <View style={styles.opcionContenido}>
            <Text style={styles.opcionTexto}>Soy no vidente</Text>
            <Text style={styles.opcionDetalle}>Mapa con voz y alertas</Text>
          </View>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={() => hablar(opciones)}
        style={({ pressed }) => [styles.escuchar, pressed && styles.opcionPresionada]}
      >
        <View style={styles.filaOpcion}>
          <View style={styles.iconoEscuchar}>
            <Icono name="volume_up" size={22} color="#1d4ed8" />
          </View>
          <Text style={styles.escucharTexto}>Escuchar las opciones</Text>
        </View>
      </Pressable>

      <InstalarWeb />
    </View>
  )
}

/* Instalación como app web (PWA). En Chrome/Android usamos el prompt nativo;
   en iOS Safari mostramos las instrucciones de “Agregar a pantalla de inicio”. */
function InstalarWeb() {
  const [evento, setEvento] = useState<any>(null)
  const [instrucciones, setInstrucciones] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.addEventListener) return
    const alAntes = (e: Event) => {
      e.preventDefault()
      setEvento(e)
    }
    window.addEventListener('beforeinstallprompt', alAntes)
    return () => window.removeEventListener('beforeinstallprompt', alAntes)
  }, [])

  if (typeof document === 'undefined') return null

  const esIOS =
    typeof navigator !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent)

  async function instalar() {
    if (evento && typeof evento.prompt === 'function') {
      await evento.prompt()
      setEvento(null)
      return
    }
    setInstrucciones(true)
  }

  return (
    <View style={styles.instalar}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Instalar la app web en la pantalla de inicio"
        onPress={() => void instalar()}
        style={({ pressed }) => [
          styles.instalarBoton,
          pressed && styles.opcionPresionada,
        ]}
      >
        <Text style={styles.instalarTexto}>
          {evento ? 'Instalar app' : esIOS ? 'Cómo instalar en iPhone' : 'Instalar app web'}
        </Text>
      </Pressable>
      {instrucciones && (
        <Text style={styles.instalarAyuda} accessibilityLiveRegion="polite">
          En Safari, toca Compartir → Agregar a pantalla de inicio. Luego ábrela
          desde la pantalla de inicio: funciona como una app, sin APK.
        </Text>
      )}
    </View>
  )
}

/* Splash dentro de la app: el splash nativo del SO queda guardado al instalar
   la PWA, así que una versión ya instalada no verá los cambios. Este overlay
   usa el mismo PNG y se muestra siempre al abrir, en web y en nativo. */
function Splash() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const temporizador = setTimeout(() => setVisible(false), 1800)
    return () => clearTimeout(temporizador)
  }, [])
  if (!visible || typeof document === 'undefined') return null
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Continuar a la app"
      onPress={() => setVisible(false)}
      style={styles.splash}
    >
      <Image
        source={{ uri: '/splash-1080x1920.png?v=5' }}
        style={styles.splashImagen}
        resizeMode="contain"
      />
    </Pressable>
  )
}

export default function App() {
  /* Iconos de Material Icons (Google Fonts) listos antes de mostrar la UI. */
  const [fuentesListas] = useFonts({ MaterialIcons: MaterialIcons_400Regular })

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
  const [pidiendoAyuda, setPidiendoAyuda] = useState(false)
  const [infoAbierta, setInfoAbierta] = useState(false)
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
    setPidiendoAyuda(false)
  }

  function irAModo(nuevo: Modo) {
    const win: any = globalThis as any
    if (win.history?.pushState) win.history.pushState({}, '', RUTAS[nuevo])
    origenRef.current = null
    setPunto({ x: CENTRO.x, y: CENTRO.y })
    setPidiendoAyuda(false)
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

  return (
    <View style={styles.raiz}>
      <Splash />
      {!modo ? (
        <Selector onElegir={irAModo} onPedirGPS={() => void pedirGPS()} />
      ) : (
        <View style={styles.contenedor} accessibilityRole="main">
          <StatusBar style="dark" />

      <Mapa posicion={punto} modo={modo} ayuda={pidiendoAyuda} />

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.barra}>
          <View style={styles.barraBotones}>
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
          {modo === 'no-vidente' && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                pidiendoAyuda
                  ? 'Cancelar petición de ayuda a las personas videntes'
                  : 'Pedir ayuda: avisar a las personas videntes de que necesito ayuda'
              }
              onPress={() => setPidiendoAyuda((activo) => !activo)}
              style={({ pressed }) => [
                styles.botonAccion,
                pidiendoAyuda ? styles.botonAyudaActivo : styles.botonAyuda,
                pressed && styles.opcionPresionada,
              ]}
            >
              <View style={styles.filaBoton}>
                <Icono name="help" size={18} color="#ffffff" />
                <Text style={styles.textoBotonAccion}>
                  {pidiendoAyuda ? 'Cancelar ayuda' : 'Pedir ayuda'}
                </Text>
              </View>
            </Pressable>
          )}
        </View>

        <View style={styles.info}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              infoAbierta
                ? 'Ocultar información detallada de GPS'
                : 'Mostrar información detallada de GPS: muestra, posición y estadísticas'
            }
            accessibilityState={{ expanded: infoAbierta }}
            onPress={() => setInfoAbierta((abierta) => !abierta)}
            style={({ pressed }) => [
              styles.infoBoton,
              pressed && styles.opcionPresionada,
            ]}
          >
            <View style={styles.iconoInfo}>
              <Icono name="info" size={20} color="#1d4ed8" />
            </View>
            <Text style={styles.infoTitulo}>Información</Text>
            <Text style={styles.infoValor}>{velocidad}</Text>
            <Icono
              name={infoAbierta ? 'expand_less' : 'expand_more'}
              size={20}
              color="#64748b"
            />
          </Pressable>

          {alerta ? (
            <Text style={styles.alerta} accessibilityLiveRegion="polite">
              {alerta}
            </Text>
          ) : null}
          {modo === 'no-vidente' && pidiendoAyuda && (
            <Text style={styles.alerta} accessibilityLiveRegion="assertive">
              Petición de ayuda activa: los videntes pueden verte.
            </Text>
          )}

          {infoAbierta && (
            <View style={styles.infoDetalle}>
              <Text style={styles.texto} numberOfLines={2}>
                Velocidad: {velocidad}
              </Text>
              <Text style={styles.texto} numberOfLines={2}>
                Muestras: {muestras}
              </Text>
              <Text style={styles.texto} numberOfLines={2}>
                {ultimaPosicion}
              </Text>
              <Text style={styles.texto} numberOfLines={2}>
                {estadisticas}
              </Text>
              {modo === 'no-vidente' && (
                <Text style={styles.texto} accessibilityLiveRegion="assertive">
                  {pidiendoAyuda
                    ? 'Petición de ayuda activa: los videntes pueden verte.'
                    : 'Sin petición de ayuda.'}
                </Text>
              )}
            </View>
          )}
          </View>
        </View>
        </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  raiz: {
    flex: 1,
  },
  splash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  splashImagen: {
    width: '100%',
    height: '100%',
  },
  instalar: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd2d9',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  instalarBoton: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2a91d1',
    backgroundColor: '#e8f1fb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instalarTexto: {
    color: '#1d4ed8',
    fontSize: 14,
    fontWeight: '600',
  },
  instalarAyuda: {
    color: '#4b5563',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 320,
  },
  selector: {
    flex: 1,
    backgroundColor: '#eff0f1',
    padding: 18,
    paddingTop: 56,
    paddingBottom: 32,
    gap: 10,
    justifyContent: 'center',
  },
  selectorEyebrow: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.8,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  selectorTitulo: {
    color: '#1c1c1c',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  opcion: {
    minHeight: 96,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd2d9',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    padding: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  opcionVidente: { borderLeftWidth: 4, borderLeftColor: '#2a91d1' },
  opcionNoVidente: { borderLeftWidth: 4, borderLeftColor: '#f59e0b' },
  opcionPresionada: { opacity: 0.7 },
  filaOpcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  opcionContenido: { flex: 1 },
  iconoVidente: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#e8f1fb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconoNoVidente: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconoEscuchar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#e8f1fb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  opcionTexto: {
    color: '#1c1c1c',
    fontSize: 21,
    fontWeight: '700',
  },
  opcionDetalle: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 2,
  },
  escuchar: {
    minHeight: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd2d9',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    paddingHorizontal: 14,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  escucharTexto: {
    color: '#1c1c1c',
    fontSize: 16,
    fontWeight: '600',
  },
  contenedor: {
    flex: 1,
    backgroundColor: '#eff0f1',
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
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderColor: '#cbd2d9',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  barraBotones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  estado: {
    color: '#1c1c1c',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  botonVolver: {
    minHeight: 36,
    minWidth: 84,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2a91d1',
    backgroundColor: '#e8f1fb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  textoBoton: {
    color: '#1d4ed8',
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
    minHeight: 36,
    minWidth: 84,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  botonGps: { backgroundColor: '#065f46', borderColor: '#065f46' },
  botonDetener: { backgroundColor: '#991b1b', borderColor: '#991b1b' },
  botonAyuda: { backgroundColor: '#6d28d9', borderColor: '#6d28d9' },
  botonAyudaActivo: { backgroundColor: '#4c1d95', borderColor: '#4c1d95' },
  textoBotonAccion: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  info: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 6,
    gap: 6,
  },
  infoBoton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd2d9',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  iconoInfo: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#e8f1fb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitulo: {
    color: '#1c1c1c',
    fontSize: 13,
    fontWeight: '700',
  },
  infoValor: {
    color: '#1d4ed8',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  infoDetalle: {
    gap: 4,
    paddingTop: 2,
  },
  texto: {
    color: '#334155',
    fontSize: 13,
  },
  alerta: {
    color: '#b45309',
    fontSize: 13,
  },
})
