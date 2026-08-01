(() => {
  const KEY = 'lozoya_cookie_consent_v1';
  const MAX_AGE = 180 * 24 * 60 * 60 * 1000;

  function readChoice() {
    try {
      const choice = JSON.parse(localStorage.getItem(KEY));
      if (!choice || Date.now() - choice.savedAt > MAX_AGE) {
        localStorage.removeItem(KEY);
        return null;
      }
      return choice.maps === true;
    } catch {
      localStorage.removeItem(KEY);
      return null;
    }
  }

  function saveChoice(maps) {
    localStorage.setItem(KEY, JSON.stringify({ maps, savedAt: Date.now() }));
  }

  function loadMaps() {
    document.querySelectorAll('iframe[data-map-src]').forEach(frame => {
      if (!frame.src) frame.src = frame.dataset.mapSrc;
      frame.hidden = false;
    });
    document.querySelectorAll('[data-map-placeholder]').forEach(item => item.hidden = true);
  }

  function showMapPlaceholders() {
    document.querySelectorAll('iframe[data-map-src]').forEach(frame => {
      frame.hidden = true;
      frame.removeAttribute('src');
    });
    document.querySelectorAll('[data-map-placeholder]').forEach(item => item.hidden = false);
  }

  function removeBanner() {
    document.querySelector('.cookie-banner')?.remove();
  }

  function applyChoice(maps) {
    saveChoice(maps);
    maps ? loadMaps() : showMapPlaceholders();
    removeBanner();
  }

  function showBanner() {
    removeBanner();
    const banner = document.createElement('aside');
    banner.className = 'cookie-banner';
    banner.setAttribute('aria-label', 'Preferencias de cookies');
    banner.innerHTML = `
      <p><strong>Tu privacidad, primero.</strong> No usamos analítica ni publicidad. Solo cargaremos el mapa de Google si lo aceptas. <a href="legal.html#cookies">Más información</a>.</p>
      <div class="cookie-actions">
        <button type="button" data-cookie-reject>Rechazar mapa externo</button>
        <button type="button" data-cookie-accept>Aceptar Google Maps</button>
      </div>`;
    banner.querySelector('[data-cookie-reject]').addEventListener('click', () => applyChoice(false));
    banner.querySelector('[data-cookie-accept]').addEventListener('click', () => applyChoice(true));
    document.body.appendChild(banner);
  }

  function resetChoice() {
    localStorage.removeItem(KEY);
    showMapPlaceholders();
    showBanner();
  }

  document.addEventListener('click', event => {
    if (event.target.closest('[data-cookie-settings]')) resetChoice();
    if (event.target.closest('[data-map-accept]')) applyChoice(true);
  });

  const choice = readChoice();
  if (choice === true) loadMaps();
  else showMapPlaceholders();
  if (choice === null) showBanner();
})();
