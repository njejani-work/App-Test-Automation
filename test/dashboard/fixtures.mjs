// Demo / test data for the dashboard: realistic runs made WITHOUT a device.
// The real recorder is used with a pretend driver, so the files are exactly what a real run writes.
//
//   node test/dashboard/fixtures.mjs <reportsDir>       (npm run dashboard:demo uses reports-demo/)
//
// What is in it (oldest first): 3 clean tour runs (one from GitHub Actions); a REGRESSION (TOUR-07 passed on build #3,
// fails on #4 with the same test code); a smoke run; a search failure caused by the network (environment);
// the same search test passing on the same build and test code (FLAKY); new test code that breaks two tests with
// one error (test bug); an app crash (product bug); a test-code error (TypeError); a slow test; a session that
// could not start (with the real reason from the WebdriverIO log); a run with no APK; and a run in the OLD format.
// API calls cover every ending: answered, HTTP error, network failure, cut off by the test setup's restart,
// by the test closing the app, by a crash, by the next request on the same thread, and by the end of the session.
// Its own triage file (quarantine with an active and an expired entry) is written next to the reports.
import { copyFileSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const reportsDir = path.resolve(process.argv[2] || 'reports-demo');
process.env.DASHBOARD_REPORTS_DIR = reportsDir;
process.env.APP_ID = 'org.wikipedia.dev';
process.env.DASHBOARD_KEEP_RUNS = process.env.DASHBOARD_KEEP_RUNS || '30';
rmSync(reportsDir, { recursive: true, force: true });
mkdirSync(reportsDir, { recursive: true });

const here = path.dirname(fileURLToPath(import.meta.url));
// Demo triage file: the project's real one plus a quarantine that has expired (TOUR-04, until 1 Nov 2026)
const triage = JSON.parse(readFileSync(path.resolve(here, '..', 'triage.json'), 'utf8'));
triage.quarantine = [
  { test: 'TOUR-04', reason: 'Search results load slowly on the CI emulator', owner: 'Nishant', until: '2026-11-01', added: '2026-10-20', ticket: 'https://github.com/example/wikiApp_compileToTest/issues/3' },
];
const triageFile = path.join(reportsDir, '.fixture-triage.json');
writeFileSync(triageFile, JSON.stringify(triage, null, 2));
process.env.DASHBOARD_TRIAGE_FILE = triageFile;
// Budgets and response format rules: copies of the project's own files, so a change there does not change the demo
for (const [name, env] of [['budgets.json', 'DASHBOARD_BUDGETS_FILE'], ['api-formats.json', 'DASHBOARD_FORMATS_FILE']]) {
  const file = path.join(reportsDir, '.fixture-' + name);
  writeFileSync(file, readFileSync(path.resolve(here, '..', name), 'utf8'));
  process.env[env] = file;
}
const R = await import('../support/report/recorder.js');
const D = await import('../support/report/dashboard.mjs');

// A small, valid PNG used as every screenshot: a grey "phone screen" with a blue top bar and a bottom bar
function png(w, h, pixel) {
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 3 + 1)] = 0; for (let x = 0; x < w; x++) { const [r, g, b] = pixel(x, y); const o = y * (w * 3 + 1) + 1 + x * 3; raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; } }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
const PNG = png(180, 320, (x, y) => (y < 28 ? [42, 120, 214] : y > 292 ? [230, 230, 228] : (y - 40) % 36 < 24 && x > 12 && x < 168 ? [214, 214, 210] : [250, 250, 249]));
const shotFile = path.join(reportsDir, '.fixture-shot.png');
writeFileSync(shotFile, PNG);

