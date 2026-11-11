/* Google Sheets contact form. The deployment URL is configured on #contact-form. */
(function () {
  "use strict";

  const form = document.getElementById('contact-form');
  if (!form) return;

  const button = form.querySelector('button[type="submit"]');
  const loading = form.querySelector('.loading');
  const error = form.querySelector('.error-message');
  const success = form.querySelector('.sent-message');
  const fields = ['name', 'email', 'subject', 'message'];
  let pending = false;
  let previousPayload = '';
  let submissionId = '';
  button.disabled = false;

  function showError(message) {
    error.textContent = message;
    error.classList.add('d-block');
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (pending) return;
    error.classList.remove('d-block');
    success.classList.remove('d-block');
    if (!form.reportValidity()) return;

    const endpoint = form.dataset.googleScriptUrl || '';
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint)) {
      showError('The contact form is being connected. Please email rufai.abubakar@prokip.africa.');
      return;
    }

    const body = new URLSearchParams();
    for (const field of fields) {
      const value = form.elements.namedItem(field).value.trim();
      if (!value) {
        showError('Please complete every field before sending.');
        return;
      }
      body.set(field, value);
    }
    body.set('website', form.elements.namedItem('website').value);
    const payload = body.toString();
    if (payload !== previousPayload || !submissionId) {
      submissionId = crypto.randomUUID();
      previousPayload = payload;
    }
    body.set('submissionId', submissionId);

    pending = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    loading.classList.add('d-block');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      // URL-encoded fields avoid a cross-origin preflight. Read Google's response:
      // an opaque no-cors response cannot prove that the row was saved.
      const response = await fetch(endpoint, {
        method: 'POST',
        body: body,
        signal: controller.signal,
        credentials: 'omit',
        redirect: 'follow'
      });
      if (!response.ok) throw new Error('Request failed');
      const result = await response.json();
      if (result.ok !== true || result.submissionId !== submissionId) {
        throw new Error('Save not confirmed');
      }
      success.classList.add('d-block');
      form.reset();
      previousPayload = '';
      submissionId = '';
    } catch (_) {
      showError('We could not confirm your message was saved. Your entries are still here. Please retry, or email rufai.abubakar@prokip.africa.');
    } finally {
      clearTimeout(timeout);
      pending = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
      loading.classList.remove('d-block');
    }
  });
})();
