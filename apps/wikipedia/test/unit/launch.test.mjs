// Opening the app once per session, after full API logging is on (test/helpers/launch.js; bugs seen 13 Nov 2026).
// Moved from test/dashboard/unit/network.test.mjs with the code it tests (19 Nov 2026).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openApp, enableHttpBodyLogging } from '../helpers/launch.js';

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
