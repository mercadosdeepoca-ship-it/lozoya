const form = document.querySelector('#contest-form');
const uploadPanel = document.querySelector('#upload-panel');
const transferPanel = document.querySelector('#transfer-panel');
const transferUrl = document.querySelector('#transfer-url');
const submitButton = document.querySelector('#prepare-entry');
const formStatus = document.querySelector('#form-status');
const bases = document.querySelector('#bases');
const openBases = document.querySelector('#open-bases');
const categoryInputs = [...document.querySelectorAll('[data-category]')];

function setMethod(method) {
  const upload = method === 'upload';
  uploadPanel.hidden = !upload;
  transferPanel.hidden = upload;
  categoryInputs.forEach(input => {
    input.required = upload;
    input.disabled = !upload;
  });
  transferUrl.required = !upload;
  transferUrl.disabled = upload;
  formStatus.textContent = '';
}

document.querySelectorAll('input[name="delivery"]').forEach(input => {
  input.addEventListener('change', () => setMethod(input.value));
});

categoryInputs.forEach(input => {
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const jpg = /\.jpe?g$/i.test(file.name) && ['image/jpeg', 'image/pjpeg', ''].includes(file.type);
    input.setCustomValidity(jpg ? '' : 'La fotografía debe estar en formato JPG.');
  });
});

openBases.addEventListener('click', () => {
  bases.open = true;
  document.querySelector('#bases-title').focus({ preventScroll: true });
});

form.addEventListener('submit', event => {
  event.preventDefault();
  categoryInputs.forEach(input => input.dispatchEvent(new Event('change')));

  if (!form.checkValidity()) {
    form.reportValidity();
    formStatus.textContent = 'Revisa los campos marcados antes de continuar.';
    return;
  }

  submitButton.textContent = 'Participación preparada';
  formStatus.textContent = 'Todo correcto. El envío definitivo se activará al conectar el correo oficial del concurso.';
  formStatus.focus();
});

setMethod('upload');
