import { html } from '../lib/html.js';
import { icon, pageHero, newsCard } from '../components.js';

export function newsListPage(ctx) {
  const t = ctx.t;
  const body = html`
${pageHero(ctx, { eyebrow: ctx.L(ctx.school.name), title: t('news.title'), lead: t('news.lead') })}
<section class="section">
  <div class="container">
    <div class="news-grid">${ctx.news.map((post) => newsCard(ctx, post, { headingLevel: 2 }))}</div>
  </div>
</section>
`;
  return { id: 'news', section: 'news', path: '/news/', title: t('news.title'), description: t('meta.news'), body };
}

export function newsPostPage(ctx, post) {
  const t = ctx.t;
  const title = ctx.L(post.title);
  const body = html`
<article class="article">
  <header class="page-hero page-hero--article">
    <div class="container narrow">
      <p class="news-card__meta news-card__meta--light"><span class="tag tag--light">${ctx.L(post.tag)}</span><time datetime="${post.date}">${ctx.month(post.date)}</time></p>
      <h1>${title}</h1>
      <p class="lead">${ctx.L(post.summary)}</p>
    </div>
  </header>
  <div class="section">
    <div class="container narrow prose">
      ${ctx.L(post.body).map((p) => html`<p>${p}</p>`)}
      <p><a class="back-link" href="${ctx.url('/news/')}">${icon('arrow', { size: 18, className: 'icon icon--flip' })}${t('news.back')}</a></p>
    </div>
  </div>
</article>
`;
  return {
    id: 'news-post',
    section: 'news',
    path: `/news/${post.slug}/`,
    title,
    description: ctx.L(post.summary),
    ogType: 'article',
    body,
  };
}
