import { html, render } from '../lib/html.js';
import { LANGS, LANG_INFO, t, url, L } from '../lib/i18n.js';
import { school } from '../../content/school.js';

// One static 404 page in all three languages (hosts serve /404.html for any
// unknown address, whatever the language).
export function notFoundHtml({ css }) {
  const name = L(school.name, 'en');
  return (
    '<!DOCTYPE html>\n' +
    render(html`<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 — ${name}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/brand/emblem.svg" type="image/svg+xml">
<link rel="stylesheet" href="${css}">
</head>
<body class="page-404">
<main class="notfound">
  <img src="/brand/emblem.svg" alt="" width="72" height="72">
  <p class="notfound__code">404</p>
  ${LANGS.map((lang) => html`<section class="notfound__lang" lang="${LANG_INFO[lang].hreflang}">
    <h1>${t('notfound.title', lang)}</h1>
    <p>${t('notfound.text', lang)}</p>
    <p><a class="btn btn--primary btn--sm" href="${url(lang, '/')}">${t('notfound.home', lang)}</a></p>
  </section>`)}
</main>
</body>
</html>
`)
  );
}
