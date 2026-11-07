(function (A) {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  /** Екранування для вставки даних у HTML (дані згодом прийдуть з адмінки). */
  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
  }

  /** Пропускає лише безпечні посилання: http(s), mailto, tel, viber або відносні шляхи. */
  function safeUrl(url) {
    const value = String(url ?? '').trim();
    if (!value) return '';
    if (/^(https?:|mailto:|tel:|viber:)/i.test(value)) return value;
    if (!/^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
    return '';
  }

  const digits = (value) => String(value ?? '').replace(/\D/g, '');

  /** +380000000000 → +380 00 000 00 00 */
  function formatPhone(phone) {
    const d = digits(phone);
    if (d.length === 12 && d.startsWith('380')) {
      return `+380 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}`;
    }
    return String(phone ?? '');
  }

  const phoneHref = (phone) => `tel:+${digits(phone)}`;

  /** Приводить номер до формату +380XXXXXXXXX, якщо це український номер. */
  function normalizePhone(phone) {
    const d = digits(phone);
    if (d.length === 10 && d.startsWith('0')) return `+38${d}`;
    if (d.length === 9) return `+380${d}`;
    return `+${d}`;
  }

  /** Сьогоднішня дата у форматі YYYY-MM-DD за місцевим часом. */
  function todayISO() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
  }

  A.utils = { $, $$, esc, safeUrl, digits, formatPhone, phoneHref, normalizePhone, todayISO };
})(window.Arabica = window.Arabica || {});
