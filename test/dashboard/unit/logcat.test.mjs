// Reading one test's Android log: lines taken from the real tour run of 13 Nov 2026 (11:10) on the Android 17 emulator.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyLogcat, deviceWarnings } from '../../support/dashboard/lib/logcat.js';

const PKG = 'org.wikipedia.dev';
const WEBVIEW_CRASH = [
  '11-13 11:10:52.482 17001 17001 E AndroidRuntime: FATAL EXCEPTION: main',
  '11-13 11:10:52.482 17001 17001 E AndroidRuntime: Process: com.google.android.webview:sandboxed_process0:org.chromium.content.app.SandboxedProcessService0:0, PID: 17001',
  "11-13 11:10:52.482 17001 17001 E AndroidRuntime: java.lang.NullPointerException: Attempt to invoke virtual method 'android.os.Bundle android.os.Bundle.getBundle(java.lang.String)' on a null object reference",
  '11-13 11:10:52.482 17001 17001 E AndroidRuntime: \tat android.app.ActivityThread.getCoreSettingsForDeviceLocked(ActivityThread.java:9455)',
];
const APP_CRASH = [
  '11-13 11:20:00.000 16950 16950 E AndroidRuntime: FATAL EXCEPTION: main',
  '11-13 11:20:00.000 16950 16950 E AndroidRuntime: Process: org.wikipedia.dev, PID: 16950',
  '11-13 11:20:00.000 16950 16950 E AndroidRuntime: java.lang.IllegalStateException: boom',
];
const STUCK = [
  '11-13 11:11:03.616   707  1996 W WindowManager: Timed out waiting for animations to complete, animatingContainer=null animationType=none animateStarting=false',
  '11-13 11:11:03.648   707   870 I InputDispatcher: No new touched window at (672.0, 1184.0) in display 0',
  '11-13 11:11:08.663   707  1996 W WindowManager: Timed out waiting for animations to complete, animatingContainer=null animationType=none animateStarting=false',
  '11-13 11:11:14.542   707   870 I InputDispatcher: No new touched window at (672.0, 1184.0) in display 0',
];
const APP_ERROR = '11-13 11:10:52.215 16950 16950 E org.wikipedia.recurring.RecurringTasksExecutor: HttpStatusException: Code: 403';

test("WebView's sandboxed helper crashing is not the app crashing", () => {
  const r = classifyLogcat([...WEBVIEW_CRASH, APP_ERROR], PKG, '16950');
  assert.ok(!r.errors.some((e) => e.includes('AndroidRuntime')), 'no crash lines among the app errors');
  assert.equal(r.errors.length, 1);
  assert.equal(r.otherCrashes.length, 1);
  assert.match(r.otherCrashes[0].process, /^com\.google\.android\.webview:sandboxed_process0/);
  assert.match(r.otherCrashes[0].exception, /NullPointerException/);
  const w = deviceWarnings(r);
  assert.equal(w[0].source, 'device');
  assert.match(w[0].message, /Another process crashed, not the app: com\.google\.android\.webview:sandboxed_process0.*NullPointerException/);
  assert.match(w[0].message, /WebView helper/);
});

test("the app's own crash is still a crash, even without knowing its pid", () => {
  for (const pid of ['16950', null]) {
    const r = classifyLogcat([...WEBVIEW_CRASH, ...APP_CRASH], PKG, pid);
    assert.equal(r.errors.filter((e) => e.includes('AndroidRuntime')).length, 3);
    assert.equal(r.otherCrashes.length, 1);
  }
});

test('a stuck emulator screen is reported, with what Android said and what to do', () => {
  const r = classifyLogcat(STUCK, PKG, '16950');
  assert.deepEqual(r.screen, { noWindow: 2, animTimeouts: 2, at: '672,1184' });
  const [w] = deviceWarnings(r);
  assert.match(w.message, /screen was stuck: 2 tap\(s\) reached no window at all \(Android: "No new touched window at 672,1184"\), and Android waited 2 time\(s\)/);
  assert.match(w.message, /Cold boot the emulator/);
});

test('a normal log gives no device warnings', () => {
  assert.deepEqual(deviceWarnings(classifyLogcat([APP_ERROR], PKG, '16950')), []);
});

// ---------------------------------------------------------------- error lines explained by known API issues (run 13 Nov 2026 11:22)
test('error lines caused by a known API issue or by Android itself do not make a passed test a warning', async () => {
  const D = await import('../../support/dashboard/analysis.mjs');
  const knownApi = [{ match: 'meta.wikimedia.beta.wmcloud.org/w/api.php?action=streamconfigs', reason: 'Beta analytics server refuses the dev build (403).' }];
  const H = 'E org.wikipedia.recurring.RecurringTasksExecutor$run$lambda$1$$inlined$CoroutineExceptionHandler';
  const known403 = `${H}org.wikipedia.dataclient.okhttp.HttpStatusException: Code: 403, URL: https://meta.wikimedia.beta.wmcloud.org/w/api.php?format=json&formatversion=2&errorformat=html&errorsuselocal=1&action=streamconfigs&format=json`;
  const t = {
    state: 'passed',
    warnings: [{ source: 'app', message: 'The app logged 4 error line(s) during this test.' }],
    logcat: { errorCount: 4, errors: [`${H}handleException():304: `, known403, 'E DisplayEventDispatcher: dispatcher 0x7479 ~ last event processed while scheduling was for 147736', `${H}handleException():304: `] },
  };
  D.explainAppErrors(t, knownApi);
  // the last header line has no known line after it: it stays unexplained
  assert.equal(t.logcat.unexplained, 1);
  assert.deepEqual([t.logcat.explained.known, t.logcat.explained.framework], [2, 1]);
  assert.match(t.warnings[0].message, /1 error line\(s\) during this test that are not explained \(2 from known issues in test\/triage\.json; 1 from Android's own code \(DisplayEventDispatcher\) are not counted\)/);
  t.logcat.errors.pop(); t.logcat.errorCount = 3; t.warnings = [{ source: 'app', message: 'The app logged 3 error line(s) during this test.' }];
  D.explainAppErrors(t, knownApi);
  assert.equal(t.logcat.unexplained, 0);
  assert.deepEqual(t.warnings, []);
  assert.equal(D.testStatus(t), 'passed');
  // lines beyond the 40 kept cannot be checked: they still count
  const big = { state: 'passed', warnings: [], logcat: { errorCount: 50, errors: [known403] } };
  D.explainAppErrors(big, knownApi);
  assert.equal(big.logcat.unexplained, 49);
  assert.equal(D.testStatus(big), 'warning');
});
