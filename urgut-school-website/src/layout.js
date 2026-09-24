import { html, raw, render } from './lib/html.js';
import { LANGS, LANG_INFO } from './lib/i18n.js';
import { icon } from './components.js';

const NAV = ['about', 'academics', 'results', 'admissions', 'news', 'contact'];

/** Absolute URL of a site path (for canonical / hreflang / Open Graph). */
const abs = (ctx, path) => new URL(path, ctx.siteUrl).href;

function jsonLd(ctx) {
  const s = ctx.school;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'School',
    name: ctx.L(s.name),
    alternateName: LANGS.filter((l) => l !== ctx.lang).map((l) => ctx.Lin(s.name, l)),
    url: abs(ctx, ctx.url('/')),
    email: s.contact.email,
    telephone: s.contact.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: ctx.L(s.location.district),
      addressRegion: ctx.L(s.location.region),
      addressCountry: 'UZ',
    },
    geo: { '@type': 'GeoCoordinates', latitude: s.geo.lat, longitude: s.geo.lon },
    sameAs: s.social.map((x) => x.url),
  };
  const street = ctx.fact(s.address);
  if (street) data.address.streetAddress = ctx.L(street);
  const founded = ctx.fact(s.founded);
  if (founded) data.foundingDate = String(founded);
  // Escape "<" so the JSON can never close the script element.
  return raw(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
}

