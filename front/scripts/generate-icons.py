"""Genera los íconos PWA con la foto del app y el logo «Orienta».

Usa front/public/splash-foto.webp (o .png/.jpg/.jpeg). Si no hay foto,
dibuja un pin de respaldo para que el build nunca falle.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

OUT = Path(__file__).resolve().parent.parent / 'public'
FUENTE = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
COLORES = ['#f59e0b', '#b91c1c', '#1d4ed8']  # amarillo, rojo, azul
BLANCO = '#ffffff'
GRIS = '#64748b'


def fuente(tamano):
    try:
        return ImageFont.truetype(FUENTE, tamano)
    except OSError:
        return ImageFont.load_default()


def buscar_foto():
    for extension in ('.webp', '.png', '.jpg', '.jpeg'):
        ruta = OUT / ('splash-foto' + extension)
        if ruta.exists():
            return ruta
    return None


def dibujar(tamano=512):
    img = Image.new('RGB', (tamano, tamano), BLANCO)
    d = ImageDraw.Draw(img)
    k = tamano / 512

    # Foto centrada en la mitad superior, con bordes redondeados.
    caja_w = int(360 * k)
    caja_h = int(250 * k)
    caja = Image.new('RGBA', (caja_w, caja_h), (0, 0, 0, 0))
    ruta = buscar_foto()
    if ruta:
        try:
            foto = Image.open(ruta).convert('RGBA')
            contenido = ImageOps.contain(foto, (caja_w, caja_h), Image.Resampling.LANCZOS)
            caja.alpha_composite(
                contenido,
                ((caja_w - contenido.width) // 2, (caja_h - contenido.height) // 2),
            )
        except Exception:
            ruta = None
    if not ruta:
        pin = ImageDraw.Draw(caja)
        cx, cy = caja_w // 2, caja_h // 2
        r = min(cx, cy) - int(12 * k)
        pin.ellipse([cx - r, cy - r, cx + r, cy + r], fill='#7c3aed')
        pin.ellipse([cx - r // 2, cy - r, cx + r // 2, cy], fill=BLANCO)
        pin.polygon(
            [(cx - r // 2, cy - r // 4), (cx + r // 2, cy - r // 4), (cx, cy + r)],
            fill=BLANCO,
        )
    # Fondo blanco debajo de la foto para evitar el filete negro al enmascarar.
    caja = Image.alpha_composite(
        Image.new('RGBA', (caja_w, caja_h), (255, 255, 255, 255)), caja
    )
    mask = Image.new('L', (caja_w, caja_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, caja_w - 1, caja_h - 1], radius=int(36 * k), fill=255
    )
    caja.putalpha(mask)
    img.paste(caja, ((tamano - caja_w) // 2, int(40 * k)), caja)

    # Palabra Orienta con letras amarillo/rojo/azul.
    palabra = 'Orienta'
    tamano_fuente = int(66 * k)
    font = fuente(tamano_fuente)
    espaciado = int(3 * k)
    anchos = [d.textbbox((0, 0), letra, font=font)[2] for letra in palabra]
    total = sum(anchos) + espaciado * (len(palabra) - 1)
    x = (tamano - total) // 2
    y = int(322 * k)
    for i, letra in enumerate(palabra):
        d.text((x, y), letra, font=font, fill=COLORES[i % len(COLORES)])
        x += anchos[i] + espaciado

    sub = 'UTFSM'
    font_sub = fuente(int(24 * k))
    caja_sub = d.textbbox((0, 0), sub, font=font_sub)
    sx = (tamano - (caja_sub[2] - caja_sub[0])) // 2
    d.text((sx, int(440 * k)), sub, font=font_sub, fill=GRIS)
    return img


principal = dibujar(512)
principal.save(OUT / 'icon-512.png')
for tamano in (192, 180):
    principal.resize((tamano, tamano), Image.Resampling.LANCZOS).save(OUT / f'icon-{tamano}.png')
print('Íconos PWA generados con foto y logo Orienta: 192, 180 y 512 px')
print('Foto:', buscar_foto() or 'pin de respaldo')
