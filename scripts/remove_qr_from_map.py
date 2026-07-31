#!/usr/bin/env python3
"""Extrae el plano recibido, elimina el pergamino del QR y genera el recurso web.

El recorte superior descarta la cabecera de la XXIII edición para evitar publicar
fecha y edición antiguas dentro de la web de 2026.
"""
from pathlib import Path
from io import BytesIO
import base64
import re

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CACHE = Path('/Users/talent-oso/.hermes/document_cache')
SOURCE = max(CACHE.glob('*mapa_interactivo_buitrago.html'), key=lambda path: path.stat().st_mtime)
FULL_CLEAN = ROOT / 'mapa_interactivo_buitrago_sin_qr.jpg'
WEB_IMAGE = ROOT / 'assets' / 'mapa-interactivo.jpg'

html = SOURCE.read_text(encoding='utf-8')
match = re.search(r'data:image/jpeg;base64,([^"\s]+)', html)
if not match:
    raise SystemExit('No se encontró la imagen JPEG incrustada')

raw = base64.b64decode(match.group(1))
image = cv2.imdecode(np.frombuffer(raw, dtype=np.uint8), cv2.IMREAD_COLOR)
if image is None or image.shape[:2] != (1600, 1131):
    raise SystemExit(f'Dimensiones inesperadas: {None if image is None else image.shape[:2]}')

# Sustituye el pergamino inferior derecho por madera tomada del propio original.
y0, y1 = 1360, 1600
x0, x1 = 880, 1131
strip = image[900:1140, 1048:1131]
wood = np.concatenate([strip, cv2.flip(strip, 1), strip, cv2.flip(strip, 1)], axis=1)
wood = cv2.resize(wood, (x1 - x0, y1 - y0), interpolation=cv2.INTER_CUBIC)
wood = cv2.GaussianBlur(wood, (0, 0), 0.45)

mask = np.zeros(image.shape[:2], dtype=np.uint8)
polygon = np.array([[920, 1358], [1130, 1368], [1130, 1599], [874, 1599], [880, 1490], [897, 1428]], dtype=np.int32)
cv2.fillPoly(mask, [polygon], 255)
mask = cv2.GaussianBlur(mask, (0, 0), 5)

replacement = image.copy()
replacement[y0:y1, x0:x1] = wood
alpha = (mask.astype(np.float32) / 255.0)[..., None]
clean = (replacement.astype(np.float32) * alpha + image.astype(np.float32) * (1 - alpha)).astype(np.uint8)

# La cabecera antigua termina antes de y=340. El plano y su leyenda quedan intactos.
web = clean[340:1600, :]

FULL_CLEAN.parent.mkdir(parents=True, exist_ok=True)
WEB_IMAGE.parent.mkdir(parents=True, exist_ok=True)
cv2.imwrite(str(FULL_CLEAN), clean, [cv2.IMWRITE_JPEG_QUALITY, 92])
cv2.imwrite(str(WEB_IMAGE), web, [cv2.IMWRITE_JPEG_QUALITY, 90])
print(FULL_CLEAN)
print(WEB_IMAGE)