function head(ctx, page) {
  const s = ctx.school;
  const name = ctx.L(s.name);
  const title = page.id === 'home' ? `${name} — ${ctx.t('header.kicker')}` : `${page.title} — ${name}`;
  const canonical = abs(ctx, ctx.url(page.path));
  const og = abs(ctx, ctx.assets.ogImage.src);
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${page.description}">
${ctx.noindex && raw('<meta name="robots" content="noindex, nofollow">\n')}<link rel="canonical" href="${canonical}">
${LANGS.map((l) => html`<link rel="alternate" hreflang="${LANG_INFO[l].hreflang}" href="${abs(ctx, ctx.urlIn(l, page.path))}">\n`)}<link rel="alternate" hreflang="x-default" href="${abs(ctx, ctx.urlIn('uz', page.path))}">
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:site_name" content="${name}">
<meta property="og:title" content="${page.id === 'home' ? name : page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="${ctx.assets.ogImage.width}">
<meta property="og:image:height" content="${ctx.assets.ogImage.height}">
<meta property="og:locale" content="${LANG_INFO[ctx.lang].ogLocale}">
${LANGS.filter((l) => l !== ctx.lang).map((l) => html`<meta property="og:locale:alternate" content="${LANG_INFO[l].ogLocale}">\n`)}<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0b2a5b">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/brand/emblem.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
${ctx.assets.preloadFonts.map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>\n`)}<link rel="stylesheet" href="${ctx.assets.css}">
<script src="${ctx.assets.js}" defer></script>
${jsonLd(ctx)}
</head>`;
}

function langSwitch(ctx, page, modifier = '') {
  return html`<ul class="lang-switch${modifier}" aria-label="${ctx.t('lang.label')}">
        ${LANGS.map((l) => {
          const info = LANG_INFO[l];
          const current = l === ctx.lang;
          return html`<li><a href="${ctx.urlIn(l, page.path)}" hreflang="${info.hreflang}" lang="${info.hreflang}" title="${info.name}"${raw(current ? ' aria-current="true"' : '')}><span aria-hidden="true">${info.short}</span><span class="visually-hidden">${info.name}</span></a></li>`;
        })}
      </ul>`;
}

function header(ctx, page) {
  const s = ctx.school;
  return html`<header class="site-header">
  <div class="container site-header__bar">
    <a class="brand" href="${ctx.url('/')}">
      <img class="brand__mark" src="/brand/emblem.svg" alt="" width="48" height="48">
      <span class="brand__text">
        <span class="brand__kicker">${ctx.t('header.kicker')}</span>
        <span class="brand__name">${ctx.L(s.name)}</span>
      </span>
    </a>
    <div class="site-header__tools">
      ${langSwitch(ctx, page)}
      <a class="menu-toggle" href="#footer-nav" data-menu-toggle aria-controls="site-nav">
        ${icon('menu', { size: 24, className: 'icon menu-toggle__open' })}${icon('close', { size: 24, className: 'icon menu-toggle__close' })}
        <span class="menu-toggle__label">${ctx.t('header.menu')}</span>
      </a>
    </div>
  </div>
  <nav id="site-nav" class="site-nav" aria-label="${ctx.t('nav.main')}">
    <div class="container site-nav__inner">
      <ul class="site-nav__list">
        ${NAV.map((id) => {
          const current = page.section === id;
          return html`<li><a href="${ctx.url(`/${id}/`)}"${raw(current ? ' aria-current="page"' : '')}>${ctx.t(`nav.${id}`)}</a></li>`;
        })}
      </ul>
      <a class="site-nav__cta" href="${ctx.url('/profile/')}"${raw(page.section === 'profile' ? ' aria-current="page"' : '')}>${icon('cap', { size: 18 })}${ctx.t('header.profileCta')}</a>
      ${langSwitch(ctx, page, ' lang-switch--menu')}
    </div>
  </nav>
</header>`;
}

function footer(ctx, page) {
  const s = ctx.school;
  const c = s.contact;
  const address = ctx.fact(s.address);
  return html`<footer class="site-footer">
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      <p class="site-footer__name">${ctx.L(s.name)}</p>
      <p>${ctx.t('footer.blurb')}</p>
      <ul class="social">
        ${s.social.map((x) => html`<li><a href="${x.url}" rel="noopener" aria-label="${x.label}">${icon(x.id, { size: 20 })}</a></li>`)}
      </ul>
    </div>
    <nav id="footer-nav" aria-label="${ctx.t('footer.pages')}">
      <h2 class="site-footer__title">${ctx.t('footer.pages')}</h2>
      <ul>
        <li><a href="${ctx.url('/')}">${ctx.t('nav.home')}</a></li>
        ${NAV.map((id) => html`<li><a href="${ctx.url(`/${id}/`)}">${ctx.t(`nav.${id}`)}</a></li>`)}
        <li><a href="${ctx.url('/profile/')}">${ctx.t('nav.profile')}</a></li>
      </ul>
    </nav>
    <div>
      <h2 class="site-footer__title">${ctx.t('footer.contact')}</h2>
      <ul class="site-footer__contact">
        ${address && html`<li>${icon('pin', { size: 18 })}<span>${ctx.L(address)}</span></li>`}
        <li>${icon('phone', { size: 18 })}<a href="tel:${c.phone}">${c.phoneDisplay.replace(/ /g, '\u00a0')}</a></li>
        <li>${icon('mail', { size: 18 })}<a href="mailto:${c.email}">${c.email}</a></li>
      </ul>
    </div>
    <div>
      <h2 class="site-footer__title">${ctx.t('footer.official')}</h2>
      <ul>
        <li><a href="${s.network.url}" rel="noopener">${ctx.t('footer.piima')}</a></li>
        <li><a href="${s.network.admissionsPortal}" rel="noopener">${ctx.t('footer.portal')}</a></li>
      </ul>
    </div>
  </div>
  <div class="container site-footer__bottom">
    <p>© ${ctx.buildDate.getUTCFullYear()} ${ctx.L(s.name)}</p>
    <ul class="site-footer__langs" aria-label="${ctx.t('lang.label')}">
      ${LANGS.map((l) => html`<li><a href="${ctx.urlIn(l, page.path)}" hreflang="${LANG_INFO[l].hreflang}" lang="${LANG_INFO[l].hreflang}"${raw(l === ctx.lang ? ' aria-current="true"' : '')}>${LANG_INFO[l].name}</a></li>`)}
    </ul>
    <p>${ctx.t('footer.updated', { date: ctx.date(ctx.buildDate) })}</p>
  </div>
</footer>`;
}

export function layout(ctx, page) {
  return (
    '<!DOCTYPE html>\n' +
    render(html`<html lang="${LANG_INFO[ctx.lang].hreflang}">
${head(ctx, page)}
<body class="page-${page.id}${ctx.draft ? ' is-draft' : ''}">
<a class="skip-link" href="#main">${ctx.t('skip')}</a>
${ctx.draft && html`<div class="draft-banner" role="note">${ctx.t('draft.banner')}</div>`}
${header(ctx, page)}
<main id="main" tabindex="-1">
${page.body}
</main>
${footer(ctx, page)}
</body>
</html>
`)
  );
}
