// Phase 3: budgets (test/budgets.json), trends, response formats (test/api-formats.json), body cuts, launch times.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { percentile, withDefaults, runMetrics, checkBudgets, checkTrends, apiLimits, testLimitMs } from '@apptest/toolkit/dashboard/lib/budgets.js';
import { checkBody, checkCall, ruleFor } from '@apptest/toolkit/dashboard/lib/formats.js';
import { NetworkLog, issuesOf, LOG_LINE_MAX_BYTES } from '@apptest/toolkit/dashboard/lib/network.js';
import { launchTimesIn } from '@apptest/toolkit/dashboard/lib/logcat.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const B = withDefaults(JSON.parse(readFileSync(path.join(ROOT, 'test', 'budgets.json'), 'utf8')));
const RULES = JSON.parse(readFileSync(path.join(ROOT, 'test', 'api-formats.json'), 'utf8')).rules;

// ---------------------------------------------------------------- percentiles and budgets
test('p50 and p95 are nearest-rank percentiles', () => {
  const v = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 5000];
  assert.equal(percentile(v, 50), 1000);
  assert.equal(percentile(v, 95), 1900);
  assert.equal(percentile([700], 95), 700);
  assert.equal(percentile([], 50), null);
  assert.equal(percentile([3, null, 1, 2], 50), 2);
});

test('budgets.json: an API can have its own limits; the rest come from the defaults', () => {
  const otd = apiLimits(B, 'GET en.wikipedia.org/api/rest_v1/feed/onthisday/events/{mm}/{dd}');
  assert.equal(otd.maxKb, 600);
  assert.equal(otd.p95Ms, 2000);
  assert.equal(apiLimits(B, 'GET other').maxKb, 500);
  assert.equal(testLimitMs(B, 'TOUR-07'), 60000);
  assert.equal(testLimitMs(B, 'TOUR-01'), 45000);
  assert.equal(withDefaults({}).app.launchMs, 5000, 'a missing file falls back to the defaults');
});

const call = (endpoint, ms, bytes = 1000) => ({ endpoint, ms, bytes, url: 'https://en.wikipedia.org/x' });
const run = (apiMs, launch = 1200, mem = 200 * 1024, dur = 10000) => ({
  tests: [
    { id: 'TOUR-01', state: 'passed', durationMs: dur, perf: { launches: [{ activity: 'MainActivity', ms: launch }, { activity: 'Other', ms: 300 }], memoryPssKb: mem }, api: apiMs.map((ms) => call('GET a/feed', ms)) },
  ],
});

test('each budget says in one line what was measured, against what, and how many calls it is based on', () => {
  const m = runMetrics(run([400, 500, 2600], 6000, 320 * 1024));
  assert.deepEqual([m.api['GET a/feed'].n, m.api['GET a/feed'].p50, m.api['GET a/feed'].p95, m.launchMs, m.memoryMb], [3, 500, 2600, 6000, 320]);
  const items = checkBudgets(m, B);
  const p95 = items.find((x) => x.key === 'api|GET a/feed|p95');
  assert.equal(p95.ok, false);
  assert.match(p95.text, /^p95 2600 ms over the 2000 ms budget \(p50 500 ms, max 2600 ms, 3 calls; with 3 calls p95 is close to the slowest call\)\.$/);
  assert.equal(items.find((x) => x.key === 'app|launch').ok, false, 'first (cold) launch is the one checked, not the fastest');
  assert.equal(items.find((x) => x.key === 'app|memory').ok, false);
  assert.equal(items.find((x) => x.key === 'test|TOUR-01').ok, true);
});

