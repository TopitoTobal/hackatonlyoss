import { useEffect, useRef } from 'react'
import { StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'

import { MAPA_HTML } from './mapa-html'

export type PuntoPlano = { x: number; y: number }

export default function Mapa({ posicion }: { posicion: PuntoPlano }) {
  const webViewRef = useRef<WebView<object> | null>(null)

  function enviar() {
    webViewRef.current?.postMessage(
      JSON.stringify({ type: 'position', ...posicion }),
    )
  }

  useEffect(() => {
    enviar()
  }, [posicion])

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
