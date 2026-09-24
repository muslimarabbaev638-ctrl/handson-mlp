// Content blocks shared by several pages (Academics, Results, School Profile).
import { html } from './lib/html.js';
import { factBlock, flag, icon } from './components.js';

export function curriculumTable(ctx, { compact = false } = {}) {
  const t = ctx.t;
  return factBlock(ctx, ctx.school.academics.curriculum, (c) => html`<div class="table-wrap">
  <table class="data-table curriculum${compact ? ' data-table--compact' : ''}">
    <caption>${t('academics.curriculumCaption')}</caption>
    <thead>
      <tr><th scope="col">${t('academics.subject')}</th>${c.grades.map((g) => html`<th scope="col" class="num"><span class="visually-hidden">${t('academics.grade')} </span>${g}</th>`)}</tr>
    </thead>
    <tbody>
      ${c.subjects.map((sub) => html`<tr${sub.advanced ? html` class="is-advanced"` : ''}>
        <th scope="row">${ctx.L(sub.name)}${sub.advanced && html` <span class="pill">${t('academics.advanced')}</span>`}</th>
        ${sub.hours.map((h) => html`<td class="num">${h == null ? '—' : h}</td>`)}
      </tr>`)}
    </tbody>
  </table>
</div>`);
}

export function gradingTable(ctx) {
  const t = ctx.t;
  return factBlock(ctx, ctx.school.academics.grading, (g) => html`<div class="table-wrap">
  <table class="data-table grading">
    <thead><tr><th scope="col">${t('academics.mark')}</th><th scope="col">${t('academics.meaning')}</th><th scope="col">${t('academics.us')}</th></tr></thead>
    <tbody>${g.scale.map((row) => html`<tr><th scope="row" class="num">${row.mark}</th><td>${ctx.L(row.meaning)}</td><td>${row.us}</td></tr>`)}</tbody>
  </table>
</div>
<p class="note">${ctx.L(g.note)}</p>`);
}

export function textBlock(ctx, fact) {
  return factBlock(ctx, fact, (v) => html`<p>${ctx.L(v)}</p>`);
}

export function competitionsList(ctx) {
  return factBlock(ctx, ctx.school.academics.competitions, (list) => html`<ul class="award-list">
  ${list.map((a) => html`<li>${icon('trophy', { size: 20 })}<span><strong>${a.year}</strong> — ${ctx.L(a.text)}</span></li>`)}
</ul>`);
}

export function activitiesList(ctx) {
  const a = ctx.school.academics;
  return html`<ul class="award-list">
  ${a.activities.map((x) => html`<li>${icon('users', { size: 20 })}<span><strong>${ctx.L(x.name)}</strong> — ${ctx.L(x.text)}</span></li>`)}
</ul>
${factBlock(ctx, a.moreActivities, (v) => html`<p>${ctx.L(v)}</p>`)}`;
}

export function offersList(ctx, cls) {
  return html`<ul class="offer-list">
  ${cls.offers.map((o) => html`<li><span class="offer-list__name">${o.name}</span><span class="offer-list__country">${ctx.t(`country.${o.country}`)}</span></li>`)}
</ul>`;
}

export function scoreChips(values, format = (v) => v) {
  return html`<ul class="chips">${values.map((v) => html`<li>${format(v)}</li>`)}</ul>`;
}

export function destinationsList(ctx, cls) {
  return factBlock(ctx, cls.destinations, (list) => html`<ul class="offer-list">
  ${list.map((d) => html`<li><span class="offer-list__name">${ctx.L(d.name)}</span><span class="offer-list__country">${ctx.L(d.country)}${d.students != null && html` · ${d.students}`}</span></li>`)}
</ul>`);
}

export function classStats(ctx, cls) {
  const t = ctx.t;
  const graduates = ctx.fact(cls.graduates);
  const certified = ctx.fact(cls.certified);
  const rate = ctx.fact(cls.continuingRate);
  const items = [];
  if (graduates != null) items.push(html`<li><span class="glance__value">${graduates}</span><span class="glance__label">${t('results.graduates')} ${flag(ctx, cls.graduates)}</span></li>`);
  if (certified != null) items.push(html`<li><span class="glance__value">${certified}</span><span class="glance__label">${t('results.certified')} ${flag(ctx, cls.certified)}</span></li>`);
  if (rate != null) items.push(html`<li><span class="glance__value">${rate}%</span><span class="glance__label">${t('results.continuing')} ${flag(ctx, cls.continuingRate)}</span></li>`);
  else if (ctx.draft) items.push(html`<li><span class="glance__value">—</span><span class="glance__label">${t('results.continuing')} ${flag(ctx, cls.continuingRate)}</span></li>`);
  return items.length ? html`<ul class="glance__list glance__list--light">${items}</ul>` : '';
}
