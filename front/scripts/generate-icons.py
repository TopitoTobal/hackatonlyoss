from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent.parent / 'public'

FUENTE = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'


def fuente(tamano):
    try:
        return ImageFont.truetype(FUENTE, tamano)
    except OSError:
        return ImageFont.load_default()


def dibujar(tamano=512):
    img = Image.new('RGBA', (tamano, tamano), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    k = tamano / 512
    d.rounded_rectangle(
        [0, 0, tamano - 1, tamano - 1], radius=int(112 * k), fill='#0f172a'
    )
    d.ellipse([136 * k, 110 * k, 376 * k, 350 * k], fill='#7c3aed')

    # Pin blanco con hueco morado.
    d.ellipse([196 * k, 120 * k, 316 * k, 240 * k], fill='#ffffff')
    d.polygon([
        (196 * k, 220 * k),
        (316 * k, 220 * k),
        (256 * k, 340 * k),
    ], fill='#ffffff')
    d.ellipse([222 * k, 168 * k, 290 * k, 236 * k], fill='#7c3aed')

    # Insignia de ayuda.
    d.ellipse(
        [330 * k, 320 * k, 440 * k, 430 * k],
        fill='#b91c1c',
        outline='#ffffff',
        width=int(10 * k),
    )
    f = fuente(int(78 * k))
    texto = '!'
    caja = d.textbbox((0, 0), texto, font=f)
    x = 385 * k - (caja[2] - caja[0]) / 2
    y = 375 * k - (caja[3] - caja[1]) / 2 - caja[1]
    d.text((x, y), texto, font=f, fill='#ffffff')

    return img


principal = dibujar(512)
principal.save(OUT / 'icon-512.png')
for tamano in (192, 180):
    principal.resize((tamano, tamano), Image.Resampling.LANCZOS).save(OUT / f'icon-{tamano}.png')
print('Iconos PWA generados: 192, 180 y 512 px')
