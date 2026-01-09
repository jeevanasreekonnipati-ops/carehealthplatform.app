const LANG_STORAGE_KEY = 'lang';

async function loadLang(lang) {
  const res = await fetch(`/i18n/${lang}.json`);
  const dict = await res.json();
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  // placeholders
  document.querySelectorAll('[data-placeholder-i18n]').forEach(el => {
    const key = el.getAttribute('data-placeholder-i18n');
    if (dict[key]) el.setAttribute('placeholder', dict[key]);
  });
}

function initLang() {
  const select = document.getElementById('lang-select');
  const stored = localStorage.getItem(LANG_STORAGE_KEY) || 'en';
  if (select) select.value = stored;
  loadLang(stored);
  if (select) {
    select.addEventListener('change', (e) => {
      const lang = e.target.value;
      localStorage.setItem(LANG_STORAGE_KEY, lang);
      loadLang(lang);
    });
  }
}

document.addEventListener('DOMContentLoaded', initLang);
