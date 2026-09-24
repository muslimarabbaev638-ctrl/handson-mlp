import { html } from '../lib/html.js';
import { icon, button, photo, sectionHead, pageHero, factList, factBlock, flag, hasFact, personLine, missingBox } from '../components.js';
import { factState } from '../lib/facts.js';

/** Shared list of key facts (used on About and on the School Profile). */
export function keyFacts(ctx) {
  const s = ctx.school;
  const t = ctx.t;
  return [
    { label: t('fact.type'), value: s.type },
    { label: t('fact.network'), value: t('fact.networkValue') },
    { label: t('fact.founded'), value: s.founded },
    {
      label: t('fact.location'),
      value: [s.location.district, s.location.region, s.location.country].map((x) => ctx.L(x)).join(', '),
    },
    { label: t('fact.grades'), value: s.grades },
    { label: t('fact.students'), value: s.students },
    { label: t('fact.teachers'), value: s.teachers },
    { label: t('fact.classSize'), value: t('fact.classSizeValue', { n: s.maxClassSize }) },
    { label: t('fact.language'), value: s.languageOfInstruction },
    { label: t('fact.tuition'), value: t('fact.tuitionValue') },
    { label: t('fact.admission'), value: t('fact.admissionValue') },
  ];
}

export function leadershipCards(ctx) {
  return ctx.school.leadership
    .map((entry) => {
      const person = ctx.fact(entry.person);
      if (!person) {
        if (!ctx.draft) return '';
        return html`<li class="person person--missing"><p class="person__role">${ctx.L(entry.role)}</p>${flag(ctx, entry.person)}</li>`;
      }
      return html`<li class="person"><p class="person__role">${ctx.L(entry.role)}</p>${personLine(ctx, person)} ${flag(ctx, entry.person)}</li>`;
    })
    .filter(Boolean);
}

export function aboutPage(ctx) {
  const s = ctx.school;
  const t = ctx.t;
  const campus = photo(ctx, 'campus', { className: 'media-frame__img', sizes: '(min-width: 900px) 45vw, 100vw' });
  const lab = photo(ctx, 'lab', { className: 'media-frame__img', sizes: '(min-width: 900px) 45vw, 100vw' });
  const people = leadershipCards(ctx);

  const body = html`
${pageHero(ctx, { eyebrow: ctx.L(s.name), title: t('about.title'), lead: ctx.L(s.overview) })}

<section class="section" aria-labelledby="mission-title">
  <div class="container split">
    <div class="split__text">
      ${sectionHead({ title: t('about.missionTitle'), id: 'mission-title' })}
      <p class="prose-lead">${ctx.L(s.mission)}</p>
      <p>${ctx.L(s.specialization.text)}</p>
    </div>
    ${campus ? html`<figure class="media-frame">${campus}</figure>` : html`<ul class="subject-grid subject-grid--compact">
      ${s.specialization.subjects.map((sub) => html`<li class="subject"><span class="subject__icon">${icon(sub.id, { size: 26 })}</span><span class="subject__name">${ctx.L(sub.name)}</span></li>`)}
    </ul>`}
  </div>
</section>

<section class="section section--tint" aria-labelledby="facts-title">
  <div class="container narrow">
    ${sectionHead({ title: t('about.factsTitle'), id: 'facts-title' })}
    ${factList(ctx, keyFacts(ctx), { className: 'facts facts--table' })}
  </div>
</section>

${people.length > 0 && html`<section class="section" id="leadership" aria-labelledby="leadership-title">
  <div class="container">
    ${sectionHead({ title: t('about.leadershipTitle'), id: 'leadership-title' })}
    <ul class="people-grid">${people}</ul>
  </div>
</section>`}

<section class="section${people.length > 0 ? ' section--tint' : ''}">
  <div class="container split split--top">
    <div class="split__text">
      ${hasFact(ctx, s.teachersNote) || ctx.draft ? html`
        ${sectionHead({ title: t('about.teachersTitle'), id: 'teachers-title' })}
        ${factBlock(ctx, s.teachersNote, (v) => html`<p>${ctx.L(v)}</p>`)}
      ` : ''}
      ${sectionHead({ title: t('about.facilitiesTitle'), id: 'facilities-title' })}
      ${factBlock(ctx, s.facilities, (list) => html`<ul class="check-list">${list.map((f) => html`<li>${icon('check', { size: 18 })}${ctx.L(f)}</li>`)}</ul>`)}
      ${factState(s.moreFacilities) !== 'ok' ? missingBox(ctx, s.moreFacilities) : ''}
    </div>
    ${lab && html`<figure class="media-frame">${lab}</figure>`}
  </div>
</section>

<section class="section section--navy" aria-labelledby="network-title">
  <div class="container narrow">
    <h2 id="network-title">${t('about.networkTitle')}</h2>
    <p>${t('about.networkText')}</p>
    ${button(s.network.url, t('about.networkLink'), { variant: 'ghost-light', iconName: 'external', external: true })}
  </div>
</section>
`;

  return {
    id: 'about',
    section: 'about',
    path: '/about/',
    title: t('about.title'),
    description: t('meta.about'),
    body,
  };
}
