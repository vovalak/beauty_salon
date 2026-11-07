(function (A) {
  'use strict';

  const { api } = A;
  const { detectLang, setLang, onLangChange, t, tp, loc, getLang, getLocale } = A.i18n;
  const { icon, hydrateIcons } = A.icons;
  const { $, $$, esc, safeUrl, formatPhone, phoneHref } = A.utils;
  const { initBooking, renderBookingOptions } = A.booking;

  const state = {
    site: {},
    categories: [],
    team: [],
    reviews: [],
    gallery: [],
    activeCategory: null,
  };

  const SOCIAL_LABELS = {
    instagram: 'Instagram', facebook: 'Facebook', telegram: 'Telegram',
    tiktok: 'TikTok', viber: 'Viber', whatsapp: 'WhatsApp',
  };

  /* ================= дані ================= */

  async function loadData() {
    const sources = {
      site: [api.getSite, {}],
      categories: [api.getServices, []],
      team: [api.getTeam, []],
      reviews: [api.getReviews, []],
      gallery: [api.getGallery, []],
    };
    const keys = Object.keys(sources);
    const results = await Promise.allSettled(keys.map((k) => sources[k][0]()));
    results.forEach((res, i) => {
      const key = keys[i];
      if (res.status === 'fulfilled') state[key] = res.value ?? sources[key][1];
      else console.error(`[data] ${key}:`, res.reason);
    });
  }

  /* ================= форматування ================= */

  function formatPrice(value) {
    const amount = new Intl.NumberFormat(getLocale()).format(value);
    return `${amount} ${state.site.currency || '₴'}`;
  }

  function formatDuration(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return [h && `${h} ${t('units.h')}`, m && `${m} ${t('units.min')}`].filter(Boolean).join(' ');
  }

  const addressLine = () => {
    const a = state.site.address || {};
    return [loc(a.street), loc(a.city)].filter(Boolean).join(', ');
  };
  const mapQuery = () => state.site.mapQuery || addressLine();

  /* ================= рендер ================= */

  function renderAll() {
    fillSiteFields();
    renderServices();
    renderPrices();
    renderTeam();
    renderGallery();
    renderReviews();
    renderContacts();
    renderBookingOptions();
    renderSchema();
  }

  function fillSiteFields() {
    const s = state.site;
    const phone = s.phones?.[0];

    $$('[data-site="name"]').forEach((el) => { if (s.name) el.textContent = loc(s.name); });
    $$('[data-site="tagline"]').forEach((el) => { if (s.tagline) el.textContent = loc(s.tagline); });
    $$('[data-site="phone"]').forEach((el) => {
      if (!phone) return;
      el.href = phoneHref(phone);
      el.textContent = formatPhone(phone);
    });
    $$('[data-stat="categories"]').forEach((el) => {
      if (state.categories.length) el.textContent = state.categories.length;
    });

    const arch = $('#hero-arch');
    const hero = safeUrl(s.heroImage);
    if (arch && hero) {
      arch.style.backgroundImage = `url("${encodeURI(hero)}")`;
      arch.classList.add('arch--photo');
    }
  }

  function renderServices() {
    const grid = $('#services-grid');
    if (!state.categories.length) return;

    grid.innerHTML = state.categories.map((c) => {
      const prices = (c.items || []).map((i) => i.price).filter(Number.isFinite);
      const min = prices.length ? Math.min(...prices) : null;
      return `
        <article class="service-card">
          <div class="service-card__icon">${icon(c.icon)}</div>
          <h3 class="service-card__title">${esc(loc(c.title))}</h3>
          <p class="service-card__text">${esc(loc(c.description))}</p>
          <div class="service-card__foot">
            ${min != null ? `<span class="service-card__price">${esc(t('services.from'))} ${esc(formatPrice(min))}</span>` : '<span></span>'}
            <a class="link-arrow" href="#prices" data-category="${esc(c.id)}">${esc(t('services.prices'))} ${icon('arrow')}</a>
          </div>
        </article>`;
    }).join('');
  }

  function renderPrices() {
    const tabs = $('#prices-tabs');
    const cats = state.categories;
    if (!cats.length) return;
    if (!cats.some((c) => c.id === state.activeCategory)) state.activeCategory = cats[0].id;

    tabs.innerHTML = cats.map((c) => {
      const selected = c.id === state.activeCategory;
      return `
        <button type="button" class="tab" role="tab" id="tab-${esc(c.id)}" data-tab="${esc(c.id)}"
          aria-controls="prices-panel" aria-selected="${selected}" tabindex="${selected ? 0 : -1}">
          ${icon(c.icon)}<span>${esc(loc(c.title))}</span>
        </button>`;
    }).join('');
    renderPricePanel();
  }

  function renderPricePanel() {
    const panel = $('#prices-panel');
    const cat = state.categories.find((c) => c.id === state.activeCategory);
    if (!cat) return;

    panel.setAttribute('aria-labelledby', `tab-${cat.id}`);
    panel.innerHTML = `
      ${cat.medical ? `<p class="note">${icon('shield')}<span>${esc(t('services.medicalNote'))}</span></p>` : ''}
      <ul class="price-list">
        ${(cat.items || []).map((item) => `
          <li class="price-item">
            <span class="price-item__name">${esc(loc(item.name))}</span>
            <span class="price-item__meta">${item.duration ? esc(formatDuration(item.duration)) : ''}</span>
            <span class="price-item__price">${item.priceFrom ? `<small>${esc(t('prices.from'))}</small>` : ''}${esc(formatPrice(item.price))}</span>
            <a class="price-item__book" href="#booking" data-book="${esc(item.id)}"
               aria-label="${esc(t('prices.bookAria', { name: loc(item.name) }))}" title="${esc(t('nav.book'))}">${icon('calendar')}</a>
          </li>`).join('')}
      </ul>`;
  }

  function selectCategory(id, { focus = false } = {}) {
    if (!state.categories.some((c) => c.id === id)) return;
    state.activeCategory = id;
    const tabs = $('#prices-tabs');
    $$('[data-tab]', tabs).forEach((btn) => {
      const on = btn.dataset.tab === id;
      btn.setAttribute('aria-selected', String(on));
      btn.tabIndex = on ? 0 : -1;
      if (on) {
        if (focus) btn.focus();
        // прокрутка вкладок по горизонталі (мобільні), без вертикального стрибка сторінки
        tabs.scrollTo({ left: btn.offsetLeft - (tabs.clientWidth - btn.offsetWidth) / 2, behavior: 'smooth' });
      }
    });
    renderPricePanel();
  }

  function renderTeam() {
    const section = $('#team');
    section.hidden = !state.team.length;
    $('#team-grid').innerHTML = state.team.map((m) => {
      const name = loc(m.name);
      const initials = name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('');
      const photo = safeUrl(m.photo);
      return `
        <article class="member">
          <div class="member__photo">
            ${photo
              ? `<img src="${esc(photo)}" alt="${esc(name)}" loading="lazy">`
              : `<span class="member__initials" aria-hidden="true">${esc(initials)}</span>`}
          </div>
          <h3 class="member__name">${esc(name)}</h3>
          <p class="member__role">${esc(loc(m.role))}</p>
          ${m.experience ? `<p class="member__exp">${esc(tp('team.years', m.experience))}</p>` : ''}
        </article>`;
    }).join('');
  }

  function renderGallery() {
    const items = state.gallery.filter((g) => safeUrl(g.src));
    $('#gallery').hidden = !items.length;
    $('#gallery-grid').innerHTML = items.map((g) => `
      <figure class="gallery__item">
        <img src="${esc(safeUrl(g.src))}" alt="${esc(loc(g.alt))}" loading="lazy">
      </figure>`).join('');
  }

  function renderReviews() {
    $('#reviews').hidden = !state.reviews.length;
    $('#reviews-grid').innerHTML = state.reviews.map((r) => {
      const rating = Math.max(0, Math.min(5, Number(r.rating) || 5));
      return `
        <figure class="review">
          <div class="review__stars" role="img" aria-label="${esc(t('reviews.rating', { n: rating }))}">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</div>
          <blockquote class="review__text">${esc(loc(r.text))}</blockquote>
          <figcaption class="review__author">${esc(loc(r.author))}
            ${r.service ? `<span class="review__service">${esc(loc(r.service))}</span>` : ''}
          </figcaption>
        </figure>`;
    }).join('');
  }

  function contactList(kinds) {
    const s = state.site;
    const row = (iconName, label, body) => `
      <li>
        <span class="contact-list__icon">${icon(iconName)}</span>
        <div class="contact-list__body"><span class="contact-list__label">${esc(label)}</span>${body}</div>
      </li>`;

    const builders = {
      address: () => s.address && row('pin', t('contacts.address'), `
        <span class="contact-list__value">${esc(addressLine())}</span>
        <a class="link-arrow" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery())}" target="_blank" rel="noopener">${esc(t('contacts.route'))} ${icon('arrow')}</a>`),
      phone: () => s.phones?.length && row('phone', t('contacts.phone'),
        s.phones.map((p) => `<a class="contact-list__value" href="${esc(phoneHref(p))}">${esc(formatPhone(p))}</a>`).join('')),
      hours: () => s.hours?.length && row('clock', t('contacts.hours'),
        s.hours.map((h) => `<span class="hours-row"><span>${esc(loc(h.days))}</span><span>${esc(h.opens)}–${esc(h.closes)}</span></span>`).join('')),
      email: () => s.email && row('mail', t('contacts.email'),
        `<a class="contact-list__value" href="mailto:${esc(s.email)}">${esc(s.email)}</a>`),
    };
    return `<ul class="contact-list">${kinds.map((k) => builders[k]?.() || '').join('')}</ul>`;
  }

  function socialsHtml() {
    const list = (state.site.socials || []).filter((x) => safeUrl(x.url));
    if (!list.length) return '';
    return `<div class="socials">${list.map((x) => `
      <a href="${esc(safeUrl(x.url))}" target="_blank" rel="noopener" aria-label="${esc(SOCIAL_LABELS[x.type] || x.type)}">${icon(x.type) || icon('chat')}</a>`).join('')}
    </div>`;
  }

  function renderContacts() {
    const s = state.site;
    $('#contacts-info').innerHTML = contactList(['address', 'phone', 'hours', 'email']);
    $('#contacts-socials').innerHTML = socialsHtml();
    $('#footer-socials').innerHTML = socialsHtml();
    $('#booking-contacts').innerHTML = contactList(['phone', 'hours']);
    $('#footer-address').textContent = addressLine();

    const map = $('#map');
    const query = mapQuery();
    if (query) {
      const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&hl=${getLang()}&output=embed`;
      if (map.getAttribute('src') !== src) map.setAttribute('src', src);
      map.title = t('contacts.mapTitle', { name: loc(s.name) });
    }
  }

  /** Структуровані дані для Google (schema.org/BeautySalon). */
  function renderSchema() {
    const s = state.site;
    if (!s.name) return;
    const data = {
      '@context': 'https://schema.org',
      '@type': 'BeautySalon',
      name: loc(s.name),
      description: t('meta.description'),
      url: location.origin + location.pathname,
      telephone: s.phones?.[0],
      email: s.email || undefined,
      priceRange: '₴₴',
      address: {
        '@type': 'PostalAddress',
        streetAddress: loc(s.address?.street),
        addressLocality: loc(s.address?.city),
        postalCode: s.address?.postalCode,
        addressCountry: 'UA',
      },
      geo: s.geo ? { '@type': 'GeoCoordinates', latitude: s.geo.lat, longitude: s.geo.lng } : undefined,
      openingHoursSpecification: (s.hours || []).filter((h) => h.dayOfWeek).map((h) => ({
        '@type': 'OpeningHoursSpecification', dayOfWeek: h.dayOfWeek, opens: h.opens, closes: h.closes,
      })),
      sameAs: (s.socials || []).map((x) => x.url).filter((u) => /^https?:\/\/.+\/.+/.test(u || '')),
    };
    let el = $('#ld-json');
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = 'ld-json';
      document.head.append(el);
    }
    el.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  }

  /* ================= інтерактив ================= */

  function initHeader() {
    const header = $('#header');
    const nav = $('#nav');
    const burger = $('#burger');

    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const setMenu = (open) => {
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('no-scroll', open);
    };
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

    $$('[data-lang]').forEach((btn) => btn.addEventListener('click', () => setLang(btn.dataset.lang)));
  }

  function syncLangButtons(lang) {
    $$('[data-lang]').forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)));
  }

  function initPrices() {
    const tabs = $('#prices-tabs');
    tabs.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-tab]');
      if (btn) selectCategory(btn.dataset.tab);
    });
    tabs.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      const all = $$('[data-tab]', tabs);
      const i = all.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      let next = i + (e.key === 'ArrowRight' ? 1 : -1);
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = all.length - 1;
      selectCategory(all[(next + all.length) % all.length].dataset.tab, { focus: true });
    });
    // «Ціни →» на картці послуги відкриває відповідну вкладку прайсу
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-category]');
      if (link) selectCategory(link.dataset.category);
    });
  }

  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    const links = new Map($$('.nav__list a[href^="#"]').map((a) => [a.getAttribute('href').slice(1), a]));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove('is-active'));
        links.get(entry.target.id)?.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  function initReveal() {
    const items = $$('.reveal');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => observer.observe(el));
  }

  /* ================= старт ================= */

  async function main() {
    hydrateIcons();
    initHeader();
    initPrices();
    initScrollSpy();
    initReveal();
    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

    await loadData();

    initBooking(state);
    onLangChange((current) => {
      syncLangButtons(current);
      renderAll();
    });
    const ok = setLang(detectLang());
    if (!ok) renderAll(); // словник не знайдено — показуємо хоча б дані
  }

  main();
})(window.Arabica = window.Arabica || {});
