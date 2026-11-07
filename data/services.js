// Дані сайту. Коли з’явиться бекенд, вони прийдуть з API (див. js/config.js → endpoints).
(window.ARABICA_DATA = window.ARABICA_DATA || {}).services = [
  {
    "id": "hair",
    "icon": "scissors",
    "title": { "uk": "Перукарня", "en": "Hair salon" },
    "description": {
      "uk": "Стрижки, фарбування будь-якої складності, догляд і святкові зачіски для жінок, чоловіків і дітей.",
      "en": "Haircuts, colouring of any complexity, treatments and occasion styling for women, men and kids."
    },
    "items": [
      { "id": "hair-cut-women", "name": { "uk": "Жіноча стрижка", "en": "Women's haircut" }, "price": 500, "priceFrom": true, "duration": 60 },
      { "id": "hair-cut-men", "name": { "uk": "Чоловіча стрижка", "en": "Men's haircut" }, "price": 350, "duration": 45 },
      { "id": "hair-cut-kids", "name": { "uk": "Дитяча стрижка (до 12 років)", "en": "Kids' haircut (under 12)" }, "price": 300, "duration": 30 },
      { "id": "hair-color", "name": { "uk": "Фарбування в один тон", "en": "Single-tone colouring" }, "price": 1200, "priceFrom": true, "duration": 120 },
      { "id": "hair-color-complex", "name": { "uk": "Складне фарбування (AirTouch, балаяж, шатуш)", "en": "Complex colouring (AirTouch, balayage, shatush)" }, "price": 2800, "priceFrom": true, "duration": 240 },
      { "id": "hair-styling", "name": { "uk": "Укладка", "en": "Blow-dry & styling" }, "price": 450, "priceFrom": true, "duration": 45 },
      { "id": "hair-updo", "name": { "uk": "Вечірня або весільна зачіска", "en": "Evening or bridal updo" }, "price": 1200, "priceFrom": true, "duration": 90 },
      { "id": "hair-keratin", "name": { "uk": "Кератинове випрямлення", "en": "Keratin smoothing" }, "price": 2000, "priceFrom": true, "duration": 180 }
    ]
  },
  {
    "id": "nails",
    "icon": "polish",
    "title": { "uk": "Манікюр і педикюр", "en": "Manicure & pedicure" },
    "description": {
      "uk": "Апаратний і комбінований манікюр, стійке покриття гель-лаком, нарощування та дизайн.",
      "en": "E-file and combined manicure, long-lasting gel polish, extensions and nail art."
    },
    "items": [
      { "id": "nails-mani", "name": { "uk": "Манікюр без покриття", "en": "Manicure (no polish)" }, "price": 350, "duration": 45 },
      { "id": "nails-mani-gel", "name": { "uk": "Манікюр з покриттям гель-лак", "en": "Manicure with gel polish" }, "price": 600, "duration": 90 },
      { "id": "nails-extensions", "name": { "uk": "Нарощування нігтів", "en": "Nail extensions" }, "price": 900, "priceFrom": true, "duration": 150 },
      { "id": "nails-pedi-gel", "name": { "uk": "Педикюр з покриттям гель-лак", "en": "Pedicure with gel polish" }, "price": 750, "duration": 90 },
      { "id": "nails-men", "name": { "uk": "Чоловічий манікюр", "en": "Men's manicure" }, "price": 400, "duration": 45 },
      { "id": "nails-design", "name": { "uk": "Дизайн (1 ніготь)", "en": "Nail art (per nail)" }, "price": 30, "priceFrom": true }
    ]
  },
  {
    "id": "lashes",
    "icon": "lashes",
    "title": { "uk": "Вії", "en": "Lashes" },
    "description": {
      "uk": "Нарощування від класики до об’єму 3D, ламінування та фарбування для виразного погляду.",
      "en": "Extensions from classic to 3D volume, lash lift and tint for an expressive look."
    },
    "items": [
      { "id": "lashes-classic", "name": { "uk": "Нарощування вій — класика", "en": "Classic lash extensions" }, "price": 700, "duration": 120 },
      { "id": "lashes-volume", "name": { "uk": "Нарощування вій — об’єм 2D–3D", "en": "2D–3D volume lash extensions" }, "price": 850, "duration": 150 },
      { "id": "lashes-refill", "name": { "uk": "Корекція нарощених вій", "en": "Lash extension refill" }, "price": 550, "duration": 90 },
      { "id": "lashes-lift", "name": { "uk": "Ламінування вій", "en": "Lash lift" }, "price": 600, "duration": 60 },
      { "id": "lashes-removal", "name": { "uk": "Зняття вій", "en": "Lash removal" }, "price": 150, "duration": 20 }
    ]
  },
  {
    "id": "brows",
    "icon": "brows",
    "title": { "uk": "Брови", "en": "Brows" },
    "description": {
      "uk": "Архітектура, фарбування хною, ламінування та перманентний макіяж брів.",
      "en": "Brow shaping, henna tint, brow lamination and permanent makeup."
    },
    "items": [
      { "id": "brows-shape", "name": { "uk": "Корекція брів", "en": "Brow shaping" }, "price": 250, "duration": 30 },
      { "id": "brows-shape-tint", "name": { "uk": "Корекція і фарбування (фарба / хна)", "en": "Shaping & tint (dye / henna)" }, "price": 400, "duration": 45 },
      { "id": "brows-lamination", "name": { "uk": "Ламінування брів", "en": "Brow lamination" }, "price": 600, "duration": 60 },
      { "id": "brows-pmu", "name": { "uk": "Перманентний макіяж брів", "en": "Brow permanent makeup" }, "price": 3000, "priceFrom": true, "duration": 150 }
    ]
  },
  {
    "id": "lips",
    "icon": "lips",
    "medical": true,
    "title": { "uk": "Губи", "en": "Lips" },
    "description": {
      "uk": "Контурна пластика губ препаратами гіалуронової кислоти, перманентний макіяж і догляд.",
      "en": "Hyaluronic lip fillers, lip blush permanent makeup and lip care."
    },
    "items": [
      { "id": "lips-filler-05", "name": { "uk": "Контурна пластика губ (0,5 мл)", "en": "Lip filler (0.5 ml)" }, "price": 3200, "priceFrom": true, "duration": 45 },
      { "id": "lips-filler-1", "name": { "uk": "Контурна пластика губ (1 мл)", "en": "Lip filler (1 ml)" }, "price": 4500, "priceFrom": true, "duration": 60 },
      { "id": "lips-pmu", "name": { "uk": "Перманентний макіяж губ", "en": "Lip blush (permanent makeup)" }, "price": 3500, "priceFrom": true, "duration": 150 },
      { "id": "lips-care", "name": { "uk": "Доглядова процедура для губ", "en": "Lip care treatment" }, "price": 450, "duration": 30 }
    ]
  },
  {
    "id": "botox",
    "icon": "syringe",
    "medical": true,
    "title": { "uk": "Ботокс", "en": "Botox" },
    "description": {
      "uk": "Ботулінотерапія для розгладження мімічних зморшок: лоб, міжбрів’я, «гусячі лапки».",
      "en": "Botulinum therapy to smooth expression lines: forehead, frown lines, crow's feet."
    },
    "items": [
      { "id": "botox-consult", "name": { "uk": "Консультація лікаря-косметолога", "en": "Cosmetic doctor consultation" }, "price": 300, "duration": 30 },
      { "id": "botox-glabella", "name": { "uk": "Міжбрів’я", "en": "Frown lines (glabella)" }, "price": 3000, "priceFrom": true, "duration": 30 },
      { "id": "botox-forehead", "name": { "uk": "Лоб", "en": "Forehead" }, "price": 3500, "priceFrom": true, "duration": 30 },
      { "id": "botox-crows-feet", "name": { "uk": "«Гусячі лапки»", "en": "Crow's feet" }, "price": 3000, "priceFrom": true, "duration": 30 },
      { "id": "botox-upper-face", "name": { "uk": "Комплекс: верхня третина обличчя", "en": "Upper face package" }, "price": 7000, "priceFrom": true, "duration": 45 },
      { "id": "botox-hyperhidrosis", "name": { "uk": "Лікування гіпергідрозу (пахви)", "en": "Hyperhidrosis treatment (underarms)" }, "price": 8000, "priceFrom": true, "duration": 45 }
    ]
  },
  {
    "id": "skin",
    "icon": "sparkles",
    "medical": true,
    "title": { "uk": "Косметологія", "en": "Skincare" },
    "description": {
      "uk": "Чистки, пілінги, біоревіталізація та доглядові програми, підібрані під ваш тип шкіри.",
      "en": "Facials, peels, biorevitalisation and care programmes tailored to your skin type."
    },
    "items": [
      { "id": "skin-cleansing", "name": { "uk": "Комбінована чистка обличчя", "en": "Deep cleansing facial" }, "price": 1100, "duration": 90 },
      { "id": "skin-peel", "name": { "uk": "Хімічний пілінг", "en": "Chemical peel" }, "price": 900, "priceFrom": true, "duration": 45 },
      { "id": "skin-care", "name": { "uk": "Доглядова процедура за типом шкіри", "en": "Skin-type care facial" }, "price": 1000, "duration": 60 },
      { "id": "skin-biorevitalisation", "name": { "uk": "Біоревіталізація", "en": "Biorevitalisation" }, "price": 3000, "priceFrom": true, "duration": 45 },
      { "id": "skin-massage", "name": { "uk": "Масаж обличчя", "en": "Facial massage" }, "price": 700, "duration": 45 }
    ]
  },
  {
    "id": "makeup",
    "icon": "brush",
    "title": { "uk": "Макіяж", "en": "Makeup" },
    "description": {
      "uk": "Денний, вечірній і весільний макіяж, що тримається весь день і виглядає природно.",
      "en": "Day, evening and bridal makeup that lasts all day and looks natural."
    },
    "items": [
      { "id": "makeup-day", "name": { "uk": "Денний макіяж", "en": "Day makeup" }, "price": 900, "duration": 60 },
      { "id": "makeup-evening", "name": { "uk": "Вечірній макіяж", "en": "Evening makeup" }, "price": 1200, "duration": 75 },
      { "id": "makeup-bridal", "name": { "uk": "Весільний макіяж (з пробним)", "en": "Bridal makeup (with trial)" }, "price": 2500, "duration": 120 },
      { "id": "makeup-lesson", "name": { "uk": "Урок макіяжу «для себе»", "en": "Personal makeup lesson" }, "price": 1800, "duration": 150 }
    ]
  }
];