const BASE = Date.UTC(2026, 10, 10, 4, 0, 0); // 10 Nov 2026 04:00 UTC
const T = [
  'TOUR-01 the app opens and reaches the main screen (intro + personalisation done)',
  'TOUR-02 Home: Community and For you feeds',
  'TOUR-03 Saved: "All articles" and "Reading lists" tabs and the ⋮ menu',
  'TOUR-04 Search: search bar and reading history',
  'TOUR-05 Activity: opens (intro closed if shown), logged-out message',
  'TOUR-06 More: menu with Log in, Games, Places, Settings, Donate',
  'TOUR-07 Saved: create a new reading list with a random name ("QA list RND")',
  'TOUR-08 exit the app',
];
const SMK = [
  'SMK-01 [P0] the built APK is installed and the app starts',
  'SMK-02 [P0] the intro can be completed and the main screen opens',
  'SMK-03 [P0] the bottom navigation shows all five tabs',
  'SMK-04 [P0] searching for "Albert Einstein" shows matching results',
];
const FEED_ERR = 'element ("android=new UiSelector().resourceIdMatches(\\".*:id/feed_view\\")") still not displayed after 15000ms';
const devices = [
  { platformVersion: '14', deviceName: 'emulator-5554', deviceModel: 'sdk_gphone64_x86_64', deviceApiLevel: 34, deviceScreenSize: '1080x2400' },
  { platformVersion: '12', deviceName: 'emulator-5556', deviceModel: 'Pixel_4_API_31', deviceApiLevel: 31, deviceScreenSize: '1080x2280' },
];
const COMMIT_1 = 'a1b2c3d4e5f60718293a4b5c6d7e8f9012345678';
const COMMIT_2 = 'f9e8d7c6b5a40312cdef0123456789abcdef0123'; // new test code from run 8 on
const TYPEERR = "TypeError: Cannot read properties of undefined (reading 'click')";
const plan = [
  { b: 1, dev: 0, tests: T, fail: {}, code: COMMIT_1 },
  { b: 2, dev: 0, tests: T, fail: {}, code: COMMIT_1 },
  { b: 3, dev: 0, tests: T, fail: {}, code: COMMIT_1, ci: true },
  { b: 4, dev: 0, tests: T, fail: { 6: 'Saved ⋮ menu did not open' }, code: COMMIT_1, superseded: true },
  { b: 4, dev: 0, tests: SMK, fail: {}, suite: 'smoke', code: COMMIT_1 },
  { b: 5, dev: 0, tests: T, fail: { 6: 'Saved ⋮ menu did not open', 3: 'SearchPage did not open within 20000 ms' }, apiFail: true, code: COMMIT_1 },
  { b: 5, dev: 1, tests: T, fail: { 6: 'Saved ⋮ menu did not open' }, code: COMMIT_1 },
  { b: 6, dev: 0, tests: T, fail: { 6: 'Saved ⋮ menu did not open', 3: 'SearchPage did not open within 20000 ms', 1: FEED_ERR, 2: FEED_ERR }, crash: 4, code: COMMIT_2, cutBody: true },
  { b: 6, dev: 0, tests: SMK, fail: { 3: TYPEERR }, suite: 'smoke', code: COMMIT_2, openAtEnd: true },
  { b: 7, dev: 0, tests: T, fail: { 3: 'SearchPage did not open within 20000 ms', 1: FEED_ERR, 2: FEED_ERR, 6: 'Saved ⋮ menu did not open' }, crash: 4, slow: 5, code: COMMIT_2, dirty: true, slowLaunch: true, badFormat: true },
];
const STEPS = {
  'TOUR-01': ['OnboardingPage: tap ~Forward', 'OnboardingPage: tap ~Forward', 'OnboardingPage: tap ~Forward', 'PersonalizationPage: tap "Skip"'],
  'TOUR-02': ['Bottom bar: tap "Home"', 'HomePage: tap "Community"', 'HomePage: tap "For you"'],
  'TOUR-03': ['Bottom bar: tap "Saved"', 'Pop-up: tap "No thanks"', 'SavedPage: tap id menu_overflow_button'],
  'TOUR-04': ['Bottom bar: tap "Search"', 'Pop-up: tap "Close"'],
  'TOUR-05': ['Bottom bar: tap "Activity"', 'ActivityPage: tap "Continue"'],
  'TOUR-06': ['Bottom bar: tap "More"', 'Press Android Back'],
  'TOUR-07': ['Bottom bar: tap "Saved"', 'SavedPage: tap "Reading lists"', 'SavedPage: tap id menu_overflow_button'],
  'TOUR-08': ['Close the app'],
};

