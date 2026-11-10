(() => {
  const dialog = document.getElementById('enquiry');
  const form = document.getElementById('quote-form');
  if (!dialog || !form) return;

  const assessment = form.elements.assessment;
  const quantity = form.elements.quantity;
  const attachment = form.elements.attachment;
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
  form.addEventListener('submit', event => {
    validateAttachment();
    if (!form.reportValidity()) event.preventDefault();
  });
})();
