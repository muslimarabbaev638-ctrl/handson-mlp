import { html, raw, isEmptyHtml } from './lib/html.js';
import { factState, factNote, factValue } from './lib/facts.js';

// ── Icons (24×24, stroke = currentColor) ────────────────────────────────────
const ICON_PATHS = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  print: '<path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M7 14h10v7H7z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="m5 12 4 4 10-10"/>',
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17.5v.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  doc: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>',
  cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6"/>',
  math: '<path d="M18 6V4H6l6 8-6 8h12v-2"/>',
  physics: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
  chemistry: '<path d="M9 3h6M10 3v6L4.5 18.5A1.8 1.8 0 0 0 6 21h12a1.8 1.8 0 0 0 1.5-2.5L14 9V3M7 15h10"/>',
  biology: '<path d="M5 19c0-9 6-14 15-15-1 9-6 15-15 15z"/><path d="M5 19l8-8"/>',
  it: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M10 8.5 8 10.5l2 2M14 8.5l2 2-2 2"/>',
  telegram: '<path d="M21 4 3 11l6 2 2 6 3-4 5 4z"/><path d="m9 13 12-9"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6"/>',
  facebook: '<path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z"/>',
};

export function icon(name, { size = 20, className = 'icon' } = {}) {
  return raw(
    `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON_PATHS[name]}</svg>`,
  );
}

// ── Draft-mode flags ────────────────────────────────────────────────────────
const FLAG_KEY = { todo: 'draft.missing', draft: 'draft.draft', verify: 'draft.verify' };

/** Coloured tag shown next to unconfirmed facts — only in draft builds. */
export function flag(ctx, x) {
  const state = factState(x);
  if (!ctx.draft || state === 'ok') return '';
  return html`<span class="flag flag--${state}" title="${factNote(x)}">${ctx.t(FLAG_KEY[state])}</span>`;
}

/** Placeholder box for a missing block (draft builds only). */
export function missingBox(ctx, x) {
  if (!ctx.draft) return '';
  return html`<div class="missing-box">${flag(ctx, x)}<p>${factNote(x)}</p></div>`;
}

/**
 * Render a block that depends on a fact. `render(value)` returns html.
 * - value available (plain / verify / draft-in-draft-mode): rendered (+ flag in draft mode)
 * - otherwise: nothing in production, a placeholder box in draft builds.
 */
export function factBlock(ctx, x, render) {
  const value = factValue(x, ctx.draft);
  if (value === undefined || value === null) return missingBox(ctx, x);
  const inner = render(value);
  if (!ctx.draft || factState(x) === 'ok') return inner;
  return html`<div class="flagged flagged--${factState(x)}">${flag(ctx, x)}${inner}</div>`;
}

/** True if a fact (or html) will produce visible output in this build. */
export function hasFact(ctx, x) {
  const value = factValue(x, ctx.draft);
  return value !== undefined && value !== null;
}

// ── Definition-list of facts ────────────────────────────────────────────────
/**
 * rows: [{ label, value }] where value is a plain value, a fact marker, or html.
 * `format(v)` optionally turns the resolved value into html.
 */
export function factList(ctx, rows, { className = 'facts' } = {}) {
  const items = rows
    .map(({ label, value, format }) => {
      const state = factState(value);
      const resolved = factValue(value, ctx.draft);
      if (resolved === undefined || resolved === null || resolved === '') {
        if (!ctx.draft || state === 'ok') return '';
        return html`<div class="facts__row facts__row--missing"><dt>${label}</dt><dd>${flag(ctx, value)}</dd></div>`;
      }
      const shown = format ? format(resolved) : ctx.L(resolved);
      return html`<div class="facts__row"><dt>${label}</dt><dd>${shown} ${flag(ctx, value)}</dd></div>`;
    })
    .filter((row) => !isEmptyHtml(row));
  if (!items.length) return '';
  return html`<dl class="${className}">${items}</dl>`;
}

// ── Layout helpers ──────────────────────────────────────────────────────────
export function pageHero(ctx, { eyebrow, title, lead, actions }) {
  return html`<section class="page-hero">
  <div class="container page-hero__inner">
    ${eyebrow && html`<p class="eyebrow eyebrow--light">${eyebrow}</p>`}
    <h1>${title}</h1>
    ${lead && html`<p class="lead">${lead}</p>`}
    ${actions}
  </div>
</section>`;
}

export function sectionHead({ eyebrow, title, id, intro, level = 2 }) {
  const heading = level === 2 ? html`<h2 id="${id}">${title}</h2>` : html`<h3 id="${id}">${title}</h3>`;
  return html`<div class="section-head">
  ${eyebrow && html`<p class="eyebrow">${eyebrow}</p>`}
  ${heading}
  ${intro && html`<p class="section-intro">${intro}</p>`}
</div>`;
}

export function button(href, label, { variant = 'primary', iconName = 'arrow', external = false } = {}) {
  return html`<a class="btn btn--${variant}" href="${href}"${external ? raw(' rel="noopener"') : ''}>${label}${iconName && icon(iconName, { size: 18 })}</a>`;
}

/** Responsive photo from photos/<name>.*, or '' if that photo was not provided. */
export function photo(ctx, name, { sizes = '100vw', className = '', eager = false } = {}) {
  const img = ctx.photos[name];
  if (!img) return '';
  const alt = ctx.L(ctx.school.photos[name]?.alt ?? '');
  return html`<img class="${className}" src="${img.src}" srcset="${img.srcset}" sizes="${sizes}" width="${img.width}" height="${img.height}" alt="${alt}"${raw(eager ? ' fetchpriority="high"' : ' loading="lazy"')} decoding="async">`;
}

export function personLine(ctx, person) {
  const p = typeof person === 'string' ? { name: person } : person;
  return html`<span class="person__name">${ctx.L(p.name)}</span>${p.email && html`<a class="person__link" href="mailto:${p.email}">${p.email}</a>`}${p.phone && html`<a class="person__link" href="tel:${p.phone.replace(/[^+\d]/g, '')}">${p.phone}</a>`}`;
}

export function newsCard(ctx, post, { headingLevel = 3 } = {}) {
  const href = ctx.url(`/news/${post.slug}/`);
  const title = ctx.L(post.title);
  return html`<article class="news-card">
  <p class="news-card__meta"><span class="tag">${ctx.L(post.tag)}</span><time datetime="${post.date}">${ctx.month(post.date)}</time></p>
  ${headingLevel === 2 ? html`<h2 class="news-card__title"><a href="${href}">${title}</a></h2>` : html`<h3 class="news-card__title"><a href="${href}">${title}</a></h3>`}
  <p>${ctx.L(post.summary)}</p>
</article>`;
}
