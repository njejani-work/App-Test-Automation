// Performance and API budgets (test/budgets.json) and trends: per run, the p50 / p95 / max of each API's response
// time, the app's launch time and memory, and each test's duration; each checked against its limit and against the
// median of earlier runs on the same device. Going over gives a warning, never a failure (see budgets.json _help).

import { readFileSync, existsSync } from 'node:fs';

/** test/budgets.json (or DASHBOARD_BUDGETS_FILE) merged over the defaults; the defaults alone when it is missing or broken. */
export function loadBudgets(file) {
  try { return withDefaults(existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}); } catch (e) {
    console.error(`[wikiApp] ${file} could not be read (${e.message}); using the default budgets.`);
    return withDefaults({});
  }
}

export const DEFAULT_BUDGETS = {
  api: { default: { p95Ms: 2000, slowCallMs: 2000, maxKb: 500 }, endpoints: {} },
  app: { launchMs: 5000, memoryMb: 300, jankyPct: null },
  tests: { default: { durationMs: 45000 } },
  trend: { slowerPct: 50, lastRuns: 10, minRuns: 3, minMs: 300, minTestMs: 5000, minMb: 30 },
};

/** budgets.json merged over the defaults (missing parts keep their default). */
export function withDefaults(b = {}) {
  const d = DEFAULT_BUDGETS;
  return {
    api: { default: { ...d.api.default, ...(b.api?.default || {}) }, endpoints: { ...(b.api?.endpoints || {}) } },
    app: { ...d.app, ...(b.app || {}) },
    tests: { ...d.tests, ...(b.tests || {}), default: { ...d.tests.default, ...(b.tests?.default || {}) } },
    trend: { ...d.trend, ...(b.trend || {}) },
  };
}

/** Limits for one API: its own entry over the defaults. */
export const apiLimits = (budgets, endpoint) => ({ ...budgets.api.default, ...(budgets.api.endpoints[endpoint] || {}) });
/** Duration limit for one test ID: its own entry, else DASHBOARD_SLOW_MS if set, else tests.default. */
export const testLimitMs = (budgets, id) => (budgets.tests[id] && budgets.tests[id].durationMs) || (process.env.DASHBOARD_SLOW_MS ? Number(process.env.DASHBOARD_SLOW_MS) : budgets.tests.default.durationMs);

