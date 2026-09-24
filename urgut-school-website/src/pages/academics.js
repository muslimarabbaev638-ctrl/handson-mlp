import { html } from '../lib/html.js';
import { icon, photo, sectionHead, pageHero, factBlock, hasFact } from '../components.js';
import { curriculumTable, gradingTable, textBlock, competitionsList, activitiesList } from '../sections.js';

export function academicsPage(ctx) {
  const s = ctx.school;
  const a = s.academics;
  const t = ctx.t;
  const classroom = photo(ctx, 'classroom', { className: 'media-frame__img', sizes: '(min-width: 900px) 45vw, 100vw' });
  const show = (x) => hasFact(ctx, x) || ctx.draft;

  const body = html`
${pageHero(ctx, { eyebrow: ctx.L(s.name), title: t('academics.title'), lead: t('academics.lead') })}

<section class="section" aria-labelledby="special-title">
  <div class="container split">
    <div class="split__text">
      ${sectionHead({ title: t('academics.specialTitle'), id: 'special-title' })}
      <p class="prose-lead">${ctx.L(s.specialization.text)}</p>
      <h3>${t('academics.systemTitle')}</h3>
      <p>${t('academics.systemText')}</p>
    </div>
    ${classroom ? html`<figure class="media-frame">${classroom}</figure>` : html`<ul class="subject-grid subject-grid--compact">
      ${s.specialization.subjects.map((sub) => html`<li class="subject"><span class="subject__icon">${icon(sub.id, { size: 26 })}</span><span class="subject__name">${ctx.L(sub.name)}</span></li>`)}
    </ul>`}
  </div>
</section>

${show(a.curriculum) && html`<section class="section section--tint" aria-labelledby="curriculum-title">
  <div class="container">
    ${sectionHead({ title: t('academics.curriculumTitle'), id: 'curriculum-title' })}
    ${curriculumTable(ctx)}
  </div>
</section>`}

${[a.grading, a.gpaAndRank, a.calendar, a.graduation, a.notOffered].some(show) && html`<section class="section" aria-label="${t('academics.gradingTitle')}">
  <div class="container two-col">
    ${(show(a.grading) || show(a.gpaAndRank)) && html`<div>
      ${sectionHead({ title: t('academics.gradingTitle'), id: 'grading-title' })}
      ${gradingTable(ctx)}
      ${show(a.gpaAndRank) && html`<h3>${t('academics.rankTitle')}</h3>${textBlock(ctx, a.gpaAndRank)}`}
    </div>`}
    <div class="stack">
      ${show(a.calendar) && html`<div class="card">${icon('calendar', { size: 24, className: 'icon card__icon' })}<h3>${t('academics.calendarTitle')}</h3>${textBlock(ctx, a.calendar)}</div>`}
      ${show(a.graduation) && html`<div class="card">${icon('cap', { size: 24, className: 'icon card__icon' })}<h3>${t('academics.graduationTitle')}</h3>${textBlock(ctx, a.graduation)}</div>`}
      ${show(a.notOffered) && html`<div class="card">${icon('doc', { size: 24, className: 'icon card__icon' })}<h3>${t('academics.notOfferedTitle')}</h3>${textBlock(ctx, a.notOffered)}</div>`}
    </div>
  </div>
</section>`}

<section class="section section--tint" aria-labelledby="beyond-title">
  <div class="container two-col">
    <div>
      ${sectionHead({ title: t('academics.examsTitle'), id: 'beyond-title' })}
      ${factBlock(ctx, a.internationalExams, (v) => html`<p>${ctx.L(v)}</p>`)}
      <h3>${t('academics.competitionsTitle')}</h3>
      ${competitionsList(ctx)}
    </div>
    <div>
      <h2>${t('academics.activitiesTitle')}</h2>
      ${activitiesList(ctx)}
    </div>
  </div>
</section>
`;

  return {
    id: 'academics',
    section: 'academics',
    path: '/academics/',
    title: t('academics.title'),
    description: t('meta.academics'),
    body,
  };
}
