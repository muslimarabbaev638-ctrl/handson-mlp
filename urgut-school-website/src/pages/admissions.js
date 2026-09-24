import { html } from '../lib/html.js';
import { icon, button, sectionHead, pageHero, factBlock, flag } from '../components.js';

export function admissionsPage(ctx) {
  const s = ctx.school;
  const adm = s.admissions;
  const t = ctx.t;
  const portal = s.network.admissionsPortal;

  const body = html`
${pageHero(ctx, {
  eyebrow: ctx.L(s.name),
  title: t('admissions.title'),
  lead: t('admissions.lead'),
  actions: html`<div class="actions">${button(portal, t('admissions.cta'), { variant: 'gold', iconName: 'external', external: true })}</div>`,
})}

<section class="section section--flush-top">
  <div class="container narrow">
    <div class="notice" role="note">
      ${icon('shield', { size: 28, className: 'icon notice__icon' })}
      <div>
        <h2 class="notice__title">${t('admissions.noticeTitle')}</h2>
        <p>${t('admissions.notice')}</p>
        <p class="notice__warning">${icon('alert', { size: 18 })}<span>${t('admissions.fraud')}</span></p>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="who-title">
  <div class="container two-col">
    <div>
      ${sectionHead({ title: t('admissions.whoTitle'), id: 'who-title' })}
      <ul class="check-list">
        ${ctx.fact(adm.grades) && html`<li>${icon('check', { size: 18 })}<span>${ctx.L(ctx.fact(adm.grades))} ${flag(ctx, adm.grades)}</span></li>`}
        <li>${icon('check', { size: 18 })}<span>${t('admissions.classSize', { n: s.maxClassSize })}</span></li>
        <li>${icon('check', { size: 18 })}<span>${t('admissions.free')}</span></li>
      </ul>
      <h3>${t('admissions.examsTitle')}</h3>
      ${factBlock(ctx, adm.exams, (v) => html`<p>${ctx.L(v)}</p>`)}
      <h3>${t('admissions.datesTitle')}</h3>
      ${factBlock(ctx, adm.timeline, (v) => html`<p>${ctx.L(v)}</p>`)}
    </div>
    <div>
      <h2 id="steps-title">${t('admissions.stepsTitle')}</h2>
      <ol class="steps">
        ${[1, 2, 3, 4].map((n) => html`<li><span class="steps__num" aria-hidden="true">${n}</span><span>${t(`admissions.step${n}`)}</span></li>`)}
      </ol>
      <h3>${t('admissions.docsTitle')} ${flag(ctx, adm.documents)}</h3>
      ${factBlock(ctx, adm.documents, (list) => html`<ul class="doc-list">${list.map((d) => html`<li>${icon('doc', { size: 18 })}<span>${ctx.L(d)}</span></li>`)}</ul>`)}
      <p class="note">${t('admissions.docsNote')}</p>
    </div>
  </div>
</section>

<section class="section section--tint" aria-labelledby="faq-title">
  <div class="container narrow">
    ${sectionHead({ title: t('admissions.faqTitle'), id: 'faq-title' })}
    <div class="faq">
      ${adm.faq.map((item) => html`<details class="faq__item">
        <summary>${ctx.L(item.q)}</summary>
        <p>${ctx.L(item.a)}</p>
      </details>`)}
    </div>
  </div>
</section>

<section class="section section--navy cta-band">
  <div class="container cta-band__inner">
    <h2>${t('admissions.ctaTitle')}</h2>
    ${button(portal, t('admissions.cta'), { variant: 'gold', iconName: 'external', external: true })}
  </div>
</section>
`;

  return {
    id: 'admissions',
    section: 'admissions',
    path: '/admissions/',
    title: t('admissions.title'),
    description: t('meta.admissions'),
    body,
  };
}