/** Nearest-rank percentile (p in 0..100) of a list of numbers; null for an empty list. */
export function percentile(values, p) {
  const v = values.filter((x) => x != null && Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  return v[Math.min(v.length - 1, Math.max(0, Math.ceil((p / 100) * v.length) - 1))];
}
const median = (values) => percentile(values, 50);

/** Device and Android version: trends only compare runs on the same one. */
export const deviceKey = (device) => (device ? `${device.deviceModel || device.deviceName || '?'} · Android ${device.platformVersion || '?'}` : 'unknown device');

/**
 * The numbers of one run: per API { n, p50, p95, max, maxBytes, slowest }, app launch (the first, cold, launch),
 * peak memory, janky frames, and each test's duration. Calls without a response have no time and are left out.
 */
export function runMetrics(r) {
  const api = {};
  for (const t of r.tests || []) {
    for (const c of t.api || []) {
      if (c.ms == null) continue;
      const e = (api[c.endpoint] = api[c.endpoint] || { times: [], sizes: [], slowest: null });
      e.times.push(c.ms);
      if (c.bytes != null) e.sizes.push(c.bytes);
      if (!e.slowest || c.ms > e.slowest.ms) e.slowest = { ms: c.ms, test: t.id || t.title, seq: c.seq };
    }
  }
  for (const [ep, e] of Object.entries(api)) {
    api[ep] = { n: e.times.length, p50: percentile(e.times, 50), p95: percentile(e.times, 95), max: Math.max(...e.times), maxBytes: e.sizes.length ? Math.max(...e.sizes) : null, slowest: e.slowest };
  }
  const launches = (r.tests || []).flatMap((t) => (t.perf?.launches || []).map((l) => l.ms));
  const mem = (r.tests || []).map((t) => t.perf?.memoryPssKb).filter(Boolean);
  const frames = (r.tests || []).map((t) => t.perf?.frames).filter((f) => f && f.total);
  const total = frames.reduce((n, f) => n + f.total, 0);
  const tests = {};
  for (const t of r.tests || []) if (t.id && t.id !== 'SESSION' && t.durationMs != null) tests[t.id] = { durationMs: t.durationMs, state: t.state };
  return {
    api,
    launchMs: launches.length ? launches[0] : null,
    launches: launches.length,
    memoryMb: mem.length ? Math.round(Math.max(...mem) / 1024) : null,
    jankyPct: total ? Math.round((frames.reduce((n, f) => n + f.janky, 0) / total) * 1000) / 10 : null,
    tests,
  };
}

const fmt = (v, unit) => (v == null ? '—' : unit === 'ms' ? (v >= 10000 ? (v / 1000).toFixed(1) + ' s' : v + ' ms') : unit === 'KB' ? Math.round(v) + ' KB' : v + ' ' + unit);

/**
 * Every budget of a run: { key, area: 'api' | 'app' | 'test', name, metric, value, limit, unit, ok, n, text }.
 * `text` says it in one line, e.g. "p95 2.6 s over the 2 s budget (4 calls; with fewer than 20 calls p95 is close to the slowest)".
 */
export function checkBudgets(m, budgets) {
  const out = [];
  const add = (o) => out.push({ ...o, ok: o.limit == null || o.value == null || o.value <= o.limit });
  for (const [ep, a] of Object.entries(m.api)) {
    const lim = apiLimits(budgets, ep);
    const few = a.n < 20 ? `; with ${a.n} call${a.n === 1 ? '' : 's'} p95 is ${a.n === 1 ? 'that call' : 'close to the slowest call'}` : '';
    add({ key: `api|${ep}|p95`, area: 'api', name: ep, metric: 'p95 response time', value: a.p95, limit: lim.p95Ms, unit: 'ms', n: a.n, p50: a.p50, max: a.max });
    out[out.length - 1].text = `p95 ${fmt(a.p95, 'ms')} ${out[out.length - 1].ok ? 'within' : 'over'} the ${fmt(lim.p95Ms, 'ms')} budget (p50 ${fmt(a.p50, 'ms')}, max ${fmt(a.max, 'ms')}, ${a.n} call${a.n === 1 ? '' : 's'}${few}).`;
    if (a.maxBytes != null) {
      add({ key: `api|${ep}|size`, area: 'api', name: ep, metric: 'largest response', value: Math.round(a.maxBytes / 1024), limit: lim.maxKb, unit: 'KB', n: a.n });
      out[out.length - 1].text = `Largest response ${fmt(a.maxBytes / 1024, 'KB')} ${out[out.length - 1].ok ? 'within' : 'over'} the ${lim.maxKb} KB budget.`;
    }
  }
  const app = budgets.app;
  if (m.launchMs != null) { add({ key: 'app|launch', area: 'app', name: 'App start (cold launch)', metric: 'launch time', value: m.launchMs, limit: app.launchMs, unit: 'ms', n: m.launches }); out[out.length - 1].text = `First screen after ${fmt(m.launchMs, 'ms')} (budget ${app.launchMs == null ? 'not set' : fmt(app.launchMs, 'ms')}; Android's "Displayed" time).`; }
  if (m.memoryMb != null) { add({ key: 'app|memory', area: 'app', name: 'Peak memory (PSS)', metric: 'memory', value: m.memoryMb, limit: app.memoryMb, unit: 'MB' }); out[out.length - 1].text = `At most ${m.memoryMb} MB after any test (budget ${app.memoryMb == null ? 'not set' : app.memoryMb + ' MB'}).`; }
  if (m.jankyPct != null) { add({ key: 'app|jank', area: 'app', name: 'Janky frames', metric: 'janky frames', value: m.jankyPct, limit: app.jankyPct, unit: '%' }); out[out.length - 1].text = app.jankyPct == null ? `${m.jankyPct}% of frames were slow (not checked: no budget; frame timing on an emulator says little about a phone).` : `${m.jankyPct}% of frames were slow (budget ${app.jankyPct}%).`; }
  for (const [id, t] of Object.entries(m.tests)) {
    const lim = testLimitMs(budgets, id);
    add({ key: `test|${id}`, area: 'test', name: id, metric: 'duration', value: t.durationMs, limit: lim, unit: 'ms' });
    out[out.length - 1].text = `${fmt(t.durationMs, 'ms')} (budget ${fmt(lim, 'ms')}).`;
  }
  return out;
}

/** The value of one budget key in a run's metrics (trends compare p50 for APIs: steadier than p95). */
function valueOf(m, key) {
  const [area, name, metric] = key.split('|');
  if (area === 'api') return metric === 'p95' ? m.api[name]?.p50 ?? null : null;
  if (key === 'app|launch') return m.launchMs;
  if (key === 'app|memory') return m.memoryMb;
  if (area === 'test') return m.tests[name]?.state === 'passed' ? m.tests[name].durationMs : null;
  return null;
}

/**
 * Trends: this run against the median of the last `lastRuns` earlier runs on the same device that had no failed
 * test. `earlier` = [{ metrics, deviceKey }] newest first. Returns { key, area, name, metric, now, baseline, runs,
 * pct, slower, text } for every value with enough history (APIs: p50 response time; launch; memory; test duration).
 */
export function checkTrends(m, dKey, earlier, budgets) {
  const cfg = budgets.trend;
  const same = earlier.filter((e) => e.deviceKey === dKey);
  const keys = [...Object.keys(m.api).map((ep) => `api|${ep}|p95`), 'app|launch', 'app|memory', ...Object.keys(m.tests).map((id) => `test|${id}`)];
  const out = [];
  for (const key of keys) {
    const now = valueOf(m, key);
    if (now == null) continue;
    const past = same.map((e) => valueOf(e.metrics, key)).filter((v) => v != null).slice(0, cfg.lastRuns);
    if (past.length < cfg.minRuns) continue;
    const baseline = median(past);
    const pct = baseline ? Math.round(((now - baseline) / baseline) * 100) : 0;
    const [area, name] = key.split('|');
    const unit = key === 'app|memory' ? 'MB' : 'ms';
    const minDiff = unit === 'MB' ? cfg.minMb : area === 'test' ? cfg.minTestMs : cfg.minMs;
    const slower = pct > cfg.slowerPct && now - baseline > minDiff;
    const metric = area === 'api' ? 'p50 response time' : key === 'app|launch' ? 'launch time' : key === 'app|memory' ? 'memory' : 'duration';
    out.push({
      key, area, name: area === 'app' ? (key === 'app|launch' ? 'App start (cold launch)' : 'Peak memory (PSS)') : name, metric, now, baseline, runs: past.length, pct, slower, unit,
      text: `${metric} ${fmt(now, unit)} vs ${fmt(baseline, unit)} (median of the last ${past.length} passing ${dKey.replace(/^(.*?) runs on /, (m, suites) => `${suites} run${past.length === 1 ? '' : 's'} on `)}): ${pct > 0 ? '+' : ''}${pct}%${slower ? `, more than the ${cfg.slowerPct}% allowed` : ''}.`,
    });
  }
  return out;
}
