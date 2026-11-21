"""Genera los splash de la PWA con fondo blanco y la palabra Orienta en
amarillo, rojo y azul.

Si hay una foto en front/public/splash-foto.webp (o .png/.jpg) la usa en el
centro. Si no, dibuja un pin de respaldo para que el build nunca falle.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

PUBLIC = Path(__file__).resolve().parent.parent / 'public'
FUENTE = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
COLORES = ['#f59e0b', '#b91c1c', '#1d4ed8']  # amarillo, rojo, azul
BLANCO = '#ffffff'
GRIS = '#64748b'

TAMANOS = [
    (1242, 2688),  # iPhone 6.7"
    (1284, 2778),  # iPhone 6.7"/6.8"
    (1290, 2796),  # iPhone 6.9"
    (1080, 1920),  # Android / native
]


def fuente(tamano):
    try:
        return ImageFont.truetype(FUENTE, tamano)
    except OSError:
        return ImageFont.load_default()


def buscar_foto():
    for extension in ('.webp', '.png', '.jpg', '.jpeg'):
        ruta = PUBLIC / ('splash-foto' + extension)
        if ruta.exists():
            return ruta
    return None


def foto_contenida(canvas_w, canvas_h):
    foto = None
    ruta = buscar_foto()
    if ruta:
        try:
            foto = Image.open(ruta).convert('RGBA')
        except Exception:
            foto = None

    caja_w = int(canvas_w * 0.78)
    caja_h = int(canvas_h * 0.46)
    caja = Image.new('RGBA', (caja_w, caja_h), (0, 0, 0, 0))

    if foto:
        contenido = ImageOps.contain(foto, (caja_w, caja_h), Image.Resampling.LANCZOS)
        x = (caja_w - contenido.width) // 2
        y = (caja_h - contenido.height) // 2
        caja.alpha_composite(contenido, (x, y))
    else:
        d = ImageDraw.Draw(caja)
        cx, cy = caja_w // 2, caja_h // 2
        r = int(min(caja_w, caja_h) * 0.28)
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill='#7c3aed')
        d.ellipse([cx - r // 2, cy - r, cx + r // 2, cy], fill=BLANCO)
        d.polygon([(cx - r // 2, cy - r // 4), (cx + r // 2, cy - r // 4),
                   (cx, cy + r)], fill=BLANCO)

    # Bordes redondeados para que no corte el fondo blanco.
    radio = int(caja_w * 0.06)
    mask = Image.new('L', (caja_w, caja_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, caja_w - 1, caja_h - 1], radius=radio, fill=255
    )
    caja.putalpha(mask)
    return caja


def dibujar(ancho, alto):
    img = Image.new('RGB', (ancho, alto), BLANCO)
    d = ImageDraw.Draw(img)

    foto = foto_contenida(ancho, alto)
    fx = (ancho - foto.width) // 2
    fy = int(alto * 0.17)
    img.paste(foto, (fx, fy), foto)

    palabra = 'Orienta'
    tamano = int(ancho * 0.135)
    font = fuente(tamano)
    espaciado = int(tamano * 0.04)
    anchos = [d.textbbox((0, 0), letra, font=font)[2] for letra in palabra]
    total = sum(anchos) + espaciado * (len(palabra) - 1)
    x = (ancho - total) // 2
    y = int(alto * 0.76)
    for i, letra in enumerate(palabra):
        d.text((x, y), letra, font=font, fill=COLORES[i % len(COLORES)])
        x += anchos[i] + espaciado

    sub = 'Campus accesible · UTFSM'
    font_sub = fuente(int(ancho * 0.032))
    caja = d.textbbox((0, 0), sub, font=font_sub)
    sx = (ancho - (caja[2] - caja[0])) // 2
    d.text((sx, int(alto * 0.855)), sub, font=font_sub, fill=GRIS)
    return img


for ancho, alto in TAMANOS:
    dibujar(ancho, alto).save(PUBLIC / f'splash-{ancho}x{alto}.png')

fuente_usada = buscar_foto()
print('Splash generados:', ', '.join(f'{a}x{b}' for a, b in TAMANOS))
print('Foto:', fuente_usada if fuente_usada else 'pin de respaldo (sin splash-foto.*)')
