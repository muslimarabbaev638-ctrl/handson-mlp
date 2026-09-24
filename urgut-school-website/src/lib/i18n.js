import { ui } from '../../content/ui.js';

export const LANGS = ['uz', 'ru', 'en'];
export const DEFAULT_LANG = 'uz';

export const LANG_INFO = {
  uz: { name: 'Oʻzbekcha', short: 'UZ', prefix: '', hreflang: 'uz', ogLocale: 'uz_UZ' },
  ru: { name: 'Русский', short: 'RU', prefix: '/ru', hreflang: 'ru', ogLocale: 'ru_RU' },
  en: { name: 'English', short: 'EN', prefix: '/en', hreflang: 'en', ogLocale: 'en_US' },
};

const MONTHS = {
  uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
  ru: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

/**
 * Uzbek Latin uses ʻ (U+02BB) in oʻ / gʻ and ʼ (U+02BC) for the glottal stop.
 * Content can be typed with a plain apostrophe; this converts it.
 */
export function normalizeUz(text) {
  return String(text)
    .replace(/([OoGg])['‘’`ʼ]/g, '$1ʻ')
    .replace(/(\p{L})['‘’`](?=\p{L})/gu, '$1ʼ');
}

/** Keep number ranges like "5–11" on one line (U+2060 word joiner around the dash). */
function typeset(text) {
  return text.replace(/(\d)–(?=\d)/g, '$1\u2060–\u2060');
}

/** Resolve a value that may be localized ({ uz, ru, en }) to one language. */
export function L(value, lang) {
  if (value == null) return value;
  if (Array.isArray(value)) return value.map((v) => L(v, lang));
  if (typeof value === 'object' && LANGS.some((l) => l in value)) {
    const missing = LANGS.filter((l) => value[l] == null);
    if (missing.length) throw new Error(`Missing ${missing.join(', ')} translation in ${JSON.stringify(value).slice(0, 160)}`);
    const text = value[lang];
    if (typeof text !== 'string') return text;
    return typeset(lang === 'uz' ? normalizeUz(text) : text);
  }
  return value;
}

/** UI string lookup with {placeholder} substitution. Missing keys fail the build. */
export function t(key, lang, vars = {}) {
  const entry = ui[key];
  if (!entry || entry[lang] == null) throw new Error(`Missing UI string "${key}" for language "${lang}"`);
  let text = L(entry, lang);
  for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, String(v));
  return text;
}

/** Site-relative URL of a page in a language, e.g. url('ru', '/about/') -> '/ru/about/'. */
export function url(lang, path = '/') {
  return `${LANG_INFO[lang].prefix}${path}` || '/';
}

/** '2026-07' -> 'July 2026' / 'iyul, 2026' / 'июль 2026'. */
export function formatMonth(yyyyMm, lang) {
  const [y, m] = String(yyyyMm).split('-').map(Number);
  const month = MONTHS[lang][m - 1];
  if (lang === 'uz') return `${y}-yil, ${month}`;
  if (lang === 'ru') return `${month[0].toUpperCase()}${month.slice(1)} ${y}`;
  return `${month} ${y}`;
}

export function formatDate(date, lang) {
  const d = date.getUTCDate();
  const month = MONTHS[lang][date.getUTCMonth()];
  const y = date.getUTCFullYear();
  if (lang === 'uz') return `${y}-yil ${d}-${month}`;
  if (lang === 'ru') {
    const genitive = { январь: 'января', февраль: 'февраля', март: 'марта', апрель: 'апреля', май: 'мая', июнь: 'июня', июль: 'июля', август: 'августа', сентябрь: 'сентября', октябрь: 'октября', ноябрь: 'ноября', декабрь: 'декабря' };
    return `${d} ${genitive[month]} ${y} г.`;
  }
  return `${d} ${month} ${y}`;
}

/** Academic year label for a date: Sept 2026 -> '2026–2027'. */
export function academicYear(date) {
  const y = date.getUTCFullYear();
  return date.getUTCMonth() >= 7 ? `${y}–${y + 1}` : `${y - 1}–${y}`;
}
