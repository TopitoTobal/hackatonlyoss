import { useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'

import { MAPA_HTML } from './mapa-html'
import type { Modo } from './modo'
import type { PuntoPlano } from './Mapa'

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
  const hostRef = useRef<any>(null)
  const iframeRef = useRef<any>(null)

  useEffect(() => {
    const doc = (globalThis as any).document
    const host = hostRef.current as any
    if (!doc || !host) return

    const iframe = doc.createElement('iframe')
    iframe.title = 'Mapa de movilización'
    iframe.setAttribute('style', 'width:100%;height:100%;border:0;')
    iframe.srcdoc = MAPA_HTML
    host.appendChild(iframe)
    iframeRef.current = iframe

    const alCargar = () => enviar(iframe, posicion, modo, ayuda)
    iframe.addEventListener('load', alCargar)

    const alMensaje = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return
      try {
        const dato = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (dato?.type === 'interior' && typeof dato.activo === 'boolean') {
          onInterior?.(dato.activo)
        }
      } catch {}
    }
    doc.addEventListener('message', alMensaje as EventListener)

    return () => {
      doc.removeEventListener('message', alMensaje as EventListener)
      iframe.removeEventListener('load', alCargar)
      iframe.remove()
      iframeRef.current = null
    }
    // El iframe se crea una sola vez; los cambios de posición van en el otro effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (iframeRef.current) enviar(iframeRef.current, posicion, modo, ayuda)
  }, [posicion, modo, ayuda])

  useEffect(() => {
    if (salirSenal > 0 && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ type: 'salirInterior' }),
        '*',
      )
    }
  }, [salirSenal])

  return <View ref={hostRef} style={styles.mapa} />
}

function enviar(iframe: any, posicion: PuntoPlano, modo: Modo, ayuda: boolean) {
  const win = iframe.contentWindow
  if (!win) return
  win.postMessage(JSON.stringify({ type: 'modo', modo }), '*')
  win.postMessage(JSON.stringify({ type: 'position', ...posicion }), '*')
  win.postMessage(JSON.stringify({ type: 'ayuda', activo: ayuda }), '*')
}

const styles = StyleSheet.create({
  mapa: {
    flex: 1,
    backgroundColor: '#e2e8f0',
  },
})
