const schedules = {
  jueves: [
    ['18:00', 'Apertura del mercado', 'Mercado'],
    ['19:00', 'Gran desfile inaugural: músicos, bufones y seres mágicos', 'Recorrido del mercado'],
    ['20:30', 'Cuéntame un cuento', 'Plaza del Gato'],
    ['20:45', 'El cazador de duendes', 'Recorrido del mercado'],
    ['21:00', 'Los sonidos del medievo · Galata', 'Recorrido del mercado'],
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
    ['18:00', 'Ritual', 'Recorrido del mercado'],
    ['18:30', 'El jorobado de No me dan', 'Recorrido del mercado'],
    ['18:45', 'Bufonas de Carlos', 'Recorrido del mercado'],
    ['19:00', 'Cuéntame un cuento', 'Plaza del Gato'],
    ['19:00', 'El desdichado leproso y su rata Sífilis', 'Recorrido del mercado'],
    ['19:15', 'Los tarados del medievo', 'Recorrido del mercado'],
    ['19:30', 'Ritual', 'Recorrido del mercado'],
    ['20:00', 'Cuéntame un cuento', 'Plaza del Gato'],
    ['20:15', 'La sirena del Lozoya', ''],
    ['20:30', 'Los tarados del ritmo', 'Recorrido del mercado'],
    ['20:45', 'Rebelión Brutal Folk', 'Recorrido del mercado'],
    ['20:45', 'La captura del Dragón Rojo', 'Recorrido del mercado'],
    ['21:15', 'Ritual', 'Recorrido del mercado'],
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
    ['18:00', 'Ritual', 'Recorrido del mercado'],
    ['18:30', 'El jorobado de No me dan', 'Recorrido del mercado'],
    ['18:45', 'Bufonas de Carlos', 'Recorrido del mercado'],
    ['19:00', 'Cuéntame un cuento', 'Plaza del Gato'],
    ['19:00', 'El desdichado leproso y su rata Sífilis', 'Recorrido del mercado'],
    ['19:15', 'Los tarados del medievo', 'Recorrido del mercado'],
    ['19:30', 'Ritual', 'Recorrido del mercado'],
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

const dialog = document.querySelector('#map-dialog');
const openMap = () => dialog.showModal();
document.querySelector('#open-map').addEventListener('click', openMap);
document.querySelector('#map-image-button').addEventListener('click', openMap);
document.querySelector('#close-map').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
