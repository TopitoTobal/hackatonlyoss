export type Modo = 'vidente' | 'no-vidente'

export const RUTAS: Record<Modo, string> = {
  vidente: '/vidente/index.html',
  'no-vidente': '/no-vidente/index.html',
}

export function modoDeRuta(ruta: string | undefined): Modo | null {
  if (!ruta) return null
  if (/^\/vidente(\/|$)/i.test(ruta)) return 'vidente'
  if (/^\/no-vidente(\/|$)/i.test(ruta)) return 'no-vidente'
  return null
}
