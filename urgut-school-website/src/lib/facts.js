// Every fact about the school lives in content/school.js. A fact that is not
// a plain value is wrapped in one of these markers, so nothing unconfirmed can
// reach the public site by accident:
//
//   todo(note)          - information we do not have yet. Never published.
//   draft(value, note)  - a suggested text based on general knowledge. Shown only
//                         in draft builds (npm run dev / build:draft), never in
//                         production, until someone removes the draft() wrapper.
//   verify(value, note) - taken from the school's old website. Published, but
//                         listed in the checklist because it should be re-checked.
//
// `npm run check` lists every marker. To confirm a fact, replace the marker
// with the plain value.

export const todo = (note) => ({ __fact: 'todo', note });
export const draft = (value, note) => ({ __fact: 'draft', value, note });
export const verify = (value, note) => ({ __fact: 'verify', value, note });

export function factState(x) {
  return x && typeof x === 'object' && typeof x.__fact === 'string' ? x.__fact : 'ok';
}

export function factNote(x) {
  return factState(x) === 'ok' ? '' : x.note;
}

/** Value that may be shown in the current build mode, or undefined. */
export function factValue(x, draftMode) {
  switch (factState(x)) {
    case 'ok': return x;
    case 'verify': return x.value;
    case 'draft': return draftMode ? x.value : undefined;
    default: return undefined; // todo
  }
}

/** Walk a content object and collect every marker with its dotted path. */
export function collectFacts(obj, path = []) {
  const out = [];
  const state = factState(obj);
  if (state !== 'ok') {
    out.push({ path: path.join('.'), state, note: obj.note });
    if (state !== 'todo') out.push(...collectFacts(obj.value, path));
    return out;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => out.push(...collectFacts(item, [...path, i])));
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) out.push(...collectFacts(v, [...path, k]));
  }
  return out;
}