let logs = [];
let mem = 180000;
let jank = 10;
const gfx = (j) => `Total frames rendered: 400\nJanky frames: ${j} (${(j / 4).toFixed(2)}%)\n90th percentile: ${10 + (j % 9)}ms`;
const PID = '4321';
// Android log lines. Times are milliseconds from 10:00:00 so every event has a realistic time stamp.
const ts = (ms) => { const t = Math.max(0, Math.round(ms)); return `11-12 10:${String(Math.floor(t / 60000)).padStart(2, '0')}:${String(Math.floor((t % 60000) / 1000)).padStart(2, '0')}.${String(t % 1000).padStart(3, '0')}`; };
const L = (sec, tid, tag, msg, level = 'I', pid = PID) => `${ts(sec * 1000 + 7)}  ${pid}  ${tid} ${level} ${tag}: ${msg}`;
const Hm = (ms, tid, m) => `${ts(ms)}  ${PID}  ${tid} I OkHttp  : ${m}`;
const H = (sec, tid, m) => Hm(sec * 1000 + tid, tid, m);
const AM = (sec, msg) => `${ts(sec * 1000 + 900)}   555   570 I ActivityManager: ${msg}`;

/** Android keeps at most 4,059 bytes of one log message: longer pieces lose their end (never half a character). */
function cutToLogLimit(piece) {
  let out = piece;
  while (Buffer.byteLength(out, 'utf8') > 4059) out = out.slice(0, -1);
  return out;
}
/** One API call as the app logs it at BODY level. status 'FAIL' = network error; 'OPEN' = request only. */
function call(sec, tid, url, status, ms, body = '', ctype = 'application/json; charset=utf-8', method = 'GET') {
  const t0 = sec * 1000 + tid;
  const out = [Hm(t0, tid, `--> ${method} ${url}`), Hm(t0 + 1, tid, 'User-Agent: WikipediaApp/50616-dev'), Hm(t0 + 1, tid, 'Cookie: GeoIP=XX:XX'), Hm(t0 + 2, tid, `--> END ${method}`)];
  if (status === 'OPEN') return out;
  if (status === 'FAIL') return [...out, Hm(t0 + 10000, tid, '<-- HTTP FAILED: java.net.SocketTimeoutException: timeout')];
  const th = t0 + ms, tb = th + Math.max(3, Math.round(body.length / 400));
  out.push(Hm(th, tid, `<-- ${status} ${url} (${ms}ms)`), Hm(th, tid, 'content-type: ' + ctype), Hm(th, tid, 'set-cookie: WMF-Last-Access=12-Nov'), `${ts(th)}  ${PID}  ${tid} I OkHttp  :`);
  for (let k = 0; k < body.length; k += 4000) out.push(Hm(tb, tid, cutToLogLimit(body.slice(k, k + 4000))));
  out.push(Hm(tb, tid, `<-- END HTTP (${tb - t0}ms, ${body.length}-byte body)`));
  return out;
}
const FEATURED = 'https://en.wikipedia.org/api/rest_v1/feed/featured/2026/11/12?lang=en';
// Featured feed as the app gets it. cut = text with – and é (2-3 bytes each), so Android's log cuts its pieces;
// bad = mostread title sent as a number (a format problem against test/api-formats.json)
const featuredBody = (n, { cut = false, bad = false } = {}) => JSON.stringify({
  tfa: { title: 'Fujiwara_no_Matate', extract: (cut ? 'Fujiwara no Matate – a Japanese noble of the Heian période – ' : 'Fujiwara no Matate was a Japanese noble. ').repeat(200) },
  mostread: { date: '2026-11-11Z', articles: [{ title: bad ? 12345 : 'Albert_Einstein', views: 123456 + n }] },
  image: { title: 'File:Rgh-badge.png', thumbnail: { source: 'https://upload.wikimedia.org/x/Rgh-badge.png' } },
  news: [{ story: 'A', links: [] }, { story: 'B', links: [] }],
});

