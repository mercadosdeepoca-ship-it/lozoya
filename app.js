const schedules = {
  jueves: [
    ['18:00', 'Apertura del mercado', 'Mercado'],
    ['19:00', 'Gran desfile inaugural: músicos, bufones y seres mágicos', 'Recorrido del mercado'],
    ['20:30', 'Cuéntame un cuento', 'Plaza del Gato'],
    ['20:45', 'El cazador de duendes', 'Recorrido del mercado'],
    ['21:00', 'Pasacalles musical · Galata', 'Recorrido del mercado'],
    ['21:30', 'Rebelión musical', 'Recorrido del mercado'],
    ['21:30', 'El regreso del Dragón Rojo', 'Recorrido del mercado'],
    ['22:00', 'Acrobacias aéreas', 'Plaza del Castillo'],
    ['22:15', 'Esto está que arde', 'Plaza del Castillo'],
    ['22:30', 'Rebelión Brutal Folk', 'Recorrido del mercado']
  ],
  viernes: [
    ['11:00', 'Apertura del mercado', 'Mercado'],
    ['12:00', 'Los sonidos del medievo', 'Recorrido del mercado'],
    ['12:45', 'Cuéntame un cuento', 'Plaza del Gato'],
    ['13:00', 'Cazador de duendes', 'Recorrido del mercado'],
    ['13:30', 'Los sonidos del medievo', 'Recorrido del mercado'],
    ['14:00', 'Cuéntame un cuento', 'Plaza del Gato'],
    ['14:30', 'Descanso para el buen yantar', ''],
    ['17:00', 'Regresamos de la siesta', ''],
    ['17:30', 'Pinillo, el bufón de la corte', 'Recorrido del mercado'],
    ['17:45', 'Los tarados del medievo', 'Recorrido del mercado'],
    ['18:00', 'Cuéntame un cuento', 'Plaza del Gato'],
    ['18:00', "Rithual's", 'Recorrido del mercado'],
    ['18:30', 'El jorobado de No me dan', 'Recorrido del mercado'],
    ['18:45', 'Bufonas de Carlos', 'Recorrido del mercado'],
    ['19:00', 'Cuéntame un cuento', 'Plaza del Gato'],
    ['19:00', 'El desdichado leproso y su rata Sífilis', 'Recorrido del mercado'],
    ['19:15', 'Los tarados del medievo', 'Recorrido del mercado'],
    ['19:30', "Rithual's", 'Recorrido del mercado'],
    ['20:00', 'Cuéntame un cuento', 'Plaza del Gato'],
    ['20:15', 'La sirena del Lozoya', ''],
    ['20:30', 'Los tarados del ritmo', 'Recorrido del mercado'],
    ['20:45', 'Rebelión Brutal Folk', 'Recorrido del mercado'],
    ['20:45', 'La captura del Dragón Rojo', 'Recorrido del mercado'],
    ['21:15', "Rithual's", 'Recorrido del mercado'],
    ['22:00', 'Demonium · Pasacalles diabólico de gran formato', 'Recorrido del mercado'],
    ['22:30', 'Acrobacias aéreas y fuego', 'Plaza del Castillo'],
    ['23:00', 'Brutal Folk', 'Campamento Rebelión']
  ],
  sabado: [],
  domingo: [
    ['11:00', 'Apertura del mercado', 'Mercado'],
    ['12:00', 'Los sonidos del medievo', 'Recorrido del mercado'],
    ['12:45', 'Cuéntame un cuento', 'Plaza del Gato'],
    ['13:00', 'Cazador de duendes', 'Recorrido del mercado'],
    ['13:30', 'Los sonidos del medievo', 'Recorrido del mercado'],
    ['14:00', 'Cuéntame un cuento', 'Plaza del Gato'],
    ['14:30', 'Rebelión Brutal Folk', 'Recorrido del mercado'],
    ['17:00', 'Pinillo, el bufón de la corte', 'Recorrido del mercado'],
    ['17:15', 'Los tarados del medievo', 'Recorrido del mercado'],
    ['18:00', 'Cuéntame un cuento', 'Plaza del Gato'],
    ['18:00', "Rithual's", 'Recorrido del mercado'],
    ['18:30', 'El jorobado de No me dan', 'Recorrido del mercado'],
    ['18:45', 'Bufonas de Carlos', 'Recorrido del mercado'],
    ['19:00', 'Cuéntame un cuento', 'Plaza del Gato'],
    ['19:00', 'El desdichado leproso y su rata Sífilis', 'Recorrido del mercado'],
    ['19:15', 'Los tarados del medievo', 'Recorrido del mercado'],
    ['19:30', "Rithual's", 'Recorrido del mercado'],
    ['20:00', 'Cuéntame un cuento', 'Plaza del Gato'],
    ['20:00', 'La captura del Dragón Rojo', 'Recorrido del mercado'],
    ['20:00', 'Rebelión Brutal Folk', 'Recorrido del mercado'],
    ['21:15', 'Gran desfile de todos los participantes', 'Recorrido del mercado'],
    ['22:00', 'Despedida del gran mercado', 'Plaza del Castillo']
  ]
};
schedules.sabado = schedules.viernes.map(item => [...item]);

