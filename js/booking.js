/**
 * Онлайн-запис.
 *  - Якщо в config.js задано endpoints.booking — заявка йде POST-запитом на бекенд.
 *  - Поки бекенду немає — формуємо текст заявки, копіюємо його в буфер
 *    і пропонуємо надіслати в Telegram / Viber / WhatsApp або зателефонувати.
 */
(function (A) {
  'use strict';

  const { api } = A;
  const { t, loc, getLang, getLocale } = A.i18n;
  const { icon } = A.icons;
  const { $, esc, digits, formatPhone, phoneHref, normalizePhone, todayISO } = A.utils;

  const REQUIRED = ['name', 'phone', 'service'];

  let state = null;
  let form;
  let modal;
  let modalBody;
  let submitBtn;
  let statusEl;

  function initBooking(appState) {
    state = appState;
    form = $('#booking-form');
    modal = $('#booking-modal');
    modalBody = $('#modal-body');
    submitBtn = $('#bk-submit');
    statusEl = $('#bk-status');

    form.elements.date.min = todayISO();
    form.addEventListener('submit', onSubmit);
    form.addEventListener('input', (e) => clearError(e.target.name));
    form.addEventListener('change', (e) => {
      clearError(e.target.name);
      if (e.target.name === 'service') renderMasters();
    });

    // Кнопка «записатися» біля позиції прайсу — підставляє послугу у форму
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-book]');
      if (!trigger) return;
      form.elements.service.value = trigger.dataset.book;
      clearError('service');
      renderMasters();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('[data-close]')) modal.close();
    });
  }

  /* ---------- опції селектів ---------- */

  const option = (value, label) => `<option value="${esc(value)}">${esc(label)}</option>`;

  function setValue(select, value) {
    select.value = [...select.options].some((o) => o.value === value) ? value : '';
  }

  function findService(id) {
    for (const category of state.categories) {
      const item = (category.items || []).find((i) => i.id === id);
      if (item) return { item, category };
    }
    return null;
  }

  function timeSlots({ slotFrom = '09:00', slotTo = '19:00', slotStepMinutes = 30 } = {}) {
    const toMinutes = (hhmm) => {
      const [h, m] = hhmm.split(':').map(Number);
      return h * 60 + m;
    };
    const pad = (n) => String(n).padStart(2, '0');
    const slots = [];
    for (let m = toMinutes(slotFrom); m <= toMinutes(slotTo); m += slotStepMinutes) {
      slots.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
    }
    return slots;
  }

  /** Майстри, що виконують обрану послугу (або всі, якщо послугу не обрано). */
  function renderMasters() {
    const select = form.elements.master;
    const previous = select.value;
    const categoryId = findService(form.elements.service.value)?.category.id;
    const masters = state.team.filter((m) => !categoryId || !m.categories?.length || m.categories.includes(categoryId));
    select.innerHTML = option('', t('booking.anyMaster'))
      + masters.map((m) => option(m.id, `${loc(m.name)} — ${loc(m.role)}`)).join('');
    setValue(select, previous);
  }

  function renderBookingOptions() {
    if (!form) return;
    const { service, time } = form.elements;

    const prevService = service.value;
    service.innerHTML = option('', t('booking.servicePh'))
      + state.categories.map((c) => `
        <optgroup label="${esc(loc(c.title))}">
          ${(c.items || []).map((i) => option(i.id, loc(i.name))).join('')}
        </optgroup>`).join('')
      + option('consultation', t('booking.consult'));
    setValue(service, prevService);

    renderMasters();

    const prevTime = time.value;
    time.innerHTML = option('', t('booking.timePh')) + timeSlots(state.site.booking).map((s) => option(s, s)).join('');
    setValue(time, prevTime);

    clearAllErrors();
  }

  /* ---------- валідація ---------- */

  function validate(data) {
    const errors = {};
    REQUIRED.forEach((key) => { if (!data[key]) errors[key] = t('booking.errors.required'); });
    const phoneDigits = digits(data.phone).length;
    if (data.phone && (phoneDigits < 9 || phoneDigits > 15)) errors.phone = t('booking.errors.phone');
    if (data.date && data.date < todayISO()) errors.date = t('booking.errors.date');
    return errors;
  }

  function setError(name, message) {
    form.elements[name]?.setAttribute('aria-invalid', 'true');
    const el = $(`#err-${name}`);
    if (el) el.textContent = message;
  }

  function clearError(name) {
    if (!name) return;
    form.elements[name]?.removeAttribute?.('aria-invalid');
    const el = $(`#err-${name}`);
    if (el) el.textContent = '';
    statusEl.textContent = '';
  }

  function clearAllErrors() {
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    form.querySelectorAll('.field__error').forEach((el) => { el.textContent = ''; });
    statusEl.textContent = '';
  }

  /* ---------- відправка ---------- */

  function buildPayload(data) {
    const found = findService(data.service);
    const master = state.team.find((m) => m.id === data.master);
    return {
      name: data.name,
      phone: normalizePhone(data.phone),
      service: found
        ? { id: found.item.id, name: loc(found.item.name), category: found.category.id }
        : { id: 'consultation', name: t('booking.consult') },
      master: master ? { id: master.id, name: loc(master.name) } : null,
      date: data.date || null,
      time: data.time || null,
      comment: data.comment || '',
      lang: getLang(),
      source: 'website',
      createdAt: new Date().toISOString(),
    };
  }

  function formatDate(iso) {
    return new Intl.DateTimeFormat(getLocale(), { weekday: 'short', day: 'numeric', month: 'long' })
      .format(new Date(`${iso}T00:00:00`));
  }

  function buildMessage(p) {
    const label = (key) => t(`booking.message.${key}`);
    const lines = [
      t('booking.message.header', { name: loc(state.site.name) }),
      '',
      `${label('name')}: ${p.name}`,
      `${label('phone')}: ${formatPhone(p.phone)}`,
      `${label('service')}: ${p.service.name}`,
    ];
    if (p.master) lines.push(`${label('master')}: ${p.master.name}`);
    if (p.date) lines.push(`${label('date')}: ${formatDate(p.date)}`);
    if (p.time) lines.push(`${label('time')}: ${p.time}`);
    if (p.comment) lines.push(`${label('comment')}: ${p.comment}`);
    return lines.join('\n');
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
        document.body.append(area);
        area.select();
        const ok = document.execCommand('copy');
        area.remove();
        return ok;
      } catch {
        return false;
      }
    }
  }

  function setBusy(busy) {
    submitBtn.disabled = busy;
    submitBtn.querySelector('[data-i18n]').textContent = t(busy ? 'booking.sending' : 'booking.submit');
  }

  async function onSubmit(event) {
    event.preventDefault();
    clearAllErrors();

    const data = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, String(v).trim()]));
    if (data.website) return; // спрацювала пастка для ботів

    const errors = validate(data);
    const invalid = Object.keys(errors);
    if (invalid.length) {
      invalid.forEach((key) => setError(key, errors[key]));
      form.elements[invalid[0]].focus();
      return;
    }

    const payload = buildPayload(data);
    setBusy(true);
    try {
      const result = await api.createBooking(payload);
      if (result.mode === 'api') {
        form.reset();
        renderMasters();
        openModal(successView());
      } else {
        const text = buildMessage(payload);
        const copied = await copyText(text);
        openModal(messengerView(text, copied), (body) => {
          body.querySelector('[data-copy]')?.addEventListener('click', async (e) => {
            const ok = await copyText(text);
            e.currentTarget.querySelector('span:last-child').textContent =
              t(ok ? 'booking.messenger.copied' : 'booking.messenger.copyFail');
          });
        });
      }
    } catch (err) {
      console.error('[booking]', err);
      statusEl.textContent = t('booking.errors.network');
    } finally {
      setBusy(false);
    }
  }

  /* ---------- модальне вікно ---------- */

  function openModal(html, onReady) {
    modalBody.innerHTML = html;
    onReady?.(modalBody);
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
  }

  function successView() {
    return `
      <div class="modal__icon">${icon('check')}</div>
      <h3 id="modal-title">${esc(t('booking.success.title'))}</h3>
      <p>${esc(t('booking.success.text'))}</p>
      <div class="modal__actions">
        <button type="button" class="btn btn--primary" data-close>${esc(t('a11y.close'))}</button>
      </div>`;
  }

  function messengerView(text, copied) {
    const site = state.site;
    const m = site.messengers || {};
    const phone = site.phones?.[0];
    const buttons = [];

    if (m.telegram) {
      const user = encodeURIComponent(String(m.telegram).replace(/^@/, ''));
      buttons.push(`<a class="btn btn--primary" href="https://t.me/${user}" target="_blank" rel="noopener">${icon('telegram')}<span>Telegram</span></a>`);
    }
    if (m.viber) {
      buttons.push(`<a class="btn btn--primary" href="viber://chat?number=%2B${digits(m.viber)}">${icon('chat')}<span>Viber</span></a>`);
    }
    if (m.whatsapp) {
      buttons.push(`<a class="btn btn--primary" href="https://wa.me/${digits(m.whatsapp)}?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">${icon('chat')}<span>WhatsApp</span></a>`);
    }
    if (phone) {
      buttons.push(`<a class="btn btn--ghost" href="${esc(phoneHref(phone))}">${icon('phone')}<span>${esc(t('booking.messenger.call'))}</span></a>`);
    }
    buttons.push(`<button type="button" class="btn btn--ghost" data-copy>${icon('copy')}<span>${esc(t(copied ? 'booking.messenger.copied' : 'booking.messenger.copy'))}</span></button>`);

    return `
      <div class="modal__icon">${icon('coffee')}</div>
      <h3 id="modal-title">${esc(t('booking.messenger.title'))}</h3>
      <p>${esc(t(copied ? 'booking.messenger.text' : 'booking.messenger.textManual'))}</p>
      <pre class="modal__msg">${esc(text)}</pre>
      <div class="modal__actions">${buttons.join('')}</div>`;
  }

  A.booking = { initBooking, renderBookingOptions };
})(window.Arabica = window.Arabica || {});