function apiLines(i, n, p) {
  if (p.suite) {
    // Smoke: a search call; in the last smoke run one search request is still waiting when the session ends
    if (i === 3) return [...call(30, 31, 'https://en.wikipedia.org/w/api.php?format=json&action=query&list=search&srsearch=Albert%20Einstein', 200, 240, JSON.stringify({ query: { search: [{ title: 'Albert Einstein' }] } })),
      ...(p.openAtEnd ? call(31, 32, 'https://en.wikipedia.org/w/api.php?format=json&action=query&list=prefixsearch&pssearch=Albert', 'OPEN') : [])];
    return [];
  }
  const out = [];
  if (i === 0) {
    out.push(...call(2, 11, 'https://meta.wikimedia.beta.wmcloud.org/w/api.php?format=json&formatversion=2&action=streamconfigs&format=json', 403, 308, '<!DOCTYPE html><html><head><title>Wikimedia Error</title></head><body><p>Request refused by the beta cluster</p></body></html>', 'text/html'));
    out.push(...call(2, 12, FEATURED, 200, 300 + n * 20, featuredBody(n, { cut: p.cutBody, bad: p.badFormat })));
    out.push(...call(3, 13, 'https://en.wikipedia.org/w/api.php?format=json&formatversion=2&action=query&generator=random&grnfilterredir=nonredirects&grnnamespace=0&prop=pageprops|pageimages|description|info|extracts&exchars=500&grnlimit=10', 200, 1300 + n * 150, JSON.stringify({ batchcomplete: true, query: { pages: [{ pageid: 1, title: 'Random A', description: 'A random page', extract: 'Lorem ipsum' }] } })));
    if (p.superseded) out.push(H(4, 14, '--> GET https://en.wikipedia.org/api/rest_v1/page/summary/Lost_call'), ...call(5, 14, 'https://en.wikipedia.org/api/rest_v1/page/summary/Next_call', 200, 90, JSON.stringify({ title: 'Next call' })));
  }
  if (i === 3) {
    out.push(...call(10, 14, 'https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/11/12', 200, 114, JSON.stringify({ events: [{ text: 'Something happened', year: 1927, pages: [{ title: 'Something', extract: 'It happened.' }] }] })));
    out.push(...call(11, 15, 'https://en.wikipedia.org/api/rest_v1/page/random/summary', 200, 633, JSON.stringify({ title: 'Fujiwara no Matate', description: 'Japanese noble' })));
    if (p.apiFail) out.push(...call(12, 16, 'https://en.wikipedia.org/w/api.php?format=json&action=query&list=search&srsearch=Albert', 'FAIL'));
  }
  if (i === 4 && p.crash === 4) out.push(...call(20, 17, 'https://en.wikipedia.org/api/rest_v1/page/summary/Activity_feed', 'OPEN'));
  if (i === 7) out.push(...call(40, 18, 'https://en.wikipedia.org/api/rest_v1/page/summary/Exit_check', 'OPEN')); // still waiting when the test closes the app
  return out;
}

