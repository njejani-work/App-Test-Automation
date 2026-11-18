// Step 6: the tools that RUN tests, with pretend commands (test/helpers/fake-suite.mjs) and a pretend adb:
// no phone is used and nothing is cleared. Checks the confirmation, one run at a time, progress, the result,
// the time limit, stopping, and that secrets never reach the assistant.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer, ROOT } from '../server.mjs';

const fake = fileURLToPath(new URL('./helpers/fake-suite.mjs', import.meta.url));
const reports = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-mcp-run-'));
let device = 'emulator-5554\tdevice', emulator = '1', runNo = 0;
const node = process.execPath;
const connect = async (opts) => {
  const [a, b] = InMemoryTransport.createLinkedPair();
  await createServer({ reportsDir: reports, structured: true, deviceUdid: 'emulator-5554', secrets: ['9876543210', '482913'], suiteEnv: () => ({ env: process.env, notes: ['Android SDK: C:\\Android\\Sdk'], missing: [] }), ...opts }).connect(a);
  const c = new Client({ name: 'unit-test', version: '1' });
  await c.connect(b);
  return async (name, args = {}) => { const r = await c.callTool({ name, arguments: args }); return { isError: !!r.isError, text: r.content[0].text, data: r.structuredContent ?? null }; };
};
const suite = (ms, exit) => ({ unit: () => ({ cmd: node, args: ['-e', "for (const t of ['a','b','c']) console.log('✔ ' + t); console.log('✖ d (OTP 482913)'); process.exit(1)"] }), suite: () => ({ cmd: node, args: [fake, reports, `20991231-0000${String(++runNo).padStart(2, '0')}`, String(ms), String(exit)] }) });
const until = async (fn, ms = 20000) => { const end = Date.now() + ms; for (;;) { const r = await fn(); if (r) return r; if (Date.now() > end) throw new Error('timed out waiting'); await new Promise((x) => setTimeout(x, 200)); } };

before(async () => {
  const { setAdbRunner } = await import(pathToFileURL(path.join(ROOT, 'test/support/dashboard/lib/device.js')).href);
  setAdbRunner((args) => { const a = args.join(' '); if (a === 'devices') return `List of devices attached\n${device}\n`; if (a === 'getprop ro.kernel.qemu') return `${emulator}\n`; return ''; });
});
after(() => fs.rmSync(reports, { recursive: true, force: true }));

test('the new tools are there; only start_test_run is marked destructive', async () => {
  const [a, b] = InMemoryTransport.createLinkedPair();
  await createServer({ reportsDir: reports }).connect(a);
  const c = new Client({ name: 't', version: '1' }); await c.connect(b);
  const { tools } = await c.listTools();
  for (const n of ['run_unit_tests', 'start_test_run', 'check_test_run', 'stop_test_run']) assert.ok(tools.find((t) => t.name === n), n);
  assert.deepEqual(tools.filter((t) => t.annotations.destructiveHint).map((t) => t.name), ['start_test_run']);
  assert.deepEqual(tools.find((t) => t.name === 'start_test_run').inputSchema.properties.suite.enum, ['smoke', 'regression', 'layout']);
});

test('without confirm nothing starts: it says what would happen (device, data cleared, time)', async (t) => {
  const call = await connect({ commands: suite(50, 0) });
  const r = await call('start_test_run', { suite: 'smoke' });
  t.diagnostic(r.text.slice(0, 400));
  assert.equal(r.data.needsConfirmation, true);
  assert.match(r.data.device, /emulator-5554 \(emulator\)/);
  assert.match(r.data.effects[0], /CLEARED first/);
  assert.match((await call('check_test_run')).text, /No test run was started from here/);
});

test('a real phone gets an explicit warning; a missing or unauthorized device is refused with the reason', async () => {
  const call = await connect({ commands: suite(50, 0) });
  emulator = '0';
  assert.match((await call('start_test_run', { suite: 'smoke' })).data.effects.join(' '), /WARNING: this is a real phone/);
  emulator = '1';
  device = 'emulator-5554\tunauthorized';
  assert.match((await call('start_test_run', { suite: 'smoke', confirm: true })).text, /"unauthorized" \(not ready: accept the USB debugging prompt/);
  device = 'emulator-5556\tdevice';
  assert.match((await call('start_test_run', { suite: 'smoke', confirm: true })).text, /DEVICE_UDID=emulator-5554 in \.env\) is not connected\. adb sees: emulator-5556 \(device\)/);
  device = 'emulator-5554\tdevice';
});

