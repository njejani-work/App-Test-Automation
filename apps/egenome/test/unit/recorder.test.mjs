// The step recorder (test/support/dashboard/recorder.js): OTP codes never reach the reports.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-unit-rec-'));
process.env.DASHBOARD_DIR = dir; // never the real reports folder
const rec = await import('@apptest/toolkit/dashboard/recorder.js');
const { S } = await import('../pageobjects/BasePage.js');
globalThis.driver = { saveScreenshot: async () => {} };
after(() => { delete globalThis.driver; fs.rmSync(dir, { recursive: true, force: true }); });

class OtpPage { async submitOtp(code) { rec.logAction('type', S.desc('OTP digit 1'), code[0]); } async requestOtp(phone) { return phone; } }

test('OTP codes are masked in steps, actions and the saved files; phone numbers stay readable', async () => {
  rec.init({ runId: 'unit-run', cid: '0-0', specs: [], device: {} });
  rec.startTest({ title: 'UNIT-01 masking', suite: 'Unit', file: 'test/unit/recorder.test.mjs' });
  const page = rec.instrument(new OtpPage(), 'OtpPage');
  await page.requestOtp('9876543210');
  await page.submitOtp('482913');
  const steps = rec.recorderState.current.steps;
  assert.equal(steps.length, 2);
  assert.equal(steps[0].call, 'OtpPage.requestOtp("9876543210")');
  assert.equal(steps[1].call, 'OtpPage.submitOtp("••••••")');
  assert.equal(steps[1].title, 'Otp · Submit OTP');
  assert.equal(steps[1].actions[0].value, '•');
  await rec.end({ passed: true });
  rec.flush();
  const saved = fs.readdirSync(path.join(dir, 'runs', 'unit-run'), { recursive: true }).filter((f) => /\.(json|log)$/.test(f))
    .map((f) => fs.readFileSync(path.join(dir, 'runs', 'unit-run', f), 'utf8')).join('\n');
  assert.ok(saved.includes('submitOtp'), 'the step was saved');
  assert.ok(!saved.includes('482913'), 'the code is in no saved file');
});

test('steps are numbered in order and a failed step keeps its error', async () => {
  rec.startTest({ title: 'UNIT-02 steps', suite: 'Unit', file: 'test/unit/recorder.test.mjs' });
  await rec.step('First', async () => {});
  await assert.rejects(rec.step('Second', async () => { throw new Error('Boom'); }), /Boom/);
  const [a, b] = rec.recorderState.current.steps;
  assert.deepEqual([a.n, a.status, b.n, b.status], [1, 'passed', 2, 'failed']);
  assert.equal(b.error.message, 'Boom');
  await rec.end({ passed: false, error: new Error('Boom') });
});
