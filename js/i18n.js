/**
 * Мультимовність.
 *  - Тексти інтерфейсу: i18n/<lang>.js, підставляються в елементи з атрибутами
 *    data-i18n (текст), data-i18n-html (розмітка), data-i18n-attr="attr:key;attr2:key2".
 *  - Контент (послуги, майстри…) зберігається в data/*.js як { "uk": "...", "en": "..." }
 *    і перекладається функцією loc().
 *  - Мова за замовчуванням — українська; вибір зберігається в localStorage і в ?lang=en.
 */
(function (A) {
  'use strict';

  const { CONFIG } = A;
  const STORAGE_KEY = 'arabica.lang';
  const listeners = new Set();
  const root = document.documentElement;

  let current = CONFIG.defaultLang;
  let dict = {};

  const isSupported = (lang) => CONFIG.languages.includes(lang);

  function detectLang() {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (isSupported(fromUrl)) return fromUrl;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isSupported(saved)) return saved;
    } catch { /* localStorage може бути недоступний */ }
    return CONFIG.defaultLang;
  }

  function getDictionary(lang) {
    return (window.ARABICA_I18N || {})[lang] || null;
  }

  const getLang = () => current;
  const getLocale = () => (current === 'uk' ? 'uk-UA' : 'en-GB');
  const onLangChange = (fn) => listeners.add(fn);

  const lookup = (key) => key.split('.').reduce((obj, part) => (obj == null ? undefined : obj[part]), dict);

  /** Переклад рядка інтерфейсу з підстановкою {змінних}. */
  function t(key, vars) {
    const value = lookup(key);
    if (typeof value !== 'string') return key;
    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
  }

  /** Переклад з урахуванням множини: 1 рік, 2 роки, 5 років. */
  function tp(key, n) {
    const forms = lookup(key);
    if (!forms || typeof forms !== 'object') return String(n);
    const rule = new Intl.PluralRules(current).select(n);
    return String(forms[rule] ?? forms.other ?? '').replace('{n}', n);
  }

  /** Локалізоване поле контенту: { uk: '…', en: '…' } → рядок поточною мовою. */
  function loc(field) {
    if (field == null) return '';
    if (typeof field !== 'object') return String(field);
    return field[current] ?? field[CONFIG.defaultLang] ?? Object.values(field)[0] ?? '';
  }

  function applyTranslations(scope = document) {
    scope.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    scope.querySelectorAll('[data-i18n-html]').forEach((el) => {
      el.innerHTML = t(el.dataset.i18nHtml); // лише з власних файлів перекладу
    });
    scope.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
    document.title = t('meta.title');
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
  }

  /** Перемикає мову. Повертає true, якщо словник знайдено. */
  function setLang(lang) {
    const target = isSupported(lang) ? lang : CONFIG.defaultLang;
    const loaded = getDictionary(target);

    if (!loaded) {
      console.error(`i18n: no dictionary for "${target}" (check i18n/${target}.js)`);
      if (target !== CONFIG.defaultLang) return setLang(CONFIG.defaultLang);
      root.classList.remove('i18n-pending');
      return false;
    }

    dict = loaded;
    current = target;
    root.lang = current;
    try { localStorage.setItem(STORAGE_KEY, current); } catch { /* ignore */ }

    try {
      const url = new URL(location.href);
      if (current === CONFIG.defaultLang) url.searchParams.delete('lang');
      else url.searchParams.set('lang', current);
      history.replaceState(history.state, '', url);
    } catch { /* деякі браузери не дозволяють міняти URL для file:// */ }

    applyTranslations();
    listeners.forEach((fn) => fn(current));
    root.classList.remove('i18n-pending');
    return true;
  }

  A.i18n = { detectLang, setLang, onLangChange, t, tp, loc, getLang, getLocale, applyTranslations };
})(window.Arabica = window.Arabica || {});
