(() => {
  const dialog = document.getElementById('enquiry');
  const form = document.getElementById('quote-form');
  if (!dialog || !form) return;

  const assessment = form.elements.assessment;
  const quantity = form.elements.quantity;
  const attachment = form.elements.attachment;
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('[type="submit"]');
  const submitLabel = submit.innerHTML;
  const updateQuantityRequirement = () => { quantity.required = !assessment.checked; };
  const validateAttachment = () => {
    const file = attachment.files[0];
    attachment.setCustomValidity(file && file.size > 10 * 1024 * 1024 ? form.dataset.fileError : '');
  };

  assessment.addEventListener('change', updateQuantityRequirement);
  attachment.addEventListener('change', validateAttachment);
  updateQuantityRequirement();
  document.querySelectorAll('[data-open-enquiry]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
  document.querySelector('[data-close-enquiry]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    validateAttachment();
    if (!form.reportValidity()) return;
    status.hidden = true;
    submit.disabled = true;
    submit.textContent = form.dataset.sending;
    try {
      const body = new FormData(form);
      if (!attachment.files.length) body.delete('attachment');
      const response = await fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        body,
        headers: { Accept: 'application/json' }
      });
      const result = await response.json();
      if (!response.ok || !(result.success === true || result.success === 'true')) throw new Error('Submission rejected');
      window.location.assign(form.elements._next.value);
    } catch {
      status.textContent = form.dataset.sendError;
      status.hidden = false;
      submit.disabled = false;
      submit.innerHTML = submitLabel;
    }
  });
})();
