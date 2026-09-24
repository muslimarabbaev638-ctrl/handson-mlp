# Urgut Specialized School — website

The website of **Urgut tumani ixtisoslashtirilgan maktabi** (Urgut Specialized School), in Uzbek, Russian and English.

It is built for two audiences:

- **University admissions officers.** The **School Profile** (`/en/profile/`) is the document a counselor sends with
  transcripts and recommendations. It covers the school, curriculum, grading scale, results and contacts. It prints on
  two A4 pages, and the "Print / save as PDF" button produces the file to upload to Common App and similar portals.
- **Families and students.** It explains what the school is, how admission works (only through the official PIIMA
  portal), results, news and contacts.

The site is plain static HTML with no framework and no database. It works without JavaScript and can be hosted for free.

## Pages

Each page exists in three languages. Uzbek is at the root, Russian under `/ru/` and English under `/en/`.

| Page | Path | What it covers |
| --- | --- | --- |
| Home | `/` | Summary, specialization, class results, entry points for universities and parents |
| About | `/about/` | Overview, mission, key facts, leadership, teachers, facilities |
| Academics | `/academics/` | Specialization, curriculum table, grading scale, calendar, graduation, exams, olympiads, activities |
| Results | `/results/` | Class of 2026 statistics, selected test scores, university offers, olympiads |
| Admissions | `/admissions/` | Who can apply, exams, timeline, steps, documents, FAQ; links to ariza.piima.uz |
| News | `/news/` | News posts |
| Contact | `/contact/` | Address, phone, email, map |
| **School Profile** | `/profile/` | One printable page for universities |

The build also generates `sitemap.xml` (with hreflang alternates), `robots.txt`, a trilingual `404.html`, a favicon,
Open Graph tags, JSON-LD (`School`) structured data, and `_headers` / `_redirects` files for Cloudflare Pages or
Netlify.

## Quick start

Requires Node.js 18.17 or newer (22 recommended).

```sh
npm install
npm run dev        # draft build + preview at http://localhost:4321
npm run build      # production build into dist/
npm run preview    # production build + preview
npm run check      # list the facts that are still missing or need confirming
npm run checklist  # same, and write CONTENT-CHECKLIST.md to share with the school
```

## Editing content

All content is in three files. You do not need to touch HTML to change the website.

| File | What is in it |
| --- | --- |
| `content/school.js` | **Every fact about the school:** names, contacts, leadership, curriculum, grading, results, admissions, FAQ |
| `content/news.js` | News posts |
| `content/ui.js` | Interface text: menus, headings, buttons, page descriptions |

Every text is written in all three languages, `{ uz: '…', ru: '…', en: '…' }`. The build fails with a clear message if
a language is missing. Uzbek can be typed with a plain apostrophe (`o'quvchi`), and the build converts it to the
correct letters (`oʻquvchi`).

### Facts that are not confirmed yet

The site must not publish anything the school has not confirmed: universities check what a school profile says. So
every fact in `content/school.js` is either a plain value, which is published, or wrapped in one of three markers:

| Marker | Meaning | On the live site | In `npm run dev` |
| --- | --- | --- | --- |
| `todo('note')` | We do not have this information | hidden | red "missing" box |
| `draft(value, 'note')` | Suggested text, not confirmed by the school | hidden | shown, yellow outline |
| `verify(value, 'note')` | Taken from the old website | shown | shown, blue outline |

To confirm a fact, replace the marker with the plain value:

```js
// before
ceebCode: todo('College Board (CEEB) school code…'),
// after
ceebCode: '123456',
```

A section with nothing confirmed is left out of the page entirely, so the live site never shows empty headings or
"coming soon" text. `npm run check` lists everything still open. **[CONTENT-CHECKLIST.md](CONTENT-CHECKLIST.md)** is the
current list to send to the school.

The facts that matter most for university applications:

1. The **official English name**. It must match transcripts, Common App and College Board exactly.
2. The **CEEB code**, and the **university counselor's** name, email and phone.
3. The **curriculum** (subjects and weekly hours per grade), the **grading scale**, whether the school **ranks** students,
   and which programs are **not offered** (AP / IB / A-Levels).
4. **Where graduates actually enrolled**, and test statistics for *all* test-takers rather than only the best scores.

### News

Add an entry at the top of `content/news.js`. The `slug` becomes the address (`/news/<slug>/`), and `date` is `'YYYY-MM'`.

### Photos and emblem

- Put photos in `photos/` named `hero`, `students`, `lab`, `campus` and `classroom` (see [photos/README.md](photos/README.md)).
  The build resizes them to WebP and strips EXIF and GPS data.
- `public/brand/emblem.svg` is a **placeholder**. Replace it with the official emblem and keep the file name. The favicon and
  the Apple touch icon are generated from it.
- `public/og-image.png` is the social preview (1200×630) used until a `hero` photo is added.

## Privacy

- Results are published **without student names**. The old site showed full-size scans of students' IELTS/SAT certificates
  with names and candidate numbers. These have deliberately **not** been carried over. Publish an individual result only
  with the student's (and a parent's) written consent, and never as a scan of the certificate.
- Photos lose all metadata (including location) at build time.
- The site sets no cookies and loads no third-party scripts. The only exceptions are the Yandex map on the contact page and
  Cloudflare Web Analytics, if it is enabled on the host.

## Deployment

The output is the static `dist/` folder, which you can host anywhere. On **Cloudflare Pages**:

| Setting | Value |
| --- | --- |
| Root directory | `urgut-school-website` (this folder) |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variable | `NODE_VERSION=22` |

For a **preview or demo** deployment (e.g. `demo.urgutim.uz`), also set:

- `SITE_URL=https://demo.urgutim.uz`, so that canonical links, the sitemap and Open Graph tags use the demo address;
- `NOINDEX=1`, to add `noindex` and a disallow-all `robots.txt`, so search engines do not index the demo instead of the real site.

Build options (environment variables):

| Variable | Default | Effect |
| --- | --- | --- |
| `SITE_URL` | `https://urgutim.uz` | Absolute address used in canonical links, sitemap and social tags |
| `DRAFT` | off | `1` shows drafts and marks missing facts (for review only; never deploy a draft build) |
| `NOINDEX` | off | `1` keeps search engines out |
| `BUILD_DATE` | now | Date shown as "last updated" (ISO format) |

`_redirects` sends the old site's addresses (`/achievements`, `/people`) to the new pages.

## Project structure

```
content/            school.js, news.js, ui.js: everything you edit
photos/             school photos (optional)
public/             copied into dist/ as is (emblem, og-image)
scripts/
  build.mjs         the build: pages, fonts, images, sitemap, headers
  serve.mjs         local preview server
  check-content.mjs lists todo / draft / verify facts
src/
  lib/              html templating (auto-escaped), i18n, fact markers
  pages/            one file per page
  layout.js         <head>, header, footer
  components.js     shared pieces (icons, fact lists, photos…)
  sections.js       content blocks shared by several pages (curriculum table, results…)
  styles/site.css   all styles, including the print layout of the School Profile
  client/site.js    menu button and print button (the site works without it)
```
