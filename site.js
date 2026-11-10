(() => {
  const dialog = document.getElementById('enquiry');
  const form = document.getElementById('quote-form');
  if (!dialog || !form) return;
  const assessment = form.elements.assessment;
  const quantity = form.elements.quantity;
  const updateQuantityRequirement = () => { quantity.required = !assessment.checked; };
  assessment.addEventListener('change', updateQuantityRequirement);
  updateQuantityRequirement();
  document.querySelectorAll('[data-open-enquiry]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
  document.querySelector('[data-close-enquiry]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const copy = window.SITE_MAIL_COPY;
    const value = name => form.elements[name].value.trim();
    const lines = [
      copy.mail_intro,
      '',
      `${copy.mail_country}: ${copy.mail_country_value}`,
      `${copy.mail_name}: ${value('name')}`,
      `${copy.mail_company}: ${value('company') || '—'}`,
      `${copy.mail_email}: ${value('email')}`,
      `${copy.mail_quantity}: ${value('quantity') || '—'}`,
      `${copy.mail_material}: ${value('material')}`,
      `${copy.mail_colour}: ${value('colour')}`,
      `${copy.mail_timing}: ${value('timing') || '—'}`,
      `${copy.mail_assessment}: ${form.elements.assessment.checked ? copy.mail_yes : copy.mail_no}`,
      `${copy.mail_file}: ${form.elements.file_ready.checked ? copy.mail_yes : copy.mail_no}`,
      '',
      `${copy.mail_project}:`,
      value('project'),
      '',
      copy.mail_reminder
    ];
    const subject = encodeURIComponent(copy.email_subject);
    const body = encodeURIComponent(lines.join('\n'));
    window.location.href = `mailto:collabs@3dworkbench.ch?subject=${subject}&body=${body}`;
  });
})();
