export type Modo = 'vidente' | 'no-vidente'

/* Rutas internas: funcionan en dev y en Netlify sin depender del fallback. */
export const RUTAS: Record<Modo, string> = {
  vidente: '/?modo=vidente',
  'no-vidente': '/?modo=no-vidente',
}

export function modoDeRuta(
  ruta: string | undefined,
  busqueda?: string,
): Modo | null {
  if (busqueda) {
    const modo = new URLSearchParams(busqueda).get('modo')
    if (modo === 'vidente' || modo === 'no-vidente') return modo
  }
  if (!ruta) return null
  if (/^\/vidente(\/|$)/i.test(ruta)) return 'vidente'
  if (/^\/no-vidente(\/|$)/i.test(ruta)) return 'no-vidente'
  return null
}
