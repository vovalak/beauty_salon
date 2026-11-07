/**
 * Конфігурація сайту.
 *
 * Сайт працює і з GitHub Pages, і просто з диска (подвійний клік по index.html):
 * дані та переклади підключаються звичайними <script> з папок /data та /i18n.
 *
 * Коли з’явиться бекенд з адмінкою — впишіть адреси API в `endpoints`,
 * наприклад: services: 'https://api.arabica.ua/v1/services'.
 * Якщо адреса null — використовуються дані з data/*.js.
 */
(function (A) {
  'use strict';

  A.CONFIG = {
    defaultLang: 'uk',
    languages: ['uk', 'en'],

    endpoints: {
      site: null,
      services: null,
      team: null,
      reviews: null,
      gallery: null,

      // POST-адреса для онлайн-запису. Поки null — заявка формується
      // і надсилається через месенджери / телефон (див. js/booking.js).
      booking: null,
    },
  };
})(window.Arabica = window.Arabica || {});
