#!/usr/bin/env python3
"""Prueba local de legal, privacidad, consentimiento y móvil."""
from pathlib import Path
import json
import os
from PIL import Image
from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE_URL", "http://127.0.0.1:8765").rstrip("/")
OUT = Path("test-artifacts")
OUT.mkdir(exist_ok=True)

manifest = json.loads(Path("manifest.webmanifest").read_text(encoding="utf-8"))
assert manifest["display"] == "standalone"
assert manifest["start_url"].startswith("/")
for size in (192, 512):
    icon = Image.open(f"assets/icons/icon-{size}.png")
    assert icon.size == (size, size)


def no_horizontal_overflow(page):
    return page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth")


with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    context = browser.new_context(viewport={"width": 1280, "height": 800})
    page = context.new_page()
    external = []
    page.on("request", lambda request: external.append(request.url) if not request.url.startswith(BASE) else None)

    page.goto(f"{BASE}/index.html", wait_until="networkidle")
    assert page.locator("link[rel='manifest']").get_attribute("href") == "manifest.webmanifest"
    assert page.locator("#install-app").is_visible()
    page.locator("#install-app").click()
    assert page.locator("#install-help").evaluate("dialog => dialog.open")
    page.locator(".install-help-ok").click()
    assert not page.locator("#install-help").evaluate("dialog => dialog.open")
    assert page.evaluate("navigator.serviceWorker.ready.then(reg => reg.active.scriptURL.endsWith('/sw.js'))")
    page.reload(wait_until="networkidle")
    context.set_offline(True)
    page.goto(f"{BASE}/index.html", wait_until="domcontentloaded")
    assert page.locator("h1").is_visible()
    context.set_offline(False)
    page.reload(wait_until="networkidle")
    assert page.locator(".cookie-banner").is_visible()
    assert page.locator("#demonium h2").inner_text() == "Demonium"
    assert page.locator("#jorobado-no-me-dan h2").inner_text() == "El jorobado de No-me-dan"
    assert page.locator("#jorobado-no-me-dan img").get_attribute("src") == "assets/jorobado-no-me-dan.jpg"
    assert page.locator("#marioneta-viva h2").inner_text() == "La marioneta viva"
    assert page.locator("#marioneta-viva img").get_attribute("src") == "assets/marioneta-viva.jpg"
    assert page.locator("a[href='#demonium']").is_visible()
    assert page.locator("#il-diabole").count() == 0
    assert page.locator("iframe[data-map-src]").get_attribute("src") is None
    assert not page.locator("iframe[data-map-src]").is_visible()
    assert not any("google.com/maps?q=" in url for url in external), external
    assert not any("fonts.googleapis.com" in url or "fonts.gstatic.com" in url for url in external), external
    assert page.locator("[data-map-placeholder]").is_visible()
    page.locator("[data-cookie-reject]").click()
    assert page.locator("[data-map-placeholder]").is_visible()
    assert page.evaluate("JSON.parse(localStorage.getItem('lozoya_cookie_consent_v1')).maps") is False

    page.locator("[data-cookie-settings]").click()
    page.locator("[data-cookie-accept]").click()
    page.wait_for_selector("iframe[data-map-src]:not([hidden])")
    assert "google.com/maps" in page.locator("iframe[data-map-src]").get_attribute("src")
    assert page.locator("iframe[data-map-src]").is_visible()
    assert not page.locator("[data-map-placeholder]").is_visible()
    page.screenshot(path=str(OUT / "inicio-legal-escritorio.png"), full_page=True)

    page.goto(f"{BASE}/legal.html", wait_until="networkidle")
    assert page.locator("#aviso-legal").is_visible()
    text = page.locator("#aviso-legal").inner_text()
    for expected in ["Pura Alexi Arteaga Almendras", "16853964R", "Calle Yeles 94", "693 672 402"]:
        assert expected in text
    assert no_horizontal_overflow(page)
    page.screenshot(path=str(OUT / "legal-escritorio.png"), full_page=True)

    mobile = browser.new_context(viewport={"width": 360, "height": 800})
    mpage = mobile.new_page()
    mpage.goto(f"{BASE}/index.html#como-llegar", wait_until="networkidle")
    assert mpage.locator("[data-map-placeholder]").is_visible()
    assert not mpage.locator("iframe[data-map-src]").is_visible()
    assert no_horizontal_overflow(mpage)
    assert mpage.locator("#raebellion-title").bounding_box()["x"] + mpage.locator("#raebellion-title").bounding_box()["width"] <= 360
    directions_bottom = mpage.locator("#como-llegar").bounding_box()["y"] + mpage.locator("#como-llegar").bounding_box()["height"]
    contest_top = mpage.locator("#concurso").bounding_box()["y"]
    assert contest_top >= directions_bottom - 1, (directions_bottom, contest_top)
    mpage.screenshot(path=str(OUT / "inicio-mapa-movil.png"), full_page=True)

    mpage.goto(f"{BASE}/legal.html", wait_until="networkidle")
    assert mpage.locator(".cookie-banner").is_visible()
    assert no_horizontal_overflow(mpage)
    mpage.locator("[data-cookie-reject]").click()
    mpage.screenshot(path=str(OUT / "legal-movil.png"), full_page=True)

    mpage.goto(f"{BASE}/concurso.html#participa", wait_until="networkidle")
    assert mpage.locator(".privacy-summary").is_visible()
    contact = mpage.locator(".contact-email a")
    assert contact.inner_text() == "degladis.serviciostematicos@gmail.com"
    assert contact.get_attribute("href") == "mailto:degladis.serviciostematicos@gmail.com"
    poster = mpage.locator(".poster-download")
    assert poster.get_attribute("href") == "assets/concurso-cinco-miradas.jpg"
    assert poster.get_attribute("download") == "Cartel-Cinco-miradas-al-Medievo.jpg"
    mpage.locator(".poster-zoom").click()
    assert mpage.locator("#poster-lightbox").evaluate("dialog => dialog.open")
    assert mpage.locator("#poster-lightbox img").is_visible()
    mpage.locator(".poster-lightbox-close").click()
    assert not mpage.locator("#poster-lightbox").evaluate("dialog => dialog.open")
    assert "no transmite ni almacena" in mpage.locator(".pending-note").inner_text()
    assert mpage.locator("input[name=legal_acceptance]").is_visible()
    assert no_horizontal_overflow(mpage)
    mpage.locator("input[name=name]").fill("Prueba")
    mpage.locator("input[name=surname]").fill("Local")
    mpage.locator("input[name=email]").fill("prueba@example.com")
    mpage.locator("input[name=phone]").fill("600000000")
    mpage.locator("input[name=city]").fill("Buitrago")
    mpage.locator("input[value=transfer]").check()
    mpage.locator("#transfer-url").fill("https://we.tl/prueba")
    mpage.locator("input[name=legal_acceptance]").check()
    mpage.locator("#prepare-entry").click()
    assert "nada se ha transmitido" in mpage.locator("#form-status").inner_text()
    mpage.screenshot(path=str(OUT / "concurso-privacidad-movil.png"), full_page=True)

    mpage.goto(f"{BASE}/mapa_interactivo_buitrago.html", wait_until="networkidle")
    assert mpage.locator("a[href='legal.html']").is_visible()
    assert no_horizontal_overflow(mpage)

    mobile.close()

    ios = browser.new_context(
        viewport={"width": 390, "height": 844},
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
    )
    iphone = ios.new_page()
    iphone.goto(f"{BASE}/index.html", wait_until="networkidle")
    iphone.locator("#install-app").click()
    assert iphone.locator(".install-help-ios").is_visible()
    assert not iphone.locator(".install-help-other").is_visible()
    assert no_horizontal_overflow(iphone)
    ios.close()

    context.close()
    browser.close()

print("OK: PWA, offline, iPhone, legal, formulario y vistas 1280/360 verificados")
