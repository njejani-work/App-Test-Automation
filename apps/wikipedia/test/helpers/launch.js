// Opening the Wikipedia app at the start of a session, and full API logging (Wikipedia only).
// Moved unchanged from test/support/report/network.js (19 Nov 2026), whose other code is in the shared toolkit.
// test/helpers/hooks.js calls both once per session, before the first test.

/**
 * Open the app once at the start of the test session (app.config.js sets appium:autoLaunch false, so Appium installs
 * the app but does not open it). Uses the same intent as Appium's own launch and the Android launcher: action MAIN,
 * category LAUNCHER, flags NEW_TASK | RESET_TASK_IF_NEEDED, on the exact activity (APP_ACTIVITY, default
 * org.wikipedia.main.MainActivity). Appium's activateApp() is not used: it picks the first launcher entry it finds,
 * which in this app can be a disabled icon alias (org.wikipedia.YIR25Icon, "Activity class does not exist").
 * Returns { ok: true, how } or { ok: false, error } with every attempt and its error.
 */
export async function openApp(pkg, activity = process.env.APP_ACTIVITY || 'org.wikipedia.main.MainActivity') {
  const component = `${pkg}/${activity}`;
  const MAIN = 'android.intent.action.MAIN';
  const LAUNCHER = 'android.intent.category.LAUNCHER';
  const FLAGS = '0x10200000';
  const inFront = async (ms) => {
    try { await driver.waitUntil(async () => (await driver.queryAppState(pkg)) === 4, { timeout: ms, interval: 500 }); return true; } catch { return false; }
  };
  const tries = [
    ['mobile: startActivity', () => driver.execute('mobile: startActivity', { component, action: MAIN, categories: [LAUNCHER], flags: FLAGS, wait: true })],
    ['am start', () => driver.execute('mobile: shell', { command: 'am', args: ['start', '-W', '-a', MAIN, '-c', LAUNCHER, '-f', FLAGS, '-n', component] })],
  ];
  const errors = [];
  for (const [how, run] of tries) {
    try {
      await run();
      if (await inFront(15000)) return { ok: true, how };
      errors.push(`${how}: started, but ${pkg} was not in the foreground after 15 s`);
    } catch (e) {
      errors.push(`${how}: ${String(e.message || e).replace(/\s+/g, ' ').replace(/^.*Original error: /, '').slice(0, 220)}`);
    }
  }
  return { ok: false, error: `Could not open ${component}. ${errors.join(' | ')}` };
}

/**
 * Make the app log full responses (OkHttp level BODY) for this test session, BEFORE it is opened.
 * The app reads the level from its settings ("retrofitLog", dev settings) when it starts, so the setting is
 * written into its settings file while the app is not running (debug builds only: run-as). The app is never
 * restarted in the middle of a session: on Android 17 that left a blank window that took no taps (13 Nov 2026).
 * Needs Appium's adb_shell (see app.config.js). Returns { level: 'BODY' } or { level: 'BASIC', reason }.
 */
export async function enableHttpBodyLogging(pkg) {
  const file = `shared_prefs/${pkg}_preferences.xml`;
  const sh = (command, args) => driver.execute('mobile: shell', { command, args });
  let step = 'check that the app is not running';
  try {
    // With appium:noReset true the app may still be running from before: stop it while it is off screen
    if ((await driver.queryAppState(pkg)) > 1) { step = 'stop the app before it is opened'; await driver.terminateApp(pkg); }
    let xml = '';
    step = 'read the app settings with run-as';
    try { xml = String(await sh('run-as', [pkg, 'cat', file])); } catch {}
    const entry = '<string name="retrofitLog">BODY</string>';
    if (/name="retrofitLog"/.test(xml)) xml = xml.replace(/<string name="retrofitLog">[^<]*<\/string>/, entry);
    else if (/<\/map>/.test(xml)) xml = xml.replace(/<\/map>/, `    ${entry}\n</map>`);
    else xml = `<?xml version='1.0' encoding='utf-8' standalone='yes' ?>\n<map>\n    ${entry}\n</map>\n`;
    step = 'copy the settings file to the emulator';
    await driver.pushFile('/data/local/tmp/wikiapp-test-prefs.xml', Buffer.from(xml).toString('base64'));
    step = 'write the app settings with run-as';
    await sh('run-as', [pkg, 'mkdir', '-p', 'shared_prefs']);
    await sh('run-as', [pkg, 'cp', '/data/local/tmp/wikiapp-test-prefs.xml', file]);
    return { level: 'BODY' };
  } catch (e) {
    const msg = String(e.message || e).split('\n')[0].slice(0, 200);
    const hint = /insecure|adb_shell|not enabled/i.test(msg) ? ' Appium does not allow adb shell: check DASHBOARD_PERF / DASHBOARD_API_BODIES and the allowInsecure setting in app.config.js.'
      : /run-as|not debuggable|package not debuggable/i.test(msg) ? ' run-as only works on debug builds; this APK is not debuggable.' : '';
    return { level: 'BASIC', reason: `Could not ${step}: ${msg}.${hint} API calls are still recorded with address, status code, time and size, but without response headers and bodies.` };
  }
}
