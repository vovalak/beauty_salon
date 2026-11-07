// Дані сайту. Коли з’явиться бекенд, вони прийдуть з API (див. js/config.js → endpoints).
// ЗАГЛУШКИ: замініть адресу, телефони, email, соцмережі та месенджери на справжні.
(window.ARABICA_DATA = window.ARABICA_DATA || {}).site = {
  "name": { "uk": "Арабіка", "en": "Arabica" },
  "tagline": { "uk": "салон краси", "en": "beauty salon" },
  "address": {
    "street": { "uk": "вул. Головна, 1", "en": "1 Holovna St" },
    "city": { "uk": "Чернівці", "en": "Chernivtsi" },
    "postalCode": "58000"
  },
  "mapQuery": "Головна вулиця, Чернівці",
  "geo": { "lat": 48.2915, "lng": 25.9403 },
  "phones": ["+380000000000"],
  "email": "hello@arabica.example",
  "hours": [
    {
      "days": { "uk": "Пн – Сб", "en": "Mon – Sat" },
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "20:00"
    },
    {
      "days": { "uk": "Нд", "en": "Sun" },
      "dayOfWeek": ["Sunday"],
      "opens": "10:00",
      "closes": "18:00"
    }
  ],
  "currency": "₴",
  "socials": [
    { "type": "instagram", "url": "https://www.instagram.com/" },
    { "type": "facebook", "url": "https://www.facebook.com/" },
    { "type": "telegram", "url": "https://t.me/" }
  ],
  "messengers": {
    "telegram": "",
    "viber": "+380000000000",
    "whatsapp": "+380000000000"
  },
  "booking": {
    "slotFrom": "09:00",
    "slotTo": "19:00",
    "slotStepMinutes": 30
  },
  "heroImage": null
};
