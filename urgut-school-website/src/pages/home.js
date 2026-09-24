import { html } from '../lib/html.js';
import { icon, button, photo, sectionHead, newsCard, flag } from '../components.js';

export function homePage(ctx) {
  const s = ctx.school;
  const t = ctx.t;
  const cls = s.results.classes[0];
  const graduates = ctx.fact(cls.graduates);
  const certified = ctx.fact(cls.certified);
  const heroImg = photo(ctx, 'hero', { className: 'hero__img', eager: true });
  const missionImg = photo(ctx, 'students', { className: 'band__img', sizes: '(min-width: 900px) 40vw, 100vw' });
  const topIelts = Math.max(...cls.testHighlights.ielts);
  const topSat = Math.max(...cls.testHighlights.sat);

  const body = html`
<section class="hero${heroImg ? ' hero--photo' : ''}">
  ${heroImg && html`<div class="hero__media">${heroImg}</div>`}
  <div class="container hero__inner">
    <p class="eyebrow eyebrow--light">${t('home.eyebrow')}</p>
    <h1 class="hero__title">${t('home.title')}</h1>
    <p class="hero__lead">${t('home.lead', { n: s.maxClassSize })}</p>
    <div class="actions">
      ${button(ctx.url('/profile/'), t('home.ctaProfile'), { variant: 'gold' })}
      ${button(ctx.url('/admissions/'), t('home.ctaAdmissions'), { variant: 'ghost-light' })}
    </div>
  </div>
</section>

<section class="glance" aria-labelledby="glance-title">
  <div class="container">
    <h2 id="glance-title" class="visually-hidden">${t('home.glance')}</h2>
    <ul class="glance__list">
      <li><span class="glance__value">${s.grades}</span><span class="glance__label">${t('home.glanceGrades')}</span></li>
      <li><span class="glance__value">${s.maxClassSize}</span><span class="glance__label">${t('home.glanceClass')}</span></li>
      <li><span class="glance__value">${t('home.glanceFreeValue')}</span><span class="glance__label">${t('home.glanceFreeLabel')}</span></li>
      ${graduates && certified && html`<li><span class="glance__value">${certified}<span class="glance__of">/${graduates}</span></span><span class="glance__label">${t('home.glanceCert', { year: cls.year })} ${flag(ctx, cls.certified)}</span></li>`}
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="focus-title">
  <div class="container split">
    <div class="split__text">
      ${sectionHead({ eyebrow: t('home.focusEyebrow'), title: t('home.focusTitle'), id: 'focus-title' })}
      <p class="prose-lead">${ctx.L(s.specialization.text)}</p>
      ${button(ctx.url('/academics/'), t('nav.academics'), { variant: 'text' })}
    </div>
    <ul class="subject-grid">
      ${s.specialization.subjects.map((sub) => html`<li class="subject"><span class="subject__icon">${icon(sub.id, { size: 26 })}</span><span class="subject__name">${ctx.L(sub.name)}</span></li>`)}
    </ul>
  </div>
</section>

<section class="band" aria-labelledby="mission-title">
  <div class="container band__inner${missionImg ? ' band__inner--photo' : ''}">
    <div>
      <p class="eyebrow eyebrow--light">${t('home.missionEyebrow')}</p>
      <h2 id="mission-title" class="band__quote">${ctx.L(s.mission)}</h2>
    </div>
    ${missionImg && html`<div class="band__media">${missionImg}</div>`}
  </div>
</section>

<section class="section section--tint" aria-labelledby="results-title">
  <div class="container">
    ${sectionHead({ eyebrow: t('home.resultsEyebrow'), title: t('common.classOf', { year: cls.year }), id: 'results-title' })}
    <div class="results-grid">
      ${graduates && certified && html`<div class="stat-card">
        <p class="stat-card__value">${certified}<span> / ${graduates}</span></p>
        <p>${t('home.resultsCertified', { n: certified, total: graduates })} ${flag(ctx, cls.certified)}</p>
      </div>`}
      <div class="stat-card">
        <p class="stat-card__label">${t('home.resultsTop')}</p>
        <p class="score-pair"><span class="score"><span class="score__name">IELTS</span><span class="score__value">${topIelts.toFixed(1)}</span></span><span class="score"><span class="score__name">SAT</span><span class="score__value">${topSat}</span></span></p>
      </div>
      <div class="stat-card">
        <p class="stat-card__label">${t('home.resultsOffers')}</p>
        <ul class="plain-list">
          ${cls.offers.slice(0, 4).map((o) => html`<li>${o.name}</li>`)}
        </ul>
      </div>
    </div>
    ${button(ctx.url('/results/'), t('home.resultsLink'), { variant: 'text' })}
  </div>
</section>

<section class="section" aria-label="${t('home.uniEyebrow')} / ${t('home.familyEyebrow')}">
  <div class="container audience">
    <article class="audience__card audience__card--navy">
      ${icon('cap', { size: 30, className: 'icon audience__icon' })}
      <p class="eyebrow eyebrow--light">${t('home.uniEyebrow')}</p>
      <h2>${t('home.uniTitle')}</h2>
      <p>${t('home.uniText')}</p>
      ${button(ctx.url('/profile/'), t('home.uniCta'), { variant: 'gold' })}
    </article>
    <article class="audience__card">
      ${icon('shield', { size: 30, className: 'icon audience__icon' })}
      <p class="eyebrow">${t('home.familyEyebrow')}</p>
      <h2>${t('home.familyTitle')}</h2>
      <p>${t('home.familyText')}</p>
      ${button(ctx.url('/admissions/'), t('home.familyCta'), { variant: 'primary' })}
    </article>
  </div>
</section>

${ctx.news.length > 0 && html`<section class="section section--tint" aria-labelledby="news-title">
  <div class="container">
    <div class="section-head section-head--row">
      <h2 id="news-title">${t('home.newsTitle')}</h2>
      ${button(ctx.url('/news/'), t('news.back'), { variant: 'text' })}
    </div>
    <div class="news-grid">${ctx.news.slice(0, 3).map((post) => newsCard(ctx, post))}</div>
  </div>
</section>`}
`;

  return {
    id: 'home',
    section: 'home',
    path: '/',
    title: ctx.L(s.name),
    description: t('meta.home'),
    body,
  };
}
