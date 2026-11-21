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
}: {
  posicion: PuntoPlano
  modo: Modo
  ayuda?: boolean
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

  return (
    <WebView<object>
      ref={webViewRef}
      source={{ html: MAPA_HTML }}
      style={styles.mapa}
      originWhitelist={['*']}
      javaScriptEnabled
      onLoadEnd={enviar}
    />
  )
}

const styles = StyleSheet.create({
  mapa: {
    flex: 1,
    backgroundColor: '#e2e8f0',
  },
})
