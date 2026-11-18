// Response format checks: does an API answer still have the fields the app relies on, with the right types?
// Rules live in test/api-formats.json (see its _help). No library: paths like "a.b", "list[]" and "list[].field".

const MAX_ITEMS = 50; // items of each list that are checked

const typeOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);
const NAMES = { string: 'text', number: 'a number', boolean: 'true/false', object: 'an object', array: 'a list', null: 'null', undefined: 'nothing' };
const TYPES = new Set(['string', 'number', 'boolean', 'object', 'array', 'any']);

/** The rule for a call (first whose match is part of its API name or URL), or null. */
export function ruleFor(call, rules = []) {
  return rules.find((r) => r.match && ((call.endpoint || '').includes(r.match) || (call.url || '').includes(r.match))) || null;
}

/** "a.b[].c" -> [{key:'a'}, {key:'b', each:true}, {key:'c'}] */
function segments(path) {
  return path.split('.').map((s) => ({ key: s.replace(/\[\]$/, ''), each: s.endsWith('[]') }));
}

/**
 * Check one parsed body against a rule. Returns the problems found, each { path, expected, got, text }, and how many
 * values were checked. A field that is there must have its type even when it is optional ("string?"); a required field
 * inside an optional object that is missing is not reported (the object itself is allowed to be missing).
 */
export function checkBody(body, rule) {
  const problems = [];
  let checked = 0;
  const optional = new Set(Object.entries(rule.fields || {}).filter(([, t]) => String(t).endsWith('?')).map(([p]) => p));
  const seen = new Set();
  const report = (path, expected, got, text) => { if (!seen.has(path)) { seen.add(path); problems.push({ path, expected, got, text }); } };
  for (const [path, spec] of Object.entries(rule.fields || {})) {
    const want = String(spec).replace(/\?$/, '');
    const leafOptional = String(spec).endsWith('?');
    if (!TYPES.has(want)) { report(path, want, '-', `Rule error: unknown type "${want}" for ${path} (use ${[...TYPES].join(', ')}).`); continue; }
    const segs = segments(path);
    // Walk the path; `vals` holds [concretePath, value] pairs (several once we go into list items)
    let vals = [['', body]];
    let prefix = '';
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i];
      prefix = prefix ? `${prefix}.${s.key}` : s.key;
      const next = [];
      for (const [cp, v] of vals) {
        const here = cp ? `${cp}.${s.key}` : s.key;
        const child = v != null && typeof v === 'object' && !Array.isArray(v) ? v[s.key] : undefined;
        const last = i === segs.length - 1;
        if (child === undefined) {
          // Missing: fine if this field, or the object it is in, may be missing
          if (leafOptional || optional.has(prefix) || optional.has(prefix + '[]')) continue;
          report(prefix, last ? want : s.each ? 'array' : 'object', 'undefined', `${here} is missing (expected ${NAMES[last ? want : s.each ? 'array' : 'object']}).`);
          continue;
        }
        if (s.each) {
          if (!Array.isArray(child)) { report(prefix + '[]', 'array', typeOf(child), `${here} should be a list but is ${NAMES[typeOf(child)] || typeOf(child)}.`); continue; }
          if (last) { checked++; continue; }
          child.slice(0, MAX_ITEMS).forEach((item, n) => next.push([`${here}[${n}]`, item]));
        } else if (last) {
          checked++;
          if (want !== 'any' && typeOf(child) !== want) report(path, want, typeOf(child), `${here} should be ${NAMES[want]} but is ${NAMES[typeOf(child)] || typeOf(child)}${typeOf(child) === 'string' ? ` ("${String(child).slice(0, 40)}")` : ''}.`);
        } else {
          next.push([here, child]);
        }
      }
      vals = next;
      if (!vals.length) break;
    }
  }
  for (const path of rule.nonEmpty || []) {
    const segs = segments(path);
    let v = body;
    for (const s of segs) v = v != null && typeof v === 'object' ? v[s.key] : undefined;
    checked++;
    if (Array.isArray(v) && v.length === 0) report(path + ' (empty)', 'non-empty list', 'empty list', `${path} is an empty list; the app needs at least one item.`);
  }
  return { problems, checked };
}

/**
 * Check one API call. `bodyText` = the whole body if known (from its body file), else the preview.
 * Returns { rule, status: 'ok' | 'problems' | 'not-checked', problems, checked, reason } or null when no rule applies.
 */
export function checkCall(call, rules, bodyText) {
  const rule = ruleFor(call, rules);
  if (!rule) return null;
  const base = { rule: rule.name || rule.match, problems: [], checked: 0 };
  if (call.status == null) return null; // no response: already reported as such, nothing to check
  if (rule.status != null && call.status !== rule.status) return { ...base, status: 'not-checked', reason: `The rules are for status ${rule.status}; this response was ${call.status}.` };
  if (bodyText == null || bodyText === '') {
    return { ...base, status: 'not-checked', reason: call.bodyMissing || call.bodyNote || 'The body was not recorded, so the format could not be checked.' };
  }
  let body;
  try { body = JSON.parse(bodyText); } catch (e) {
    const why = call.bodyCut
      ? `The body lost text in the Android log (${call.bodyCut} of its pieces were longer than Android's 4,059-byte line limit and were cut), so it is not valid JSON and could not be checked. This is a limit of the log, not a problem of the API.`
      : call.bodyLength && bodyText.length < call.bodyLength
        ? `Only the first ${bodyText.length} of ${call.bodyLength} characters were kept, so the format could not be checked.`
        : `The body is not valid JSON (${String(e.message).slice(0, 80)}), so the format could not be checked.`;
    return { ...base, status: 'not-checked', reason: why };
  }
  const { problems, checked } = checkBody(body, rule);
  return { ...base, status: problems.length ? 'problems' : 'ok', problems, checked };
}
