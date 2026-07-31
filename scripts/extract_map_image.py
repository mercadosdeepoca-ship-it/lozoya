#!/usr/bin/env python3
from pathlib import Path
import re, base64
cache=Path('/Users/talent-oso/.hermes/document_cache')
src=max(cache.glob('*mapa_interactivo_buitrago.html'), key=lambda path: path.stat().st_mtime)
text=src.read_text(encoding='utf-8')
m=re.search(r'<img src="data:image/jpeg;base64,([^"]+)"',text)
if not m: raise SystemExit('DATA_IMAGE_NOT_FOUND')
out=Path('/Users/talent-oso/proyectos/manolo-feria-buitrago/mapa_interactivo_buitrago_original.jpg')
out.write_bytes(base64.b64decode(m.group(1)))
print(out)
