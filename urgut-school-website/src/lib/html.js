// Tiny HTML templating: html`...` escapes every interpolated value unless it
// is itself an html`` result (or wrapped in raw()). Arrays are joined, and
// null / undefined / false / true render as nothing, so `${cond && html`...`}`
// works as a conditional.

const RAW = Symbol('raw-html');

export function raw(value) {
  return { [RAW]: true, value: String(value) };
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[c]);
}

export function render(value) {
  if (value == null || value === false || value === true) return '';
  if (Array.isArray(value)) return value.map(render).join('');
  if (typeof value === 'object' && value[RAW]) return value.value;
  // Catches a forgotten L() or an unresolved todo()/draft() marker instead of printing "[object Object]".
  if (typeof value === 'object') throw new Error(`Cannot render an object in a template: ${JSON.stringify(value).slice(0, 160)}`);
  return escapeHtml(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1];
  return raw(out);
}

export const isEmptyHtml = (value) => render(value).trim() === '';
