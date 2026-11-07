/**
 * Шар доступу до даних. Решта коду працює лише через `Arabica.api`,
 * тож перехід зі статичних файлів на бекенд не зачепить інтерфейс.
 */
(function (A) {
  'use strict';

  const { CONFIG } = A;
  const cache = new Map();

  function getJSON(url) {
    if (!cache.has(url)) {
      const request = fetch(url, { headers: { Accept: 'application/json' } }).then((res) => {
        if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
        return res.json();
      });
      request.catch(() => cache.delete(url)); // дозволяємо повторну спробу після помилки
      cache.set(url, request);
    }
    return cache.get(url);
  }

  /** Дані з API, якщо його адресу задано, інакше — вбудовані з data/*.js. */
  function load(key) {
    const url = CONFIG.endpoints[key];
    if (url) return getJSON(url);
    const embedded = (window.ARABICA_DATA || {})[key];
    return embedded !== undefined
      ? Promise.resolve(embedded)
      : Promise.reject(new Error(`No data for "${key}": check data/${key}.js`));
  }

  A.api = {
    getSite: () => load('site'),
    getServices: () => load('services'),
    getTeam: () => load('team'),
    getReviews: () => load('reviews'),
    getGallery: () => load('gallery'),

    /**
     * Створити заявку на запис.
     * @returns {Promise<{mode: 'api', data: any} | {mode: 'messenger'}>}
     */
    async createBooking(payload) {
      if (!CONFIG.endpoints.booking) return { mode: 'messenger' };

      const res = await fetch(CONFIG.endpoints.booking, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`booking: HTTP ${res.status}`);
      return { mode: 'api', data: await res.json().catch(() => null) };
    },
  };
})(window.Arabica = window.Arabica || {});