test('trends: slower than the median of earlier passing runs, by more than the % and the minimum difference', () => {
  const earlier = [800, 820, 790, 810].map((ms) => ({ metrics: runMetrics(run([ms])), deviceKey: 'tour runs on Pixel · Android 14' }));
  const slower = checkTrends(runMetrics(run([1500])), 'tour runs on Pixel · Android 14', earlier, B).find((t) => t.key === 'api|GET a/feed|p95');
  assert.equal(slower.slower, true);
  assert.equal(slower.baseline, 800);
  assert.match(slower.text, /p50 response time 1500 ms vs 800 ms \(median of the last 4 passing tour runs on Pixel · Android 14\): \+88%, more than the 50% allowed\./);
  // +62% but only 250 ms more: under the minimum difference (300 ms), not reported as slower
  const small = checkTrends(runMetrics(run([650])), 'tour runs on Pixel · Android 14', earlier.map((e) => ({ ...e, metrics: runMetrics(run([400])) })), B).find((t) => t.area === 'api');
  assert.equal(small.slower, false);
  // another device, or too few runs: no trend at all
  assert.equal(checkTrends(runMetrics(run([1500])), 'tour runs on Other · Android 12', earlier, B).length, 0);
  assert.equal(checkTrends(runMetrics(run([1500])), 'tour runs on Pixel · Android 14', earlier.slice(0, 2), B).length, 0);
  // test durations need at least 5 s more (emulator noise)
  const durs = [10000, 11000, 10500].map((d) => ({ metrics: runMetrics(run([800], 1200, 200 * 1024, d)), deviceKey: 'k' }));
  assert.equal(checkTrends(runMetrics(run([800], 1200, 200 * 1024, 14000)), 'k', durs, B).find((t) => t.area === 'test').slower, false);
  assert.equal(checkTrends(runMetrics(run([800], 1200, 200 * 1024, 17000)), 'k', durs, B).find((t) => t.area === 'test').slower, true);
});

test('per-API limits decide the per-call "slow" and "large" warnings', () => {
  const c = { url: 'https://en.wikipedia.org/x', status: 200, ms: 2500, bytes: 550 * 1024, contentType: 'application/json' };
  assert.equal(issuesOf(c, { slowCallMs: 2000, maxKb: 500 }).length, 2);
  assert.deepEqual(issuesOf(c, { slowCallMs: 3000, maxKb: 600 }), []);
});

// ---------------------------------------------------------------- response formats
const featured = RULES.find((r) => r.match.includes('feed/featured'));
const goodFeatured = { tfa: { title: 'T', extract: 'x' }, mostread: { articles: [{ title: 'A', views: 1 }] }, image: { title: 'File:x', thumbnail: { source: 'https://x' } }, news: [{ story: 's', links: [] }], onthisday: [{ text: 't', year: 1900 }] };

test('a body with every field the app relies on passes', () => {
  const r = checkBody(goodFeatured, featured);
  assert.deepEqual(r.problems, []);
  assert.ok(r.checked >= 10);
  assert.deepEqual(checkBody({}, featured).problems, [], 'every top-level part of the featured feed is optional');
});

test('missing fields and wrong types are named with their path, what was expected and what came', () => {
  const body = structuredClone(goodFeatured);
  body.mostread.articles.push({ title: 42 });
  delete body.image.thumbnail;
  body.news[0].links = 'none';
  const texts = checkBody(body, featured).problems.map((p) => p.text);
  assert.ok(texts.includes('mostread.articles[1].title should be text but is a number.'), texts.join('\n'));
  assert.ok(texts.includes('image.thumbnail is missing (expected an object).'), texts.join('\n'));
  assert.ok(texts.includes('news[0].links should be a list but is text ("none").'), texts.join('\n'));
  // an optional field that is there must still have its type
  body.mostread.articles[0].views = 'many';
  assert.ok(checkBody(body, featured).problems.some((p) => p.text === 'mostread.articles[0].views should be a number but is text ("many").'));
});

test('nonEmpty lists and unknown types in a rule are reported', () => {
  const rnd = RULES.find((r) => r.match.includes('generator=random'));
  assert.ok(checkBody({ query: { pages: [] } }, rnd).problems.some((p) => /query\.pages is an empty list/.test(p.text)));
  assert.match(checkBody({ a: 1 }, { fields: { a: 'integer' } }).problems[0].text, /Rule error: unknown type "integer"/);
});

