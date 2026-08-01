#!/usr/bin/env python3
"""Descarga y fija localmente las fuentes usadas por la web.

Evita que cada visita contacte con Google Fonts. Ejecutar desde la raíz del
repositorio: python3 scripts/self_host_fonts.py
"""
from pathlib import Path
import hashlib
import re
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "fonts"
CSS_OUT = ROOT / "fonts.css"
CSS_URL = (
    "https://fonts.googleapis.com/css2?"
    "family=Cinzel:wght@600;700;800&family=Montserrat:wght@400;500;600;700&display=swap"
)
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36"


def fetch(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    css = fetch(CSS_URL).decode("utf-8")
    urls = sorted(set(re.findall(r"url\((https://[^)]+)\)", css)))
    if not urls:
        raise RuntimeError("Google Fonts no devolvió archivos descargables")

    for url in urls:
        data = fetch(url)
        suffix = Path(url.split("?", 1)[0]).suffix or ".woff2"
        name = f"{hashlib.sha256(url.encode()).hexdigest()[:16]}{suffix}"
        destination = OUT_DIR / name
        destination.write_bytes(data)
        css = css.replace(url, f"assets/fonts/{name}")

    header = "/* Fuentes autoalojadas; regenerar con scripts/self_host_fonts.py */\n"
    CSS_OUT.write_text(header + css, encoding="utf-8")
    print(f"Fuentes descargadas: {len(urls)}; CSS: {CSS_OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
