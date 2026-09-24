// Builds the whole site into dist/.
//
//   npm run build          production build (only confirmed / verify facts)
//   npm run build:draft    draft build: also shows drafts and marks missing facts
//
// Environment variables:
//   SITE_URL=https://demo.urgutim.uz   address the site will be served from
//   NOINDEX=1                          ask search engines not to index (for demo/staging)
//   DRAFT=1                            same as build:draft

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, parse, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, school } from '../content/school.js';
import { news as newsRaw } from '../content/news.js';
import { collectFacts, factValue } from '../src/lib/facts.js';
import { LANGS, L, t, url, formatMonth, formatDate, academicYear } from '../src/lib/i18n.js';
import { layout } from '../src/layout.js';
import { homePage } from '../src/pages/home.js';
import { aboutPage } from '../src/pages/about.js';
import { academicsPage } from '../src/pages/academics.js';
import { resultsPage } from '../src/pages/results.js';
import { admissionsPage } from '../src/pages/admissions.js';
import { newsListPage, newsPostPage } from '../src/pages/news.js';
import { contactPage } from '../src/pages/contact.js';
import { profilePage } from '../src/pages/profile.js';
import { notFoundHtml } from '../src/pages/notfound.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'dist');
const DRAFT = process.env.DRAFT === '1' || process.env.DRAFT === 'true';
const NOINDEX = process.env.NOINDEX === '1' || process.env.NOINDEX === 'true';
const SITE_URL = (process.env.SITE_URL || site.url).replace(/\/*$/, '/');
const BUILD_DATE = process.env.BUILD_DATE ? new Date(process.env.BUILD_DATE) : new Date();

const hash = (data) => createHash('sha256').update(data).digest('hex').slice(0, 10);

async function writeOut(relPath, data) {
  const file = join(OUT, relPath);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, data);
}

// ── Fonts (self-hosted, only the Latin + Cyrillic subsets) ──────────────────
const FONT_SUBSETS = ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'];
const FONTS = [
  { pkg: '@fontsource-variable/inter', family: 'Inter Variable', file: 'inter' },
  { pkg: '@fontsource-variable/source-serif-4', family: 'Source Serif 4 Variable', file: 'source-serif-4' },
];

async function buildFonts() {
  let css = '';
  const preload = [];
  for (const font of FONTS) {
    const dir = join(ROOT, 'node_modules', font.pkg);
    if (!existsSync(dir)) {
      console.warn(`! ${font.pkg} not installed — falling back to system fonts (run npm install)`);
      continue;
    }
    const source = await readFile(join(dir, 'wght.css'), 'utf8');
    for (const block of source.split('@font-face').slice(1)) {
      const subset = /files\/[\w-]+?-((?:latin|cyrillic)(?:-ext)?)-wght-normal\.woff2/.exec(block)?.[1];
      if (!subset || !FONT_SUBSETS.includes(subset)) continue;
      const fileName = `${font.file}-${subset}-wght-normal.woff2`;
      await cp(join(dir, 'files', fileName), join(OUT, 'fonts', fileName));
      const href = `/fonts/${fileName}`;
      css += `@font-face${block.replace(/url\([^)]+\)/, `url(${href})`).replace(/\/\*[^*]*\*\/\s*$/, '')}`;
      if (subset === 'latin') preload.push(href);
    }
  }
  return { css, preload };
}

// ── Photos: resize, convert to WebP, strip metadata (EXIF/GPS) ──────────────
const WIDTHS = [640, 1024, 1600];

async function buildPhotos() {
  const dir = join(ROOT, 'photos');
  const photos = {};
  if (!existsSync(dir)) return photos;
  const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(f));
  if (!files.length) return photos;
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.warn('! sharp is not installed — photos in photos/ are skipped (run npm install)');
    return photos;
  }
  for (const file of files) {
    const name = parse(file).name.toLowerCase();
    const input = sharp(join(dir, file)).rotate(); // apply EXIF orientation, then drop metadata
    const meta = await input.metadata();
    const srcWidth = meta.autoOrient?.width ?? meta.width;
    const srcHeight = meta.autoOrient?.height ?? meta.height;
    const widths = WIDTHS.filter((w) => w < srcWidth).concat(Math.min(srcWidth, WIDTHS.at(-1)));
    const unique = [...new Set(widths)].sort((a, b) => a - b);
    const variants = [];
    for (const w of unique) {
      const buf = await sharp(join(dir, file)).rotate().resize({ width: w }).webp({ quality: 78 }).toBuffer();
      const outName = `images/${name}-${w}-${hash(buf)}.webp`;
      await writeOut(outName, buf);
      variants.push({ w, src: `/${outName}` });
    }
    const largest = variants.at(-1);
    photos[name] = {
      src: largest.src,
      srcset: variants.map((v) => `${v.src} ${v.w}w`).join(', '),
      width: largest.w,
      height: Math.round((srcHeight / srcWidth) * largest.w),
      file: join(dir, file),
    };
  }
  return photos;
}

// ── Icons and social-preview image ─────────────────────────────────────────
function icoFromPng(png, size) {
  // An .ico file may simply wrap a PNG image.
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt8(0, 8); // palette
  header.writeUInt8(0, 9); // reserved
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18); // offset of image data
  return Buffer.concat([header, png]);
}

async function buildBrandAssets(photos) {
  const emblem = join(OUT, 'brand', 'emblem.svg');
  const assets = { ogImage: { src: '/og-image.png', width: 1200, height: 630 } };
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    return assets;
  }
  const svg = await readFile(emblem);
  const icon = (size, pad = 0) =>
    sharp(svg, { density: 384 })
      .resize(size - pad * 2, size - pad * 2, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 255, g: 255, b: 255, alpha: pad ? 1 : 0 } })
      .png()
      .toBuffer();
  await writeOut('favicon.ico', icoFromPng(await icon(32), 32));
  await writeOut('apple-touch-icon.png', await icon(180, 18));

  // Social preview: the hero photo if there is one, otherwise public/og-image.png.
  if (photos.hero) {
    const buf = await sharp(photos.hero.file).rotate().resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    const name = `images/og-${hash(buf)}.jpg`;
    await writeOut(name, buf);
    assets.ogImage = { src: `/${name}`, width: 1200, height: 630 };
  }
  return assets;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const started = Date.now();
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
  await cp(join(ROOT, 'public'), OUT, { recursive: true });

  const fonts = await buildFonts();
  const css = fonts.css + '\n' + (await readFile(join(ROOT, 'src/styles/site.css'), 'utf8'));
  const cssPath = `/assets/site.${hash(css)}.css`;
  await writeOut(cssPath, css);
  const js = await readFile(join(ROOT, 'src/client/site.js'), 'utf8');
  const jsPath = `/assets/site.${hash(js)}.js`;
  await writeOut(jsPath, js);

  const photos = await buildPhotos();
  const brand = await buildBrandAssets(photos);
  const assets = { css: cssPath, js: jsPath, preloadFonts: fonts.preload, ...brand };

  const news = [...newsRaw].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const pages = [];

  for (const lang of LANGS) {
    const ctx = {
      lang,
      draft: DRAFT,
      noindex: NOINDEX,
      siteUrl: SITE_URL,
      buildDate: BUILD_DATE,
      academicYear: academicYear(BUILD_DATE),
      school,
      news,
      photos,
      assets,
      t: (key, vars) => t(key, lang, vars),
      L: (value) => L(value, lang),
      Lin: (value, other) => L(value, other),
      url: (path) => url(lang, path),
      urlIn: (other, path) => url(other, path),
      fact: (x) => factValue(x, DRAFT),
      month: (d) => formatMonth(d, lang),
      date: (d) => formatDate(d, lang),
    };
    const built = [
      homePage(ctx),
      aboutPage(ctx),
      academicsPage(ctx),
      resultsPage(ctx),
      admissionsPage(ctx),
      newsListPage(ctx),
      ...news.map((post) => newsPostPage(ctx, post)),
      contactPage(ctx),
      profilePage(ctx),
    ];
    for (const page of built) {
      const outPath = join(url(lang, page.path), 'index.html');
      await writeOut(outPath, layout(ctx, page));
      pages.push({ lang, path: page.path });
    }
  }

  await writeOut('404.html', notFoundHtml({ css: cssPath }));

  // Sitemap with language alternates.
  const today = BUILD_DATE.toISOString().slice(0, 10);
  const abs = (p) => new URL(p, SITE_URL).href;
  const uniquePaths = [...new Set(pages.map((p) => p.path))];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${uniquePaths
  .flatMap((path) =>
    LANGS.map(
      (lang) => `  <url>
    <loc>${abs(url(lang, path))}</loc>
    <lastmod>${today}</lastmod>
${LANGS.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${abs(url(alt, path))}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(url('uz', path))}"/>
  </url>`,
    ),
  )
  .join('\n')}
</urlset>
`;
  await writeOut('sitemap.xml', sitemap);
  await writeOut(
    'robots.txt',
    NOINDEX ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${abs('sitemap.xml')}\n`,
  );

  // Hosting config (Cloudflare Pages / Netlify format).
  await writeOut(
    '_redirects',
    ['# Addresses used by the previous version of the site', '/achievements  /results/  301', '/people  /about/  301', ''].join('\n'),
  );
  const csp = [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src 'self'",
    "script-src 'self' https://static.cloudflareinsights.com",
    "connect-src 'self' https://cloudflareinsights.com",
    "font-src 'self'",
    'frame-src https://yandex.uz https://*.yandex.uz https://yandex.ru https://*.yandex.ru',
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
  ].join('; ');
  await writeOut(
    '_headers',
    `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Content-Security-Policy: ${csp}
${NOINDEX ? '  X-Robots-Tag: noindex, nofollow\n' : ''}/assets/*
  Cache-Control: public, max-age=31536000, immutable
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/images/*
  Cache-Control: public, max-age=31536000, immutable
`,
  );

  // Summary.
  const facts = collectFacts(school);
  const count = (state) => facts.filter((f) => f.state === state).length;
  console.log(`✓ Built ${pages.length} pages (${LANGS.join(', ')}) into dist/ in ${Date.now() - started} ms`);
  console.log(`  mode: ${DRAFT ? 'DRAFT (drafts shown, missing facts marked)' : 'production'}${NOINDEX ? ', noindex' : ''} · site: ${SITE_URL}`);
  console.log(`  photos: ${Object.keys(photos).length ? Object.keys(photos).join(', ') : 'none (add files to photos/)'}`);
  console.log(`  content: ${count('todo')} missing, ${count('draft')} drafts to confirm, ${count('verify')} to double-check → npm run check`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
