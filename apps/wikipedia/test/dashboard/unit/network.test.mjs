// Unit tests for the API log parser (test/support/report/network.js). Run: npm run test:dashboard:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NetworkLog, endpointOf, issuesOf, explainFailure, shapeOf, resolutionOf, openApp, enableHttpBodyLogging } from '../../support/report/network.js';

const L = (tid, msg) => `11-12 11:08:16.138  5988  ${tid} I OkHttp  : ${msg}`;

test('BASIC level: one request + one response line make one call', () => {
  const calls = new NetworkLog().parse([
    L(1, '--> GET https://en.wikipedia.org/api/rest_v1/feed/featured/2026/11/12?lang=en'),
    L(1, '<-- 200 https://en.wikipedia.org/api/rest_v1/feed/featured/2026/11/12?lang=en (335ms, 12345-byte body)'),
  ]);
  assert.equal(calls.length, 1);
  const c = calls[0];
  assert.equal(c.method, 'GET');
  assert.equal(c.status, 200);
  assert.equal(c.ms, 335);
  assert.equal(c.bytes, 12345);
  assert.equal(c.body, null);
  assert.equal(c.endpoint, 'GET en.wikipedia.org/api/rest_v1/feed/featured/{yyyy}/{mm}/{dd}');
  assert.deepEqual(c.issues, []);
});

test('BODY level: headers kept, secret headers hidden, a 4000-character split JSON body is joined back', () => {
  const body = JSON.stringify({ tfa: { extract: 'x'.repeat(5000) }, ok: true });
  const calls = new NetworkLog().parse([
    L(2, '--> GET https://en.wikipedia.org/api/rest_v1/page/summary/Albert_Einstein'),
    L(2, 'User-Agent: WikipediaApp/2.7'),
    L(2, 'Cookie: GeoIP=IN:DL:Delhi:28.6:77.2'),
    L(2, '--> END GET'),
    L(2, '<-- 200 https://en.wikipedia.org/api/rest_v1/page/summary/Albert_Einstein (120ms)'),
    L(2, 'content-type: application/json; charset=utf-8'),
    L(2, 'set-cookie: WMF-Last-Access=12-Nov-2026'),
    '11-12 11:08:16.138  5988  2 I OkHttp  :',
    L(2, body.slice(0, 4000)),
    L(2, body.slice(4000)),
    L(2, `<-- END HTTP (120ms, ${body.length}-byte body)`),
  ]);
  assert.equal(calls.length, 1);
  const c = calls[0];
  assert.equal(c.reqHeaders['user-agent'], 'WikipediaApp/2.7');
  assert.equal(c.reqHeaders.cookie, '(hidden)');
  assert.equal(c.resHeaders['set-cookie'], '(hidden)');
  assert.equal(c.contentType, 'application/json; charset=utf-8');
  assert.equal(c.body, body);
  assert.deepEqual(JSON.parse(c.body).ok, true);
  assert.equal(c.endpoint, 'GET en.wikipedia.org/api/rest_v1/page/summary/{title}');
});

test('a body spread over several short lines keeps its line breaks', () => {
  const calls = new NetworkLog().parse([
    L(3, '--> GET https://example.org/a'), L(3, '--> END GET'),
    L(3, '<-- 200 https://example.org/a (5ms)'), L(3, 'content-type: text/plain'), L(3, ''),
    L(3, 'line one'), L(3, 'line two'), L(3, '<-- END HTTP (5ms, 17-byte body)'),
  ]);
  assert.equal(calls[0].body, 'line one\nline two');
});

test('calls on different threads are kept apart even when their lines interleave', () => {
  const calls = new NetworkLog().parse([
    L(1, '--> GET https://a.example/1'),
    L(2, '--> GET https://b.example/2'),
    L(2, '<-- 404 https://b.example/2 (20ms, 10-byte body)'),
    L(1, '<-- 200 https://a.example/1 (30ms, 5-byte body)'),
  ]);
  assert.deepEqual(calls.map((c) => [c.url, c.status]), [['https://b.example/2', 404], ['https://a.example/1', 200]]);
});

