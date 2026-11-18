// Deliberate failures, to see how the dashboard reports each kind of error ("Unit tests" tab).
// NOT part of npm run test:unit (no ".test" in the name). Run it with:  npm run test:unit:error-demo
// Every test here fails on purpose, each in a different way; nothing in the project is broken.
import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fakeDevice } from '../helpers/fake-device.mjs';
import LoginPage from '../../pageobjects/LoginPage.js';
import { parseSource } from '../../support/layout/hierarchy.js';
import { buildSpec } from '../../support/layout/spec-builder.js';
import { evaluate } from '../../support/layout/check.js';
import { checkCall } from '../../support/dashboard/lib/formats.js';
import { getUser, users } from '../../data/users.js';

describe('Assertions (expected vs actual)', () => {
  test('a wrong value: the OTP should be masked in the report', () => {
    const shown = '482913';
    assert.equal(shown, '••••••', 'the report shows the OTP digits');
  });

  test('an object that differs: the layout box moved', () => {
    assert.deepEqual({ spec: 'Login', box: { x: 0.04, y: 0.388, w: 0.92 }, checks: ['presence', 'text', 'box'] },
      { spec: 'Login', box: { x: 0.04, y: 0.544, w: 0.92 }, checks: ['presence', 'text', 'box'] });
  });

  test('a list that differs: phone numbers after clean-up', () => {
    assert.deepEqual(['9876543210', '9876543210', '+919876543210'], ['9876543210', '9876543210', '9876543210']);
  });

  test('a text that should match a pattern', () => {
    assert.match('Resend OTP in 30s', /^Resend OTP in \d+ seconds$/);
  });
});

describe('Errors thrown by the code under test', () => {
  test('a ReferenceError deep inside a page object (no pretend phone set up)', async () => {
    await LoginPage.open(); // no pretend phone: `$` is not defined -> ReferenceError inside BasePage
  });

  test('a clear error from the test data: the phone number has the country code', () => {
    users.__demo = { phone: '+919876543210', otp: '123456' };
    try { getUser('__demo'); } finally { delete users.__demo; }
  });
});

describe('Page objects on the pretend phone', () => {
  test('the phone picker never closes (Back does nothing)', async (t) => {
    const dev = fakeDevice({ showing: ['Choose a phone number'] });
    dev.onBack = () => {};
    t.after(() => { for (const m of dev.summary()) t.diagnostic(m); dev.restore(); });
    await LoginPage.open(); // rejects with the page object's own message
  });
});

describe('Layout checker', () => {
  test('a screen whose title moved down by 200 px fails its spec', (t) => {
    const tree = parseSource(fs.readFileSync(new URL('../fixtures/screens/Login.xml', import.meta.url), 'utf8'));
    const spec = buildSpec(tree, tree.screen, { spec: 'Login', page: 'LoginPage', source: 'error-demo' });
    const title = tree.all.find((e) => e.text === 'Log in or Sign up');
    title.bounds = { ...title.bounds, y1: title.bounds.y1 + 200, y2: title.bounds.y2 + 200 };
    const r = evaluate(spec, tree);
    const failed = r.results.filter((x) => x.status === 'failed');
    for (const f of failed) t.diagnostic(`Layout check failed: ${f.message}`);
    assert.equal(failed.length, 0, `${failed.length} of ${r.summary.total} layout checks failed`);
  });
});

describe('API data', () => {
  test('the reports list answers with a number where the app needs text', (t) => {
    const rule = { name: 'Reports list', match: '/v1/reports', status: 200, fields: { data: 'array', 'data[].id': 'string', 'data[].title': 'string' } };
    const call = { endpoint: 'GET staging.api.example/v1/reports?profile=me', status: 200 };
    const body = '{"data":[{"id":"r1","title":12345},{"id":"r2","title":"Diabetes Risk Assessment"}]}';
    t.diagnostic(`API call: ${call.endpoint} · status ${call.status}`);
    t.diagnostic(`Response body: ${body}`);
    const result = checkCall(call, [rule], body);
    t.diagnostic(`Result: ${result.status} - ${result.problems.map((p) => p.text).join(' ')}`);
    assert.equal(result.status, 'ok', `response format: ${result.problems.map((p) => p.text).join(' ')}`);
  });
});

describe('Setup that fails', () => {
  before(() => { throw new Error('could not read test/unit/fixtures/screens/Settings.xml (setup failed on purpose)'); });
  test('a test that cannot run because its setup failed', () => {});
});

test('a test that takes too long (timeout 300 ms)', { timeout: 300 }, async () => {
  await new Promise((r) => setTimeout(r, 2000));
});

test('this one passes, to show a mixed run', () => {
  assert.equal(1 + 1, 2);
});

test('an unfinished test (marked todo)', { todo: 'waiting for the Settings screen dump' }, () => {});