test('a call is only checked when it can be: rule, status, a complete body', () => {
  const c = { endpoint: 'GET en.wikipedia.org/api/rest_v1/feed/featured/{yyyy}/{mm}/{dd}', url: 'https://en.wikipedia.org/api/rest_v1/feed/featured/2026/11/13', status: 200 };
  assert.equal(ruleFor(c, RULES).name, 'Featured content feed (Explore / Home)');
  assert.equal(checkCall({ ...c, endpoint: 'GET x', url: 'https://x' }, RULES, '{}'), null, 'no rule: nothing to say');
  assert.equal(checkCall({ ...c, status: null }, RULES, null), null, 'no response: already reported as such');
  assert.match(checkCall({ ...c, status: 304 }, RULES, '').reason, /rules are for status 200; this response was 304/);
  assert.match(checkCall({ ...c, bodyMissing: 'Response body not recorded: BASIC logging.' }, RULES, null).reason, /BASIC logging/);
  assert.match(checkCall({ ...c, bodyCut: 3 }, RULES, '{"tfa":{"s"https').reason, /lost text in the Android log \(3 of its pieces were longer than Android's 4,059-byte line limit/);
  assert.equal(checkCall(c, RULES, JSON.stringify(goodFeatured)).status, 'ok');
});

// ---------------------------------------------------------------- the Android log: cut pieces, launch lines
test("pieces longer than Android's 4,059-byte log line are noted as cut, and the body says why it is not valid JSON", () => {
  const H = (m) => `11-13 11:23:34.722  4629  4763 I OkHttp  : ${m}`;
  const text = JSON.stringify({ tfa: { title: 'T', extract: 'Fujiwara – période '.repeat(400) } });
  const pieces = [];
  for (let k = 0; k < text.length; k += 4000) { let p = text.slice(k, k + 4000); while (Buffer.byteLength(p) > LOG_LINE_MAX_BYTES) p = p.slice(0, -1); pieces.push(p); }
  const lines = [H('--> GET https://en.wikipedia.org/api/rest_v1/feed/featured/2026/11/13'), H('--> END GET'), H('<-- 200 https://en.wikipedia.org/api/rest_v1/feed/featured/2026/11/13 (300ms)'), H('content-type: application/json'), H(''), ...pieces.map(H), H(`<-- END HTTP (310ms, ${text.length}-byte body)`)];
  const [c] = new NetworkLog({ pkg: 'org.wikipedia.dev' }).parse(lines);
  assert.ok(c.bodyCut >= 1, 'cut pieces are counted');
  assert.match(c.shape, /^JSON that lost text in the Android log: \d+ of its 4,000-character pieces were longer than Android's 4,059-byte line limit/);
  // plain ASCII bodies are never marked as cut
  const ascii = JSON.stringify({ a: 'x'.repeat(9000) });
  const [d] = new NetworkLog({}).parse([H('--> GET https://e/x'), H('--> END GET'), H('<-- 200 https://e/x (5ms)'), H(''), H(ascii.slice(0, 4000)), H(ascii.slice(4000, 8000)), H(ascii.slice(8000)), H(`<-- END HTTP (6ms, ${ascii.length}-byte body)`)]);
  assert.equal(d.bodyCut, undefined);
  assert.equal(JSON.parse(d.body).a.length, 9000);
});

test('launch times are read from both forms of Android\'s "Displayed" line', () => {
  const lines = [
    '11-12 10:00:01.000   555   570 I ActivityTaskManager: Displayed org.wikipedia.dev/org.wikipedia.main.MainActivity: +1s234ms',
    '11-13 10:54:45.043   707   739 I ActivityTaskManager: Displayed org.wikipedia.dev/org.wikipedia.onboarding.InitialOnboardingActivity for user 0: +6s311ms',
    '11-13 10:54:46.043   707   739 I ActivityTaskManager: Displayed com.other/.Main for user 0: +500ms',
    '11-13 10:54:47.043   707   739 I ActivityTaskManager: Displayed org.wikipedia.dev/.settings.SettingsActivity for user 0: +87ms',
  ];
  assert.deepEqual(launchTimesIn(lines, 'org.wikipedia.dev'), [{ activity: 'MainActivity', ms: 1234 }, { activity: 'InitialOnboardingActivity', ms: 6311 }, { activity: 'SettingsActivity', ms: 87 }]);
});