for (const [n, p] of plan.entries()) {
  const start = new Date(BASE + n * 3600_000);
  const info = {
    build_id: `2026111${p.b % 10}-120000-57644dbe${p.b}a`, build_number: String(p.b), // one build id per build number, like real builds app_name: 'apps-android-wikipedia',
    app_repo: 'https://github.com/njejani-work/apps-android-wikipedia.git', commit: `57644dbeea${p.b}`.padEnd(40, '0'), variant: 'devDebug',
    application_id: 'org.wikipedia.dev', version_name: `50616-dev-2026-11-1${p.b % 10}`, version_code: '50616', apk_file: `apps-android-wikipedia-devDebug-b${p.b}.apk`, apk_sha256: 'ab'.repeat(32),
  };
  if (p.ci) Object.assign(process.env, { GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'example/wikiApp_compileToTest', GITHUB_RUN_ID: '1234567', GITHUB_RUN_NUMBER: '42', GITHUB_EVENT_NAME: 'push', GITHUB_WORKFLOW: 'Compile and smoke test', GITHUB_JOB: 'smoke', GITHUB_ACTOR: 'ci-bot', GITHUB_REF_NAME: 'main' });
  const { dir } = R.startRun({ suites: [p.suite || 'tour'], apk: { path: '/x.apk', info }, now: start });
  for (const k of ['GITHUB_ACTIONS', 'GITHUB_REPOSITORY', 'GITHUB_RUN_ID', 'GITHUB_RUN_NUMBER', 'GITHUB_EVENT_NAME', 'GITHUB_WORKFLOW', 'GITHUB_JOB', 'GITHUB_ACTOR', 'GITHUB_REF_NAME']) delete process.env[k];
  // The test project's own commit (git is not available for the demo data): fixed per scenario
  const runJson = path.join(dir, 'run.json');
  const rj = JSON.parse(readFileSync(runJson, 'utf8'));
  rj.details.project = { branch: 'main', commit: p.code, commitMessage: p.code === COMMIT_2 ? 'Rework Home feed checks' : 'Compile-and-test project for the Wikipedia app', dirty: !!p.dirty, remote: 'https://github.com/example/wikiApp_compileToTest.git' };
  writeFileSync(runJson, JSON.stringify(rj, null, 2));
  globalThis.driver = {
    capabilities: devices[p.dev],
    getLogs: async () => { const l = logs; logs = []; return l.map((message) => ({ message })); },
    startRecordingScreen: async () => {},
    stopRecordingScreen: async () => Buffer.from('not-a-real-video').toString('base64'),
    getPerformanceData: async () => [['totalPrivateDirty', 'totalPss'], ['1', String((mem += 2500))]],
    execute: async (c, a) => {
      if (c === 'mobile: startActivity') return ''; // the setup opens the app (prepareApp)
      if (a.command === 'run-as') return '<?xml version="1.0"?>\n<map>\n</map>\n';
      if (a.command === 'getprop') return { 'ro.build.fingerprint': `google/sdk_gphone64_x86_64/emu64xa:${devices[p.dev].platformVersion}/UE1A.230829.036/1:userdebug/dev-keys`, 'ro.kernel.qemu': '1', 'ro.build.version.security_patch': '2026-10-05', 'ro.product.cpu.abi': 'x86_64' }[a.args[0]] || '';
      if (a.args.includes('com.google.android.webview')) return 'versionName=131.0.6778.135';
      return a.args.includes('reset') ? '' : gfx((jank += 3));
    },
    terminateApp: async () => {}, activateApp: async () => {}, queryAppState: async () => 4, pushFile: async () => {}, waitUntil: async (f) => f(),
  };
  globalThis.browser = { saveScreenshot: async (f) => copyFileSync(shotFile, f) };
  await R.recordDevice('0-0');
  // The app is opened once by the setup, after full API logging is switched on (appium:autoLaunch false)
  logs = [];
  await R.prepareApp('0-0');
  for (const [i, title] of p.tests.entries()) {
    const id = title.slice(0, title.indexOf(' '));
    logs = i === 0 ? ['11-12 10:00:00.000   555   560 I ActivityManager: Start proc 4321:org.wikipedia.dev/u0a190 for activity', p.slowLaunch ? '11-12 10:00:01.000   555   570 I ActivityTaskManager: Displayed org.wikipedia.dev/org.wikipedia.onboarding.InitialOnboardingActivity for user 0: +4s100ms' : `11-12 10:00:01.000   555   570 I ActivityTaskManager: Displayed org.wikipedia.dev/org.wikipedia.main.MainActivity: +1s${200 + n * 40}ms`] : [];
    await R.beforeEachTest({ title });
    for (const st of STEPS[id] || ['Bottom bar: tap "Search"']) R.step(st);
    if (id === 'TOUR-03') R.note('Closed a pop-up with "No thanks"');
    const msg = p.fail[i];
    logs = apiLines(i, n, p);
    if (id === 'TOUR-08') { await R.appClosingByTest(); logs = [AM(41, 'Force stopping org.wikipedia.dev appid=10190 user=0: from pid 555')]; }
    if (p.crash === i) logs.push(
      L(21, 4321, 'AndroidRuntime', 'FATAL EXCEPTION: main', 'E'),
      L(21, 4321, 'AndroidRuntime', 'java.lang.NullPointerException: Attempt to invoke virtual method on a null object reference', 'E'),
      AM(22, 'Process org.wikipedia.dev (pid 4321) has died: fg TOP'));
    const root = path.resolve(here, '..', '..');
    const err = msg ? Object.assign(new Error(msg), { stack: `Error: ${msg}\n    at async SavedPage.openMenu (file://${root.startsWith('/') ? '' : '/'}${root.replace(/\\/g, '/')}/test/pageobjects/SavedPage.js:44:5)` }) : null;
    await R.afterEachTest({ title: title.replace('RND', 'q' + n + 'x7k2'), parent: p.suite ? 'Smoke' : 'Bottom navigation tour', file: path.join(root, 'test/specs', p.suite || 'tour', 'x.e2e.js') },
      { error: err, passed: !msg, duration: p.slow === i ? 52000 : 3000 + i * 900, retries: { attempts: 0 } }, '0-0');
  }
  await R.finishSession();
  R.finishRun(Object.keys(p.fail).length ? 1 : 0, new Date(start.getTime() + 4 * 60_000 + n * 7000));
}

