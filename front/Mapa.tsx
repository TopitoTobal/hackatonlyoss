import { useEffect, useRef } from 'react'
import { StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'

import { MAPA_HTML } from './mapa-html'
import type { Modo } from './modo'

export type PuntoPlano = {
  x: number
  y: number
  latitude?: number
  longitude?: number
  accuracyM?: number | null
}

export default function Mapa({
  posicion,
  modo,
  ayuda = false,
  salirSenal = 0,
  onInterior,
}: {
  posicion: PuntoPlano
  modo: Modo
  ayuda?: boolean
  salirSenal?: number
  onInterior?: (activo: boolean) => void
}) {
  const webViewRef = useRef<WebView<object> | null>(null)

  function enviar() {
    const web = webViewRef.current
    if (!web) return
    web.postMessage(JSON.stringify({ type: 'modo', modo }))
    web.postMessage(JSON.stringify({ type: 'position', ...posicion }))
    web.postMessage(JSON.stringify({ type: 'ayuda', activo: ayuda }))
  }

  useEffect(() => {
    enviar()
  }, [posicion, modo, ayuda])

  useEffect(() => {
    if (salirSenal > 0 && webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ type: 'salirInterior' }))
    }
  }, [salirSenal])

  return (
    <WebView<object>
      ref={webViewRef}
      source={{ html: MAPA_HTML }}
      style={styles.mapa}
      originWhitelist={['*']}
      javaScriptEnabled
      onLoadEnd={enviar}
      onMessage={(event) => {
        try {
          const dato = JSON.parse(event.nativeEvent.data)
          if (dato?.type === 'interior' && typeof dato.activo === 'boolean') {
            onInterior?.(dato.activo)
          }
        } catch {}
      }}
    />
  )
}

const styles = StyleSheet.create({
  mapa: {
    flex: 1,
    backgroundColor: '#e2e8f0',
  },
})
