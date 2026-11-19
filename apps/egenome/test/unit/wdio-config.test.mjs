// The shared WebdriverIO config (@apptest/toolkit/wdio): what an app's app.config.js gives, and how it overrides.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createConfig } from '@apptest/toolkit/wdio/index.js';
import app from '../../app.config.js';

const env = () => ({ DEVICE_UDID: 'emulator-5556' }); // a pretend environment: nothing leaks into process.env
const one = (h) => [].concat(h).length;

test('eGenome: its package, activity and suites over the shared defaults', async () => {
  const c = await createConfig(app, { env: env() });
  const caps = c.capabilities[0];
  assert.equal(caps['appium:appPackage'], 'com.egenome.app');
  assert.equal(caps['appium:appActivity'], '.MainActivity');
  assert.equal(caps['appium:udid'], 'emulator-5556', 'device from the environment');
  assert.deepEqual(Object.keys(c.suites), ['smoke', 'regression', 'layout', 'extended']);
  assert.equal(c.mochaOpts.timeout, 180000);
  assert.equal(c.strictSelectors, false, '$() takes the first match, as WebdriverIO 10.1 did');
  assert.ok(c.onPrepare && c.afterTest, 'the dashboard hooks are added');
});

test('an app overrides a capability or a setting without repeating the rest', async () => {
  const c = await createConfig({ ...app, capabilities: { 'appium:noReset': false }, wdio: { waitforTimeout: 15000 } }, { env: env() });
  assert.equal(c.capabilities[0]['appium:noReset'], false);
  assert.equal(c.capabilities[0]['appium:automationName'], 'UiAutomator2', 'the other defaults stay');
  assert.equal(c.waitforTimeout, 15000);
});

test('its own hooks run after the toolkit\'s; replace drops the toolkit\'s hook of that name', async () => {
  const mine = async () => {};
  const added = await createConfig(app, { env: env(), hooks: { afterTest: mine, beforeSuite: mine } });
  const base = await createConfig(app, { env: env() });
  assert.equal(one(added.afterTest), one(base.afterTest) + 1);
  assert.equal([].concat(added.beforeSuite).at(-1), mine);
  const replaced = await createConfig(app, { env: env(), replace: ['afterTest'] });
  assert.equal(one(replaced.afterTest), one(base.afterTest) - 1, 'only the dashboard\'s afterTest is left');
});

test('a missing required setting says which one', async () => {
  await assert.rejects(createConfig({ id: 'x', name: 'X' }, { env: env() }), /app.config.js is missing: package, activity, specs/);
});

test('capabilities and settings can come from the environment (a function), and undefined leaves a default out', async () => {
  const c = await createConfig({
    ...app,
    capabilities: (e) => ({ 'appium:udid': e.UDID || undefined, 'appium:waitForIdleTimeout': undefined }),
    wdio: (e) => ({ logLevel: e.LOG_LEVEL || 'warn' }),
  }, { env: { LOG_LEVEL: 'debug' } });
  assert.equal('appium:udid' in c.capabilities[0], false, 'no UDID: no udid capability at all');
  assert.equal('appium:waitForIdleTimeout' in c.capabilities[0], false, 'a default left out');
  assert.equal(c.logLevel, 'debug');
});
