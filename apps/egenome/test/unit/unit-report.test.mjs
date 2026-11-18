// The unit-test reporter (test/support/dashboard/unit-report.mjs) on the error demo (test/unit/error-demo): every kind
// of failure must reach the dashboard with its reason, expected / actual, location and messages.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ranges } from '../support/dashboard/unit-report.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-unit-report-'));
let run;
// NODE_TEST_CONTEXT would make the inner run report to this test runner instead of to the reporter
const { NODE_TEST_CONTEXT, ...env } = process.env;
before(() => {
  // The reporter is given as a path relative to the project (like the npm scripts do): a full Windows path
  // ("C:\\...") would be read by Node as a URL with the scheme "c:" and the reporter would not load.
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=./test/support/dashboard/unit-report.mjs', '--test-reporter-destination=stdout', 'test/unit/error-demo/error-demo.mjs'],
    { cwd: root, encoding: 'utf8', timeout: 90000, env: { ...env, DASHBOARD_DIR: dir, DASHBOARD_UNIT_ID: '20260101-000000', DASHBOARD_UNIT_NO_BUILD: '1' } });
  const saved = path.join(dir, 'unit', '20260101-000000.json');
  if (!fs.existsSync(saved)) throw new Error(`The reporter saved nothing. Inner run (exit ${r.status}): ${String(r.stderr || r.stdout || r.error || '').trim().split('\n').slice(-6).join(' | ')}`);
  run = JSON.parse(fs.readFileSync(saved, 'utf8'));
});
after(() => fs.rmSync(dir, { recursive: true, force: true }));
const t = (name) => run.tests.find((x) => x.name.includes(name));

test('the run is saved with its counts and verdict', () => {
  assert.equal(run.status, 'failed');
  assert.deepEqual({ ...run.summary, durationMs: 0 }, { total: 13, passed: 1, failed: 11, skipped: 1, durationMs: 0 });
  assert.equal(run.files.length, 1);
  assert.ok(run.details.tools.node);
});

test('an assertion keeps expected and actual, the comparison and the line in the test', () => {
  const e = t('a wrong value').error;
  assert.equal(e.kind, 'Assertion failed');
  assert.match(e.message, /^the report shows the OTP digits/);
  assert.deepEqual([e.expected, e.actual, e.operator], ['"••••••"', '"482913"', 'strictEqual']);
  assert.equal(e.location.file, 'test/unit/error-demo/error-demo.mjs');
  assert.match(e.location.href, /^vscode:\/\/file\/.+error-demo\.mjs:\d+:\d+$/);
  assert.match(t('an object that differs').error.actual, /y: 0\.388/);
});

test('an error thrown inside project code points at that code, not at the test', () => {
  assert.equal(t('ReferenceError deep inside').error.name, 'ReferenceError');
  assert.equal(t('ReferenceError deep inside').error.location.file, 'test/pageobjects/LoginPage.js');
  assert.equal(t('country code').error.location.file, 'test/data/users.js');
});

test('a failed setup hook, a timeout and a todo each say what happened', () => {
  const s = t('its setup failed');
  assert.equal(s.status, 'cancelled');
  assert.match(s.error.kind, /^Not run: the setup of "Setup that fails" failed/);
  assert.match(s.error.message, /setup failed on purpose/);
  assert.equal(t('takes too long').error.kind, 'Timed out (took longer than its time limit)');
  assert.equal(t('unfinished').status, 'todo');
  assert.equal(t('unfinished').skipReason, 'waiting for the Settings screen dump');
});

test('messages attached by a test are kept with that test (API data, pretend phone, layout checker)', () => {
  assert.ok(t('reports list answers').messages.some((m) => m.startsWith('Response body: {"data":[{"id":"r1","title":12345}')));
  assert.ok(t('phone picker never closes').messages.some((m) => m.startsWith('Pretend phone · the page object did: back')));
  assert.ok(t('title moved down').messages.some((m) => /moved\/resized/.test(m)));
  assert.equal(t('this one passes').messages.length, 0);
});

test('uncovered line numbers are written as ranges', () => {
  assert.equal(ranges([9, 3, 4, 5, 12, 13]), '3-5 9 12-13');
  assert.equal(ranges([]), '');
});
