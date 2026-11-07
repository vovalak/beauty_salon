/** Лінійні SVG-іконки (24×24, stroke = currentColor). */
(function (A) {
  'use strict';

  const PATHS = {
    // послуги
    scissors: '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
    polish: '<rect x="9.5" y="2" width="5" height="6" rx="1"/><rect x="6" y="8" width="12" height="14" rx="3"/><path d="M9.5 12.5v5"/>',
    lashes: '<path d="M2.5 9.5c2.6 3.4 5.8 5 9.5 5s6.9-1.6 9.5-5"/><path d="M12 14.5V18"/><path d="m7.4 13.3-1.6 3.1"/><path d="m16.6 13.3 1.6 3.1"/><path d="M3.9 11.2 2 13.4"/><path d="m20.1 11.2 1.9 2.2"/>',
    brows: '<path d="M3 9.5c2.5-3 6-4.3 10-3.6 3 .5 5.8 2 8 4.1"/><path d="M5 15.5c2-2.2 4.4-3.3 7-3.3s5 1.1 7 3.3c-2 2.2-4.4 3.3-7 3.3s-5-1.1-7-3.3z"/><circle cx="12" cy="15.5" r="1.6"/>',
    lips: '<path d="M2 12.5c2.3-3.3 4.6-5 6.8-5 1.3 0 2.3.6 3.2 1.5.9-.9 1.9-1.5 3.2-1.5 2.2 0 4.5 1.7 6.8 5-2.6 3.3-5.9 5-10 5s-7.4-1.7-10-5z"/><path d="M2 12.5c3.2.8 6.5 1.2 10 1.2s6.8-.4 10-1.2"/>',
    syringe: '<path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/>',
    sparkles: '<path d="M12 3.5 13.8 8.2 18.5 10l-4.7 1.8L12 16.5l-1.8-4.7L5.5 10l4.7-1.8z"/><path d="m19 15.5.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z"/><path d="M5 3.5v3M3.5 5h3"/>',
    brush: '<path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/>',

    // інтерфейс
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.1"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    coffee: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M6 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',

    // соцмережі
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    telegram: '<path d="M21.5 4.5 2.6 11.8c-.8.3-.8 1.4 0 1.7l4.6 1.6 1.8 5.6c.2.7 1.1.9 1.6.4l2.6-2.5 4.7 3.5c.6.4 1.4.1 1.6-.6L22.9 5.8c.2-.9-.6-1.6-1.4-1.3Z"/><path d="m7.2 15.1 10-7.1-7.6 8.7"/>',
    tiktok: '<path d="M16 3c.4 2.6 2 4.3 4.5 4.6v3.1c-1.6 0-3.1-.5-4.5-1.4v6.2A5.5 5.5 0 1 1 10.5 10v3.2a2.4 2.4 0 1 0 2.4 2.3V3z"/>',
  };
  PATHS.viber = PATHS.chat;
  PATHS.whatsapp = PATHS.chat;

  function icon(name) {
    const paths = PATHS[name];
    if (!paths) return '';
    return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
  }

  /** Підставляє іконки в статичну розмітку: <span data-icon="clock"></span>. */
  function hydrateIcons(scope = document) {
    scope.querySelectorAll('[data-icon]').forEach((el) => {
      el.innerHTML = icon(el.dataset.icon);
    });
  }

  A.icons = { icon, hydrateIcons };
})(window.Arabica = window.Arabica || {});
