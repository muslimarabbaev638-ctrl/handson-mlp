import { html } from '../lib/html.js';
import { icon, factList, factBlock, hasFact, personLine } from '../components.js';
import { keyFacts } from './about.js';
import { curriculumTable, gradingTable, textBlock, competitionsList, activitiesList, offersList, scoreChips, destinationsList, classStats } from '../sections.js';

// The School Profile: the one page a university admissions officer needs,
// laid out to print on two A4 pages (see the @media print rules in site.css).
export function profilePage(ctx) {
  const s = ctx.school;
  const a = s.academics;
  const t = ctx.t;
  const cls = s.results.classes[0];
  const leader = (id) => s.leadership.find((p) => p.id === id);
  const host = new URL(ctx.siteUrl).host;
  const show = (x) => hasFact(ctx, x) || ctx.draft;
  const showGrading = show(a.grading) || show(a.gpaAndRank);

  const contacts = [
    { label: t('fact.address'), value: s.address },
    { label: t('fact.phone'), value: s.contact.phoneDisplay },
    { label: t('fact.email'), value: s.contact.email, format: (v) => html`<a href="mailto:${v}">${v}</a>` },
    { label: t('fact.website'), value: host, format: (v) => html`<a href="${ctx.siteUrl}">${v}</a>` },
    { label: t('fact.ceeb'), value: s.ceebCode },
    { label: ctx.L(leader('director').role), value: leader('director').person, format: (p) => personLine(ctx, p) },
    { label: ctx.L(leader('counselor').role), value: leader('counselor').person, format: (p) => personLine(ctx, p) },
  ];

  const body = html`
<div class="profile-wrap">
  <div class="container">
    <article class="profile">
      <header class="profile__head">
        <img class="profile__mark" src="/brand/emblem.svg" alt="" width="64" height="64">
        <div class="profile__heading">
          <p class="eyebrow">${t('profile.title')}</p>
          <h1>${ctx.L(s.name)}</h1>
          <p class="profile__sub">${t('profile.subtitle', { year: ctx.academicYear })}</p>
        </div>
        <button class="btn btn--primary profile__print" type="button" data-print hidden>${icon('print', { size: 18 })}${t('profile.print')}</button>
      </header>

      ${factList(ctx, contacts, { className: 'facts facts--contacts' })}
      <p class="profile__intro">${t('profile.intro')}</p>

      <div class="profile__grid">
        <section class="profile__block">
          <h2>${t('profile.overviewTitle')}</h2>
          <p>${ctx.L(s.overview)}</p>
          <p>${ctx.L(s.mission)}</p>
        </section>

        <section class="profile__block">
          <h2>${t('profile.factsTitle')}</h2>
          ${factList(ctx, keyFacts(ctx), { className: 'facts facts--compact' })}
        </section>

        <section class="profile__block profile__block--wide">
          <h2>${t('profile.curriculumTitle')}</h2>
          <p>${ctx.L(s.specialization.text)} ${t('academics.systemText')}</p>
          ${curriculumTable(ctx, { compact: true })}
          ${show(a.notOffered) && html`<h3>${t('academics.notOfferedTitle')}</h3>${textBlock(ctx, a.notOffered)}`}
          ${show(a.calendar) && html`<h3>${t('academics.calendarTitle')}</h3>${textBlock(ctx, a.calendar)}`}
        </section>

        ${showGrading && html`<section class="profile__block">
          <h2>${t('profile.gradingTitle')}</h2>
          ${gradingTable(ctx)}
          ${show(a.gpaAndRank) && html`<h3>${t('academics.rankTitle')}</h3>${textBlock(ctx, a.gpaAndRank)}`}
        </section>`}

        <section class="profile__block${showGrading ? '' : ' profile__block--wide'}">
          ${show(a.graduation) && html`<h2>${t('profile.graduationTitle')}</h2>${textBlock(ctx, a.graduation)}`}
          <h2>${t('academics.examsTitle')}</h2>
          ${factBlock(ctx, a.internationalExams, (v) => html`<p>${ctx.L(v)}</p>`)}
        </section>

        <section class="profile__block profile__block--wide">
          <h2>${t('common.classOf', { year: cls.year })}</h2>
          ${classStats(ctx, cls)}
          <div class="profile__split">
            <div>
              <h3>${t('results.scoresTitle')}</h3>
              <div class="score-row"><span class="score-row__label">${t('results.ielts')}</span>${scoreChips(cls.testHighlights.ielts, (v) => v.toFixed(1))}</div>
              <div class="score-row"><span class="score-row__label">${t('results.sat')}</span>${scoreChips(cls.testHighlights.sat)}</div>
              <p class="note">${t('results.scoresNote')}</p>
              ${show(cls.testStats) && html`<h3>${t('results.statsTitle')}</h3>${factBlock(ctx, cls.testStats, (v) => html`<p>${ctx.L(v)}</p>`)}`}
            </div>
            <div>
              <h3>${t('results.offersTitle')}</h3>
              ${offersList(ctx, cls)}
              ${show(cls.destinations) && html`<h3>${t('results.destinationsTitle')}</h3>${destinationsList(ctx, cls)}`}
            </div>
          </div>
        </section>

        <section class="profile__block profile__block--wide">
          <h2>${t('academics.competitionsTitle')}</h2>
          ${competitionsList(ctx)}
          <h3>${t('academics.activitiesTitle')}</h3>
          ${activitiesList(ctx)}
        </section>
      </div>

      <footer class="profile__foot">
        <p>${t('profile.updated', { date: ctx.date(ctx.buildDate) })}</p>
        <p><a href="${ctx.siteUrl}${ctx.url('/profile/').slice(1)}">${host}${ctx.url('/profile/')}</a></p>
      </footer>
    </article>
  </div>
</div>
`;

  return {
    id: 'profile',
    section: 'profile',
    path: '/profile/',
    title: t('profile.title'),
    description: t('meta.profile'),
    body,
  };
}
