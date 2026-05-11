const form = document.querySelector('#beta-form');
const statusEl = document.querySelector('#form-status');

const validators = [
  {
    name: 'name',
    message: 'Please enter your name.',
    isValid: () => document.querySelector('#name').value.trim().length > 1,
  },
  {
    name: 'imessage',
    message: 'Please enter the iMessage phone number or Apple ID you want to use.',
    isValid: () => document.querySelector('#imessage').value.trim().length > 3,
  },
  {
    name: 'email',
    message: 'Please enter a valid email address.',
    isValid: () => document.querySelector('#email').validity.valid && document.querySelector('#email').value.trim().length > 0,
  },
  {
    name: 'source',
    message: 'Please share how you heard about the beta.',
    isValid: () => document.querySelector('#source').value.trim().length > 1,
  },
  {
    name: 'use_case',
    message: 'Please choose the most likely use case.',
    isValid: () => Boolean(document.querySelector('input[name="use_case"]:checked')),
  },
  {
    name: 'proactive_messages',
    message: 'Please choose Yes or No.',
    isValid: () => Boolean(document.querySelector('input[name="proactive_messages"]:checked')),
  },
  {
    name: 'consent',
    message: 'Please confirm the beta consent statement before requesting access.',
    isValid: () => document.querySelector('#consent').checked,
  },
];

function setError(name, message = '') {
  const errorEl = document.querySelector(`#${name}-error`);
  const control = document.querySelector(`#${name}`) || document.querySelector(`[name="${name}"]`);
  if (errorEl) errorEl.textContent = message;
  const row = control?.closest('.form-row') || control?.closest('.consent-row');
  if (row) row.classList.toggle('has-error', Boolean(message));
}

function validateForm() {
  let firstInvalid = null;

  validators.forEach((validator) => {
    const valid = validator.isValid();
    setError(validator.name, valid ? '' : validator.message);
    if (!valid && !firstInvalid) {
      firstInvalid = document.querySelector(`#${validator.name}`) || document.querySelector(`[name="${validator.name}"]`);
    }
  });

  if (firstInvalid) {
    firstInvalid.focus({ preventScroll: false });
    return false;
  }

  return true;
}

form?.addEventListener('submit', (event) => {
  statusEl.textContent = '';

  if (!validateForm()) {
    event.preventDefault();
    statusEl.textContent = 'Please fix the highlighted fields.';
    return;
  }

  const action = form.getAttribute('action') || '';
  if (action.includes('YOUR_FORM_ID')) {
    event.preventDefault();
    statusEl.textContent = 'Form endpoint is not configured yet. Replace YOUR_FORM_ID with your Formspree endpoint or connect a Google Form before launch.';
    return;
  }

  statusEl.textContent = 'Submitting request…';
});