test('confirmed: runs as a job; progress while running; verdict at the end; one run at a time; secrets masked', async (t) => {
  const call = await connect({ commands: suite(700, 1) });
  const s = await call('start_test_run', { suite: 'smoke', confirm: true });
  assert.equal(s.data.started, true);
  assert.match((await call('start_test_run', { suite: 'regression', confirm: true })).text, /already going/);
  const live = await until(async () => { const r = (await call('check_test_run')).data; return r.status === 'running' && r.progress?.finished >= 1 ? r : null; });
  t.diagnostic(`while running: ${JSON.stringify(live.progress)}`);
  assert.ok(live.progress.runningNow || live.progress.finished);
  const end = await until(async () => { const r = (await call('check_test_run', { job: s.data.job })).data; return r.status !== 'running' ? r : null; });
  t.diagnostic(`finished: ${end.status}, exit ${end.exitCode}, run ${end.run}`);
  assert.equal(end.status, 'failed');
  assert.equal(end.exitCode, 1);
  const all = JSON.stringify(end);
  assert.ok(!all.includes('9876543210') && !all.includes('482913'), 'the test phone and OTP are masked');
  assert.match(all, /test phone •••••• and OTP ••••••/);
  // WebdriverIO's error is shown even when later output (the summary) pushed it out of the last lines
  assert.ok(end.errorLines.some((l) => /ERROR webdriver: Request failed with status 500/.test(l)), JSON.stringify(end.errorLines));
  assert.match((await call('check_test_run', { job: s.data.job })).text, /### Errors in the output\n```text\n.*ERROR webdriver/);
});

test('a run over its time limit is stopped; stop_test_run stops a run on request', async () => {
  const call = await connect({ commands: suite(5000, 0), limits: { unitMs: 60000, suiteMs: 1500 } });
  const s = await call('start_test_run', { suite: 'smoke', confirm: true });
  assert.equal(s.data.started, true, s.text);
  const end = await until(async () => { const r = (await call('check_test_run', { job: s.data.job })).data; return r.status !== 'running' ? r : null; });
  assert.equal(end.status, 'timed out');
  const call2 = await connect({ commands: suite(5000, 0) });
  const s2 = await call2('start_test_run', { suite: 'layout', confirm: true });
  await new Promise((r) => setTimeout(r, 500));
  const stopped = await call2('stop_test_run');
  assert.equal(stopped.data.status, 'stopped');
  await new Promise((r) => setTimeout(r, 300));
  // the stopped run's record is closed with the reason, so it does not look unfinished (or block new runs)
  const meta = JSON.parse(fs.readFileSync(path.join(reports, 'runs', stopped.data.run, 'meta.json'), 'utf8'));
  assert.ok(meta.finishedAt);
  assert.equal(meta.interrupted, 'stopped from the assistant (MCP server)');
});

test('a run started elsewhere (e.g. in a terminal) blocks a new one', async () => {
  const id = '20991231-235959';
  fs.mkdirSync(path.join(reports, 'runs', id), { recursive: true });
  fs.writeFileSync(path.join(reports, 'runs', id, 'meta.json'), JSON.stringify({ id, startedAt: Date.now() }));
  fs.writeFileSync(path.join(reports, '.current-run'), id);
  const call = await connect({ commands: suite(50, 0) });
  assert.match((await call('start_test_run', { suite: 'smoke', confirm: true })).text, /started outside the assistant is still going \(run 20991231-235959/);
  fs.rmSync(path.join(reports, '.current-run'));
});

test('run_unit_tests: runs, returns the result, masks secrets in the output', async () => {
  const call = await connect({ commands: suite(50, 0) });
  const r = await call('run_unit_tests');
  assert.equal(r.data.status, 'failed');
  assert.equal(r.data.exitCode, 1);
  assert.ok(r.data.outputTail.some((l) => l === '✖ d (OTP ••••••)'));
  assert.ok(!r.text.includes('482913'), 'the OTP is masked in the text too');
});

test('Appium needs ANDROID_HOME and JAVA_HOME: the plan says which are used; a missing one is refused with how to fix it', async () => {
  const call = await connect({ commands: suite(50, 0) });
  assert.match((await call('start_test_run', { suite: 'smoke' })).text, /\*\*Android SDK:\*\* C:\\Android\\Sdk/);
  const none = await connect({ commands: suite(50, 0), suiteEnv: () => ({ env: process.env, notes: [], missing: ['JAVA_HOME (a Java JDK)'] }) });
  const r = await none('start_test_run', { suite: 'smoke', confirm: true });
  assert.equal(r.isError, true);
  assert.match(r.text, /Appium needs JAVA_HOME \(a Java JDK\), and this server cannot find it/);
});
