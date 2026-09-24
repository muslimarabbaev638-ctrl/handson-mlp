import { html } from '../lib/html.js';
import { icon, sectionHead, pageHero, factBlock, hasFact } from '../components.js';
import { classStats, offersList, scoreChips, destinationsList, competitionsList } from '../sections.js';

export function resultsPage(ctx) {
  const s = ctx.school;
  const t = ctx.t;

  const classes = s.results.classes.map((cls) => html`
<section class="section" aria-labelledby="class-${cls.year}">
  <div class="container">
    ${sectionHead({ title: t('common.classOf', { year: cls.year }), id: `class-${cls.year}` })}
    <div class="class-summary">${classStats(ctx, cls)}</div>

    <div class="two-col">
      <div class="card">
        ${icon('trophy', { size: 24, className: 'icon card__icon' })}
        <h3>${t('results.scoresTitle')}</h3>
        <div class="score-row"><span class="score-row__label">${t('results.ielts')}</span>${scoreChips(cls.testHighlights.ielts, (v) => v.toFixed(1))}</div>
        <div class="score-row"><span class="score-row__label">${t('results.sat')}</span>${scoreChips(cls.testHighlights.sat)}</div>
        <p class="note">${t('results.scoresNote')}</p>
        ${(hasFact(ctx, cls.testStats) || ctx.draft) && html`<h4>${t('results.statsTitle')}</h4>${factBlock(ctx, cls.testStats, (v) => html`<p>${ctx.L(v)}</p>`)}`}
      </div>
      <div class="card">
        ${icon('cap', { size: 24, className: 'icon card__icon' })}
        <h3>${t('results.offersTitle')}</h3>
        <p class="note">${t('results.offersNote', { year: cls.year })}</p>
        ${offersList(ctx, cls)}
        ${(hasFact(ctx, cls.destinations) || ctx.draft) && html`<h4>${t('results.destinationsTitle')}</h4>${destinationsList(ctx, cls)}`}
      </div>
    </div>
  </div>
</section>`);

  const body = html`
${pageHero(ctx, { eyebrow: ctx.L(s.name), title: t('results.title'), lead: t('results.lead') })}
${classes}
<section class="section section--tint" aria-labelledby="awards-title">
  <div class="container narrow">
    ${sectionHead({ title: t('academics.competitionsTitle'), id: 'awards-title' })}
    ${competitionsList(ctx)}
    <p class="note note--boxed">${icon('shield', { size: 18 })}<span>${t('results.privacy')}</span></p>
  </div>
</section>
`;

  return {
    id: 'results',
    section: 'results',
    path: '/results/',
    title: t('results.title'),
    description: t('meta.results'),
    body,
  };
}
