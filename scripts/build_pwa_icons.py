#!/usr/bin/env python3
"""Genera iconos PWA reproducibles con la identidad visual de Buitrago Medieval."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "icons"
OUT.mkdir(parents=True, exist_ok=True)


def font(size: int):
    candidates = [
        Path("/System/Library/Fonts/Supplemental/Georgia Bold.ttf"),
        Path("/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf"),
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(str(candidate), size)
        except OSError:
            continue
    return ImageFont.load_default()


def build(size: int) -> None:
    image = Image.new("RGB", (size, size), "#17110c")
    draw = ImageDraw.Draw(image)
    margin = round(size * 0.10)
    draw.rounded_rectangle(
        (margin, margin, size - margin, size - margin),
        radius=round(size * 0.16),
        fill="#8f241d",
        outline="#d4a43d",
        width=max(4, round(size * 0.025)),
    )
    draw.ellipse(
        (round(size * .31), round(size * .16), round(size * .69), round(size * .54)),
        fill="#d4a43d",
    )
    crown_y = round(size * .28)
    points = [
        (round(size * .34), crown_y), (round(size * .40), round(size * .18)),
        (round(size * .47), crown_y), (round(size * .53), round(size * .18)),
        (round(size * .60), crown_y), (round(size * .66), round(size * .18)),
        (round(size * .65), round(size * .39)), (round(size * .35), round(size * .39)),
    ]
    draw.polygon(points, fill="#17110c")
    label = "BM"
    face = font(round(size * .25))
    box = draw.textbbox((0, 0), label, font=face)
    x = (size - (box[2] - box[0])) / 2
    y = round(size * .53)
    draw.text((x, y), label, font=face, fill="#fff4df", stroke_width=max(1, size // 180), stroke_fill="#17110c")
    image.save(OUT / f"icon-{size}.png", optimize=True)


for icon_size in (192, 512):
    build(icon_size)
print("OK: iconos PWA 192/512 generados")
