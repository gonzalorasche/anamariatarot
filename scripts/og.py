"""Genera la imagen que se ve al compartir el link (1200x630).

La anterior era cuadrada de 2250px y WhatsApp, Facebook y X la recortaban mal.

    python scripts/og.py
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
FONDO = RAIZ / "public" / "img" / "manto.png"
LOGO = RAIZ / "public" / "img" / "logo.png"
SALIDA = RAIZ / "public" / "img" / "og.png"

W, H = 1200, 630
HUESO = (244, 239, 230)
ORO = (201, 164, 86)


def fuente(nombre, tam):
    return ImageFont.truetype(f"C:/Windows/Fonts/{nombre}", tam)


def main():
    # el manto recortado al formato apaisado, oscurecido para que lea el texto
    fondo = Image.open(FONDO).convert("RGB")
    escala = max(W / fondo.width, H / fondo.height)
    fondo = fondo.resize((round(fondo.width * escala), round(fondo.height * escala)),
                         Image.LANCZOS)
    izq = (fondo.width - W) // 2
    arr = (fondo.height - H) // 2
    img = fondo.crop((izq, arr, izq + W, arr + H))
    img = ImageEnhance.Brightness(img).enhance(0.42)

    # viñeta suave hacia la izquierda, donde va el texto
    velo = Image.new("L", (W, H), 0)
    d_velo = ImageDraw.Draw(velo)
    for x in range(W):
        d_velo.line([(x, 0), (x, H)], fill=int(190 * max(0, 1 - x / (W * 0.78))))
    img = Image.composite(Image.new("RGB", (W, H), (10, 8, 5)), img, velo)

    d = ImageDraw.Draw(img)

    # el logo blanco entra tal cual sobre el fondo oscuro
    logo = Image.open(LOGO).convert("RGBA")
    alto_logo = 54
    logo = logo.resize((round(logo.width * alto_logo / logo.height), alto_logo),
                       Image.LANCZOS)
    img.paste(logo, (80, 76), logo)

    d.text((80, 210), "Nada se revela", font=fuente("georgia.ttf", 76), fill=HUESO)
    d.text((80, 300), "sin intención.", font=fuente("georgiai.ttf", 76), fill=ORO)

    d.line([(82, 424), (182, 424)], fill=ORO, width=2)

    d.text((80, 456), "LECTURAS DE TAROT · SESIONES POR VIDEOLLAMADA",
           font=fuente("segoeuib.ttf", 21), fill=(206, 197, 182))
    d.text((80, 496), "Más de treinta años de estudio y práctica",
           font=fuente("segoeui.ttf", 24), fill=(171, 162, 148))

    img.save(SALIDA, optimize=True)
    print(f"{SALIDA.relative_to(RAIZ)}  ({W}x{H})  {SALIDA.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
