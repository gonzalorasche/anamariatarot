"""Genera el PNG del tarifario para tener a mano.

Lee los precios de src/data/consultas.ts, así la imagen nunca se desincroniza
de la web: si cambia un valor allá, se vuelve a correr esto y listo.

    python scripts/tarifario.py
"""

import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
DATOS = RAIZ / "src" / "data" / "consultas.ts"
SALIDA = RAIZ / "tarifario-ana-maria.png"

# paleta de la web
HUESO = (244, 239, 230)
PAPEL = (255, 253, 248)
TINTA = (23, 19, 13)
SUAVE = (91, 83, 74)
TENUE = (141, 132, 121)
ORO = (154, 123, 69)
LINEA = (219, 211, 198)

W = 1080
SENA = 0.30


def fuente(nombre, tam):
    return ImageFont.truetype(f"C:/Windows/Fonts/{nombre}", tam)


F_TITULO = fuente("georgiab.ttf", 68)
F_SERVICIO = fuente("georgia.ttf", 40)
F_PRECIO = fuente("georgiab.ttf", 33)
F_SENA = fuente("georgia.ttf", 29)
F_ETIQUETA = fuente("segoeuib.ttf", 20)
F_TEXTO = fuente("segoeui.ttf", 23)
F_CHICA = fuente("segoeui.ttf", 21)


def leer_servicios():
    """Saca título, precios y nota de cada servicio del archivo de datos."""
    ts = DATOS.read_text(encoding="utf-8")

    vigencia = re.search(r'VIGENCIA = "([^"]+)"', ts).group(1)

    servicios = []
    for bloque in re.findall(r"\{\s*id: \"(.+?)\n  \},", ts, re.S):
        titulo = re.search(r'titulo: "([^"]+)"', bloque).group(1)
        filas = re.findall(r'\{ t: "([^"]+)", p: "\$ ([\d.]+)" \}', bloque)
        nota = re.search(r'nota: "([^"]+)"', bloque)
        servicios.append(
            {
                "titulo": titulo,
                "filas": [(t, int(p.replace(".", ""))) for t, p in filas],
                "nota": nota.group(1) if nota else None,
            }
        )

    condiciones = re.findall(r'^  "(.+?)",$', ts, re.M)
    return vigencia, servicios, condiciones


def pesos(n):
    return "$ " + f"{n:,}".replace(",", ".")


def main():
    vigencia, servicios, condiciones = leer_servicios()

    # alto necesario: cabecera + cada servicio + condiciones
    alto = 300
    for s in servicios:
        alto += 86 + len(s["filas"]) * 72 + (46 if s["nota"] else 0) + 46
    alto += 70 + len(condiciones) * 44 + 90

    img = Image.new("RGB", (W, alto), HUESO)
    d = ImageDraw.Draw(img)

    mx = 72  # margen lateral
    y = 76

    # ---------- cabecera ----------
    d.text((mx, y), "ANA MARÍA TAROT", font=F_ETIQUETA, fill=ORO)
    y += 46
    d.text((mx, y), "Tarifario", font=F_TITULO, fill=TINTA)
    y += 96
    d.text((mx, y), f"Vigentes a {vigencia}  ·  Valores en pesos argentinos",
           font=F_TEXTO, fill=SUAVE)
    y += 58
    d.line([(mx, y), (W - mx, y)], fill=TINTA, width=2)
    y += 44

    # encabezado de columnas: valor, lo que se abona al reservar y lo que queda
    col_valor = W - mx - 460
    col_sena = W - mx - 230
    col_resto = W - mx
    d.text((mx, y), "SERVICIO", font=F_ETIQUETA, fill=TENUE)
    d.text((col_valor, y), "VALOR", font=F_ETIQUETA, fill=TENUE, anchor="ra")
    d.text((col_sena, y), "SEÑA 30%", font=F_ETIQUETA, fill=ORO, anchor="ra")
    d.text((col_resto, y), "RESTA 70%", font=F_ETIQUETA, fill=TENUE, anchor="ra")
    y += 44

    # ---------- servicios ----------
    for s in servicios:
        d.line([(mx, y), (W - mx, y)], fill=LINEA, width=1)
        y += 34
        d.text((mx, y), s["titulo"], font=F_SERVICIO, fill=TINTA)
        y += 62

        for etiqueta, valor in s["filas"]:
            sena = round(valor * SENA)
            d.text((mx + 14, y + 8), etiqueta.upper(), font=F_CHICA, fill=TENUE)
            d.text((col_valor, y + 2), pesos(valor), font=F_PRECIO, fill=TINTA, anchor="ra")
            d.text((col_sena, y + 6), pesos(sena), font=F_SENA, fill=ORO, anchor="ra")
            d.text((col_resto, y + 6), pesos(valor - sena), font=F_SENA, fill=SUAVE,
                   anchor="ra")
            y += 72

        if s["nota"]:
            d.text((mx + 14, y), f"* {s['nota']}", font=F_CHICA, fill=TENUE)
            y += 46

        y += 12

    # ---------- condiciones ----------
    y += 14
    d.line([(mx, y), (W - mx, y)], fill=TINTA, width=2)
    y += 40
    d.text((mx, y), "CONDICIONES", font=F_ETIQUETA, fill=ORO)
    y += 42

    for c in condiciones:
        # Segoe UI no trae ✦: se usa una viñeta que sí existe en la fuente
        d.text((mx + 4, y - 1), "•", font=F_TEXTO, fill=ORO)
        # el texto largo se parte en dos líneas si hace falta
        palabras, linea, lineas = c.split(), "", []
        for p in palabras:
            prueba = (linea + " " + p).strip()
            if d.textlength(prueba, font=F_CHICA) > W - mx * 2 - 40:
                lineas.append(linea)
                linea = p
            else:
                linea = prueba
        lineas.append(linea)
        for i, l in enumerate(lineas):
            d.text((mx + 34, y + i * 30), l, font=F_CHICA, fill=SUAVE)
        y += 30 * len(lineas) + 14

    img.save(SALIDA)
    print(f"{SALIDA.name}  ({W}x{alto})")
    for s in servicios:
        for etiqueta, valor in s["filas"]:
            sena = round(valor * SENA)
            print(f"  {s['titulo']:<22} {etiqueta:<12} {pesos(valor):>10}"
                  f"   seña {pesos(sena):>9}   resta {pesos(valor - sena):>9}")


if __name__ == "__main__":
    main()
