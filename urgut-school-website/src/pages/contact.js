import { html } from '../lib/html.js';
import { icon, button, sectionHead, pageHero, flag, personLine } from '../components.js';

export function contactPage(ctx) {
  const s = ctx.school;
  const c = s.contact;
  const t = ctx.t;
  const address = ctx.fact(s.address);
  const hours = ctx.fact(c.hours);
  const counselorEntry = s.leadership.find((p) => p.id === 'counselor');
  const counselor = counselorEntry && ctx.fact(counselorEntry.person);

  const body = html`
${pageHero(ctx, { eyebrow: ctx.L(s.name), title: t('contact.title'), lead: t('contact.lead') })}

<section class="section">
  <div class="container two-col two-col--wide-right">
    <div>
      <ul class="contact-list">
        ${address && html`<li>${icon('pin', { size: 22 })}<div><p class="contact-list__label">${t('fact.address')} ${flag(ctx, s.address)}</p><p>${ctx.L(address)}</p></div></li>`}
        <li>${icon('phone', { size: 22 })}<div><p class="contact-list__label">${t('fact.phone')}</p><p><a href="tel:${c.phone}">${c.phoneDisplay.replace(/ /g, '\u00a0')}</a></p></div></li>
        <li>${icon('mail', { size: 22 })}<div><p class="contact-list__label">${t('fact.email')}</p><p><a href="mailto:${c.email}">${c.email}</a></p></div></li>
        ${hours
          ? html`<li>${icon('clock', { size: 22 })}<div><p class="contact-list__label">${t('fact.hours')} ${flag(ctx, c.hours)}</p><p>${ctx.L(hours)}</p></div></li>`
          : ctx.draft && html`<li>${icon('clock', { size: 22 })}<div><p class="contact-list__label">${t('fact.hours')}</p>${flag(ctx, c.hours)}</div></li>`}
      </ul>
      <h2 class="h3">${t('contact.social')}</h2>
      <ul class="social social--labeled">
        ${s.social.map((x) => html`<li><a href="${x.url}" rel="noopener">${icon(x.id, { size: 20 })}<span>${x.label === x.handle ? x.label : `${x.label} ${x.handle}`}</span></a></li>`)}
      </ul>
    </div>
    <div>
      <h2 class="h3">${t('contact.map')}</h2>
      <div class="map">
        <iframe src="${s.maps.yandexEmbed}" title="${t('contact.mapTitle')}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
      <p class="map-links">
        <a href="${s.maps.yandex}" rel="noopener">${icon('external', { size: 16 })}${t('contact.openYandex')}</a>
        <a href="${s.maps.google}" rel="noopener">${icon('external', { size: 16 })}${t('contact.openGoogle')}</a>
      </p>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="container two-col">
    <div class="card" id="universities">
      ${icon('cap', { size: 24, className: 'icon card__icon' })}
      <h2 class="h3">${t('contact.uniTitle')}</h2>
      ${counselor
        ? html`<p>${t('contact.uniText')}</p><p class="person">${personLine(ctx, counselor)} ${flag(ctx, counselorEntry.person)}</p>`
        : html`<p>${t('contact.uniFallback', { email: c.email })}</p>${flag(ctx, counselorEntry?.person)}`}
    </div>
    <div class="card">
      ${icon('shield', { size: 24, className: 'icon card__icon' })}
      <h2 class="h3">${t('contact.admTitle')}</h2>
      <p>${t('contact.admText')}</p>
      ${button(s.network.admissionsPortal, t('admissions.cta'), { variant: 'primary', iconName: 'external', external: true })}
    </div>
  </div>
</section>
`;

  return {
    id: 'contact',
    section: 'contact',
    path: '/contact/',
    title: t('contact.title'),
    description: t('meta.contact'),
    body,
  };
}