const scheduleNode = document.querySelector('#schedule');
const tabs = document.querySelectorAll('.tab');

function renderSchedule(day) {
  scheduleNode.innerHTML = schedules[day].map(([time, name, place]) => `
    <article class="schedule-item">
      <time class="schedule-time">${time}</time>
      <div class="schedule-name">${name}</div>
      <div class="schedule-place">${place}</div>
    </article>
  `).join('');
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(item => {
      const selected = item === tab;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-selected', String(selected));
    });
    renderSchedule(tab.dataset.day);
  });
});
renderSchedule('jueves');

const target = new Date('2026-09-03T18:00:00+02:00').getTime();
const countdownNode = document.querySelector('#countdown');

function updateCountdown() {
  const distance = target - Date.now();
  if (distance <= 0) {
    countdownNode.innerHTML = '<p class="market-open">¡El mercado medieval ya está abierto!</p>';
    return;
  }
  const day = 1000 * 60 * 60 * 24;
  document.querySelector('#days').textContent = Math.floor(distance / day);
  document.querySelector('#hours').textContent = String(Math.floor((distance % day) / (1000 * 60 * 60))).padStart(2, '0');
  document.querySelector('#minutes').textContent = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
  document.querySelector('#seconds').textContent = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

const zoomablePhotos = [...document.querySelectorAll([
  '.galata-photo img',
  '.rithuals-show img',
  '.capture-gallery img',
  '.feature-show img'
].join(', '))];

if (zoomablePhotos.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Foto ampliada');
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Cerrar foto ampliada">×</button>
    <img class="lightbox-image" alt="">
  `;
  document.body.append(lightbox);

  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const closeButton = lightbox.querySelector('.lightbox-close');
  let lastFocusedPhoto = null;

  function openLightbox(photo) {
    lastFocusedPhoto = photo;
    lightboxImage.src = photo.currentSrc || photo.src;
    lightboxImage.alt = photo.alt;
    lightbox.classList.add('open');
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.classList.remove('lightbox-open');
    lightboxImage.removeAttribute('src');
    lastFocusedPhoto?.focus();
  }

  zoomablePhotos.forEach(photo => {
    photo.classList.add('zoomable-photo');
    photo.tabIndex = 0;
    photo.setAttribute('role', 'button');
    photo.setAttribute('aria-label', `${photo.alt}. Ampliar foto`);
    photo.addEventListener('click', () => openLightbox(photo));
    photo.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(photo);
      }
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}

const installButton = document.querySelector('#install-app');
const installHelp = document.querySelector('#install-help');
let installPrompt = null;

const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const isSamsungInternet = /SamsungBrowser/i.test(window.navigator.userAgent);

if (isStandalone) installButton.hidden = true;
if (isSamsungInternet) installButton.textContent = 'Abrir en Chrome para instalar';

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
});

installButton.addEventListener('click', async () => {
  if (installPrompt && !isSamsungInternet) {
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    installPrompt = null;
    if (choice.outcome === 'accepted') installButton.hidden = true;
    return;
  }

  installHelp.querySelector('.install-help-ios').hidden = !isIOS;
  installHelp.querySelector('.install-help-samsung').hidden = !isSamsungInternet;
  installHelp.querySelector('.install-help-other').hidden = isIOS || isSamsungInternet;
  installHelp.querySelector('.install-help-chrome').hidden = !isSamsungInternet;
  installHelp.showModal();
});

installHelp.querySelectorAll('.install-help-close, .install-help-ok').forEach(button => {
  button.addEventListener('click', () => installHelp.close());
});
installHelp.addEventListener('click', event => {
  if (event.target === installHelp) installHelp.close();
});

window.addEventListener('appinstalled', () => {
  installPrompt = null;
  installButton.hidden = true;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}