// A session that could not start: the reason comes from WebdriverIO's own log, like a real run
mkdirSync(path.join(reportsDir, 'logs'), { recursive: true });
writeFileSync(path.join(reportsDir, 'logs', 'wdio-0-0.log'), [
  '2026-11-10T15:00:01.000Z INFO webdriver: Initiate new session using the WebDriver protocol',
  '2026-11-10T15:00:41.000Z ERROR webdriver: WebDriverError: An unknown server-side error occurred while processing the command. Original error: Could not find a connected Android device in 20000ms. when running "http://127.0.0.1:4723/session"',
].join('\n'));
R.startRun({ suites: ['tour'], apk: { path: '/x.apk', info: { build_number: '7', build_id: '20261110-150000-57644dbe7a', version_name: '50616-dev-2026-11-17', application_id: 'org.wikipedia.dev' } }, now: new Date(BASE + plan.length * 3600_000) });
R.recordWorkerFailure('0-0', 1);
R.finishRun(1, new Date(BASE + plan.length * 3600_000 + 45_000));

// A run that could not start at all (no APK)
R.startRun({ suites: ['tour'], apk: { path: '', info: {} }, setupError: 'No APK found in out/. Run npm run build:apk first.', now: new Date(BASE + (plan.length + 1) * 3600_000) });

// A run in the OLD format (schemaVersion 0): no details, no api[], API calls only in the saved log
const old = path.join(reportsDir, 'runs', '20261109-090000');
mkdirSync(path.join(old, 'tests'), { recursive: true });
mkdirSync(path.join(old, 'logcat'), { recursive: true });
writeFileSync(path.join(old, 'run.json'), JSON.stringify({ runId: '20261109-090000', suites: ['tour'], startedAt: '2026-11-09T03:30:00.000Z', endedAt: '2026-11-09T03:34:00.000Z', exitCode: 0, env: 'local', apk: { build_id: '20261109-0850-57644dbeea', version_name: '50616-dev-2026-11-09', application_id: 'org.wikipedia.dev', variant: 'devDebug' } }, null, 2));
writeFileSync(path.join(old, 'device-0-0.json'), JSON.stringify({ platformVersion: '14', deviceModel: 'sdk_gphone64_x86_64' }));
writeFileSync(path.join(old, 'logcat', '001-w0-0-TOUR-01-old.txt'), [
  '11-09 09:30:16.138  5988  6012 I OkHttp  : --> GET https://en.wikipedia.org/api/rest_v1/feed/featured/2026/11/09?lang=en',
  '11-09 09:30:16.502  5988  6012 I OkHttp  : <-- 200 https://en.wikipedia.org/api/rest_v1/feed/featured/2026/11/09?lang=en (335ms, unknown-length body)',
].join('\n'));
writeFileSync(path.join(old, 'tests', '001-w0-0-TOUR-01-old.json'), JSON.stringify({ seq: 1, id: 'TOUR-01', title: T[0], suite: 'Bottom navigation tour', state: 'passed', durationMs: 21000, finishedAt: '2026-11-09T03:31:00.000Z', error: null, warnings: [], notes: [], screenshot: null, logcatFile: 'logcat/001-w0-0-TOUR-01-old.txt', logcat: { errors: [], errorCount: 0, warnings: [], warningCount: 0 } }));

rmSync(shotFile, { force: true });
const { file, runs } = D.buildDashboard({ all: true });
console.log(`Demo dashboard: ${runs.length} runs in ${reportsDir}\n  ${file}`);