test('a call that starts in one batch of lines and ends in the next is still one call', () => {
  const log = new NetworkLog();
  assert.equal(log.parse([L(7, '--> GET https://a.example/slow')]).length, 0);
  const calls = log.parse([L(7, '<-- 200 https://a.example/slow (2500ms, 9-byte body)')]);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].ms, 2500);
  assert.match(calls[0].issues[0].reason, /^Slow: a\.example took 2\.5 s to answer/);
});

test('network failure: no response, reason says why', () => {
  const [c] = new NetworkLog().parse([
    L(4, '--> GET https://en.wikipedia.org/api/rest_v1/page/summary/X'),
    L(4, '<-- HTTP FAILED: java.net.UnknownHostException: Unable to resolve host "en.wikipedia.org"'),
  ]);
  assert.equal(c.status, null);
  assert.equal(c.issues[0].level, 'fail');
  assert.match(c.issues[0].reason, /could not look up en\.wikipedia\.org/);
  assert.match(c.issues[0].reason, /no internet connection or its DNS/);
  assert.match(c.resolution, /^No response\. The phone could not look up en\.wikipedia\.org \(UnknownHostException\)/);
  assert.deepEqual(c.events.map((e) => e.kind), ['start', 'failed']);
});

test('unfinished call (no response before the test ended) is a warning', () => {
  const log = new NetworkLog();
  log.parse([L(9, '--> GET https://a.example/never')]);
  const [c] = log.flushOpen();
  assert.equal(c.unfinished, true);
  assert.equal(c.issues[0].level, 'warn');
  assert.match(c.noResponse.reason, /nothing in the Android log says why/);
});

test('binary bodies are noted, not stored; large responses are warned about', () => {
  const [c] = new NetworkLog().parse([
    L(5, '--> GET https://upload.wikimedia.org/wikipedia/commons/4/49/Rgh-badge.png'),
    L(5, '<-- 200 https://upload.wikimedia.org/wikipedia/commons/4/49/Rgh-badge.png (833ms)'),
    L(5, 'content-type: image/png'),
    L(5, '<-- END HTTP (833ms, binary 649222-byte body omitted)'),
  ]);
  assert.equal(c.body, null);
  assert.equal(c.bytes, 649222);
  assert.match(c.bodyNote, /binary/);
  assert.equal(c.endpoint, 'GET upload.wikimedia.org (image)');
  assert.ok(c.issues.some((i) => i.level === 'warn' && /Large response: 634 KB/.test(i.reason)));
});

test('reasons for HTTP errors come from the response: HTML title, JSON detail', () => {
  const html = issuesOf({ status: 403, statusText: '', body: '<html><head><title>Wikimedia Error</title></head><body><p>Request refused</p></body></html>', contentType: 'text/html' });
  assert.equal(html[0].level, 'fail');
  assert.match(html[0].reason, /^HTTP 403 from the server: Wikimedia Error · Request refused/);
  const json = issuesOf({ status: 404, statusText: 'Not Found', url: 'https://en.wikipedia.org/x', body: JSON.stringify({ type: 'not_found', title: 'Not found.', detail: 'Page or revision not found.' }), contentType: 'application/json' });
  assert.match(json[0].reason, /^HTTP 404 Not Found from en\.wikipedia\.org: Page or revision not found\./);
  assert.match(json[0].reason, /404 Not Found means: Nothing exists at this address/);
  assert.match(html[0].reason, /403 Forbidden means: The server understood the request but refuses it/);
  const noBody = issuesOf({ status: 403, url: 'https://meta.example/x', bytes: 2947, body: null });
  assert.match(noBody[0].reason, /the error page was 2\.9 KB; its text was not logged/);
});

test('a 200 response that carries an API error or warning is flagged', () => {
  const err = issuesOf({ status: 200, contentType: 'application/json', body: JSON.stringify({ errors: [{ code: 'badvalue', html: 'Unrecognized value for <b>x</b>' }] }) });
  assert.deepEqual(err, [{ level: 'fail', reason: 'API error "badvalue" inside a 200 response: Unrecognized value for x ("badvalue" means: One of the parameters has a value the API does not accept.)' }]);
  const warn = issuesOf({ status: 200, contentType: 'application/json', body: JSON.stringify({ warnings: [{ code: 'deprecation', text: 'old parameter' }] }) });
  assert.deepEqual(warn, [{ level: 'warn', reason: 'API warning "deprecation": old parameter' }]);
});

test('endpoint names: dates, titles and ids replaced; api.php keeps its action', () => {
  assert.equal(endpointOf('GET', 'https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/11/12'), 'GET en.wikipedia.org/api/rest_v1/feed/onthisday/events/{mm}/{dd}');
  assert.equal(endpointOf('GET', 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=x'), 'GET en.wikipedia.org/w/api.php?action=query&list=search');
  assert.equal(endpointOf('GET', 'https://en.wikipedia.org/w/api.php?action=query&generator=random&prop=a|b'), 'GET en.wikipedia.org/w/api.php?action=query&generator=random');
  assert.equal(endpointOf('GET', 'https://thumb.wikimedia.org/x/500px-a.jpg'), 'GET thumb.wikimedia.org (image)');
  assert.equal(endpointOf('POST', 'not a url'), 'POST not a url');
});

test('lines from other tags are ignored', () => {
  const calls = new NetworkLog().parse([
    '11-12 11:08:16.138  5988  6012 E AndroidRuntime: --> GET https://not-a-call',
    'garbage line',
  ]);
  assert.deepEqual(calls, []);
});


// ---------------------------------------------------------------- life of a call, from request to resolution
const T0 = (ms, tid, msg, pid = '5988') => `11-12 11:08:${String(16 + Math.floor(ms / 1000)).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}  ${pid}  ${tid} I OkHttp  : ${msg}`;

test('every event of an answered call is kept with its time: start, sent, headers, body', () => {
  const [c] = new NetworkLog().parse([
    T0(0, 2, '--> GET https://en.wikipedia.org/api/rest_v1/feed/featured/2026/11/12'), T0(1, 2, 'User-Agent: x'), T0(2, 2, '--> END GET'),
    T0(335, 2, '<-- 200 https://en.wikipedia.org/api/rest_v1/feed/featured/2026/11/12 (335ms)'), T0(335, 2, 'content-type: application/json'), T0(335, 2, ''),
    T0(360, 2, '{"tfa":{"title":"X"},"news":[1,2,3]}'), T0(360, 2, '<-- END HTTP (360ms, 36-byte body)'),
  ]);
  assert.deepEqual(c.events.map((e) => e.kind), ['start', 'sent', 'headers', 'done']);
  assert.match(c.events[1].text, /Request sent \(1 header, no body\)/);
  assert.match(c.events[2].text, /Response 200 received after 335 ms/);
  assert.match(c.events[3].text, /360 ms after the request started/);
  assert.equal(c.totalMs, 360);
  assert.equal(c.resolution, '200 · 36 bytes · application/json · headers after 335 ms, complete after 360 ms');
  assert.equal(c.shape, 'JSON with 2 fields: tfa (object, 1 field), news (list of 3)');
});

test('no response because the test closed the app: expected, with the step that did it', () => {
  const log = new NetworkLog({ pkg: 'org.wikipedia.dev' });
  log.parse([T0(0, 3, '--> GET https://en.wikipedia.org/api/rest_v1/page/summary/X')]);
  log.expectStop('The test closed the app on purpose (step "Close the app") while this call was still waiting for its response.');
  const [c] = log.parse(['11-12 11:08:18.900   555   570 I ActivityManager: Force stopping org.wikipedia.dev appid=10190 user=0: from pid 555']);
  assert.equal(c.noResponse.level, 'info');
  assert.match(c.resolution, /^No response\. The test closed the app on purpose \(step "Close the app"\).*Android stopped the app at 11:08:18\.900/);
  assert.equal(c.issues[0].level, 'info');
});

test('no response because something else force-stopped the app: a warning that says so', () => {
  const log = new NetworkLog({ pkg: 'org.wikipedia.dev' });
  log.parse([T0(0, 3, '--> GET https://a.example/x')]);
  const [c] = log.parse(['11-12 11:08:18.900   555   570 I ActivityManager: Force stopping org.wikipedia.dev appid=10190 user=0: from pid 555']);
  assert.equal(c.noResponse.level, 'warn');
  assert.match(c.noResponse.reason, /the test did not ask for it/);
});

test('no response because the app crashed or its process died: the time and pid are given', () => {
  const log = new NetworkLog({ pkg: 'org.wikipedia.dev' });
  log.parse([T0(0, 4, '--> GET https://a.example/crash', '4321'), T0(0, 5, '--> GET https://a.example/died', '7777')]);
  const [crash] = log.parse(['11-12 11:08:21.007  4321  4321 E AndroidRuntime: FATAL EXCEPTION: main']);
  assert.equal(crash.url, 'https://a.example/crash');
  assert.equal(crash.noResponse.level, 'fail');
  assert.match(crash.noResponse.reason, /The app crashed at 11:08:21\.007 \(AndroidRuntime FATAL EXCEPTION in pid 4321\)/);
  const [died] = log.parse(['11-12 11:08:22.000   555   570 I ActivityManager: Process org.wikipedia.dev (pid 7777) has died: fg TOP']);
  assert.match(died.noResponse.reason, /process \(pid 7777\) died at 11:08:22\.000/);
});

test('no response because the same thread moved on, or the app process changed', () => {
  const log = new NetworkLog();
  const [moved] = log.parse([T0(0, 6, '--> GET https://a.example/lost'), T0(900, 6, '--> GET https://a.example/next')]);
  assert.match(moved.noResponse.reason, /same app thread started its next request at 11:08:16\.900/);
  const [restart] = log.parse([T0(950, 6, '--> GET https://a.example/after-restart', '9999')]);
  assert.match(restart.noResponse.reason, /app's process changed \(pid 5988 → 9999\)/);
});

test('abandonOpen (end of the session) uses the newest log time, not the start time', () => {
  const log = new NetworkLog();
  log.parse([T0(0, 7, '--> GET https://a.example/open'), '11-12 11:08:30.000  5988  9 I Other: something later']);
  const [c] = log.abandonOpen('Session ended.', { level: 'warn' });
  assert.equal(c.endAt, '11-12 11:08:30.000');
  assert.equal(c.totalMs, 14000);
});

test('every network exception gets a plain explanation naming the host', () => {
  assert.match(explainFailure('java.net.SocketTimeoutException: timeout', 'https://en.wikipedia.org/x'), /^en\.wikipedia\.org did not answer within the app's time limit/);
  assert.match(explainFailure('java.net.ConnectException: Failed to connect to en.wikipedia.org/1.2.3.4:443', 'https://en.wikipedia.org/x'), /could not open a connection to en\.wikipedia\.org/);
  assert.match(explainFailure('javax.net.ssl.SSLHandshakeException: Chain validation failed', 'https://en.wikipedia.org/x'), /secure \(TLS\) connection/);
  assert.match(explainFailure('java.io.IOException: Canceled', 'https://en.wikipedia.org/x'), /app cancelled the request itself/);
  assert.match(explainFailure('okhttp3.internal.http2.StreamResetException: stream was reset: CANCEL', 'https://a.b/x'), /was cut while the answer was arriving/);
  assert.match(explainFailure('java.lang.WeirdException: boom', 'https://a.b/x'), /stopped the request with WeirdException: boom/);
});

test('response shapes: JSON fields, HTML title, text, binary', () => {
  assert.equal(shapeOf('[1,2]'), 'JSON list of 2 items');
  assert.equal(shapeOf('<html><title>Wikimedia Error</title></html>'), 'HTML page "Wikimedia Error" (43 characters)');
  assert.match(shapeOf('{"a": [1, '), /not valid JSON/);
  assert.equal(shapeOf(null, 'image/png', 649222, 'binary 649222-byte body omitted'), 'Binary image/png, 634.0 KB (binary content is not stored)');
  assert.equal(shapeOf(null), null);
});

test('resolution of a call without any response information is never empty', () => {
  assert.equal(resolutionOf({ status: null }), 'No response and no reason in the log.');
});


// ---------------------------------------------------------------- opening the app once, after full API logging is on (bugs seen 13 Nov 2026)
const fakeDriver = (behaviour, { running = false } = {}) => {
  const calls = [];
  let open = running;
  return {
    calls,
    execute: async (cmd, a) => { calls.push(cmd + ' ' + (a.command || a.component || '')); return behaviour(cmd, a, () => { open = true; }); },
    activateApp: async () => { calls.push('activateApp'); throw new Error("Original error: Error: Activity class {org.wikipedia.dev/org.wikipedia.YIR25Icon} does not exist."); },
    terminateApp: async () => { calls.push('terminateApp'); open = false; }, pushFile: async () => { calls.push('pushFile'); },
    queryAppState: async () => (open ? 4 : 1),
    waitUntil: async (fn) => { if (!(await fn())) throw new Error('timeout'); },
  };
};

test('the app is opened with the launcher intent on its exact activity, never with activateApp (YIR25Icon alias)', async () => {
  globalThis.driver = fakeDriver((cmd, a, opened) => {
    if (cmd === 'mobile: startActivity') {
      assert.equal(a.component, 'org.wikipedia.dev/org.wikipedia.main.MainActivity');
      assert.equal(a.action, 'android.intent.action.MAIN');
      assert.deepEqual(a.categories, ['android.intent.category.LAUNCHER']);
      assert.equal(a.flags, '0x10200000');
      opened();
    }
    return '';
  });
  assert.deepEqual(await openApp('org.wikipedia.dev'), { ok: true, how: 'mobile: startActivity' });
  assert.ok(!driver.calls.includes('activateApp'));
});

test('opening falls back to "am start" with the same intent, and reports every attempt when nothing works', async () => {
  globalThis.driver = fakeDriver((cmd, a, opened) => {
    if (cmd === 'mobile: startActivity') throw new Error('unknown command');
    if (a.command === 'am') { assert.deepEqual(a.args.slice(0, 7), ['start', '-W', '-a', 'android.intent.action.MAIN', '-c', 'android.intent.category.LAUNCHER', '-f']); opened(); }
    return '';
  });
  assert.deepEqual(await openApp('org.wikipedia.dev'), { ok: true, how: 'am start' });
  globalThis.driver = fakeDriver((cmd) => { if (cmd === 'mobile: startActivity') throw new Error('unknown command'); return ''; });
  const r = await openApp('org.wikipedia.dev');
  assert.equal(r.ok, false);
  assert.match(r.error, /Could not open org\.wikipedia\.dev\/org\.wikipedia\.main\.MainActivity\./);
  assert.match(r.error, /mobile: startActivity: unknown command/);
  assert.match(r.error, /am start: started, but org\.wikipedia\.dev was not in the foreground after 15 s/);
  assert.ok(!driver.calls.includes('activateApp'));
});

test('full API logging is written while the app is closed, and the app is never restarted mid-session', async () => {
  globalThis.driver = fakeDriver((cmd, a) => (a.command === 'run-as' ? '<map>\n</map>' : ''));
  const r = await enableHttpBodyLogging('org.wikipedia.dev');
  assert.deepEqual(r, { level: 'BODY' });
  assert.ok(!driver.calls.includes('terminateApp'), 'app was not running, so nothing to stop');
  assert.ok(!driver.calls.some((c) => c.startsWith('mobile: startActivity')), 'opening is a separate step (openApp)');
  // With noReset the app may still be running in the background: it is stopped before the setting is written
  globalThis.driver = fakeDriver((cmd, a) => (a.command === 'run-as' ? '<map>\n</map>' : ''), { running: true });
  await enableHttpBodyLogging('org.wikipedia.dev');
  assert.ok(driver.calls.indexOf('terminateApp') < driver.calls.indexOf('pushFile'));
});
