// Integration: the whole MCP server answering a real MCP client, on the dashboard's demo runs
// (test/dashboard/fixtures.mjs: device runs with a regression, a crash, API calls; two unit runs, one failing).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { createServer, ROOT } from '../server.mjs';

const reports = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-mcp-'));
let client;
const RUN = '20261110-150000'; // the demo run with a crash, a regression (SMK-05) and API calls
const call = async (name, args = {}) => { const r = await client.callTool({ name, arguments: args }); return { ...r, data: r.structuredContent ?? null, text: r.content[0].text }; };

before(async () => {
  const { NODE_TEST_CONTEXT, ...env } = process.env;
  execFileSync(process.execPath, [path.join(ROOT, 'test/dashboard/fixtures.mjs'), reports], { env, stdio: 'ignore', timeout: 120000 });
  // a pretend adb (no phone needed): one emulator with the app installed
  const { setAdbRunner } = await import(pathToFileURL(path.join(ROOT, 'test/support/dashboard/lib/device.js')).href);
  setAdbRunner((args) => {
    const a = args.join(' ');
    if (a === 'devices') return 'List of devices attached\nemulator-5554\tdevice\n';
    if (a.startsWith('dumpsys package com.egenome.app')) return 'versionCode=82 minSdk=24\n    versionName=1.8.52\n    firstInstallTime=2026-10-28 12:17:27\n    lastUpdateTime=2026-10-28 12:17:27\n';
    if (a.startsWith('getprop ro.build.fingerprint')) return 'google/sdk_gphone64_x86_64/emu64xa:17/X/1:userdebug/dev-keys\n';
    return '';
  });
  const [a, b] = InMemoryTransport.createLinkedPair();
  await createServer({ reportsDir: reports, structured: true }).connect(a);
  client = new Client({ name: 'unit-test', version: '1' });
  await client.connect(b);
});
after(async () => { await client?.close(); fs.rmSync(reports, { recursive: true, force: true }); });

test('the read tools: 10 read-only tools, each with a description and typed inputs', async () => {
  const { tools } = await client.listTools();
  const read = tools.filter((t) => t.annotations.readOnlyHint);
  assert.deepEqual(read.map((t) => t.name).sort(), ['check_test_run', 'compare_runs', 'device_status', 'explain_codes', 'get_failure_details', 'get_latest_run', 'get_unit_test_results', 'list_failures', 'list_layout_specs', 'list_runs']);
  for (const t of read) {
    assert.equal(t.annotations.readOnlyHint, true, `${t.name} is read-only`);
    assert.ok(t.description.length > 40, `${t.name} explains itself`);
  }
  assert.deepEqual(tools.find((t) => t.name === 'get_failure_details').inputSchema.required, ['test']);
});

test('run summary: verdict with the reason, and what changed since the previous run of the same suite', async (t) => {
  const { data } = await call('get_latest_run', { runId: RUN });
  t.diagnostic(`verdict ${data.verdict}: ${data.why} · compared with ${data.comparedWith.run}`);
  assert.equal(data.verdict, 'BLOCKED');
  assert.match(data.why, /crash|P0/);
  assert.equal(data.app.version, '2.4.0');
  assert.ok(Array.isArray(data.comparedWith.newlyFailing));
  assert.ok(data.dashboard.endsWith('index.html'));
});

test('the latest run had no device: the verdict and the failure say so', async (t) => {
  const { data } = await call('get_latest_run', { suite: 'smoke' });
  t.diagnostic(`${data.run}: ${data.verdict} - ${data.why}`);
  assert.equal(data.app.version, null);
  const f = await call('list_failures', { runId: data.run });
  assert.equal(f.data.failures[0].test, 'SESSION');
  assert.match(f.data.failures[0].error, /could not start/);
});

test('failures: error, category with why, history (passed before on an older build = the app changed)', async (t) => {
  const { data } = await call('list_failures', { runId: RUN });
  const smk5 = data.failures.find((f) => f.test === 'SMK-05');
  t.diagnostic(JSON.stringify(smk5.history));
  assert.equal(smk5.error, 'ReportsPage did not open within 20000ms');
  assert.ok(smk5.category && smk5.categoryWhy);
  assert.match(smk5.history.status, /^REGRESSION \(passed on app build 2\.3\.0-a3f1c2d4e5, fails on 2\.4\.0-b7e9d0f1a2 with the same test code/);
  assert.equal(smk5.history.lastPass.sameAppBuild, false);
  assert.equal(smk5.history.lastPass.sameTestCode, true);
  assert.equal(data.failures.find((f) => f.test === 'SMK-04').crash, true);
});

test('test details: steps, the API calls of each step, the files to look at', async (t) => {
  const { data } = await call('get_failure_details', { test: 'SMK-05', runId: RUN });
  assert.equal(data.status, 'failed');
  assert.ok(data.steps.length >= 2);
  const call500 = data.apiCalls.find((c) => c.status === 500);
  t.diagnostic(JSON.stringify(call500));
  assert.equal(call500.step, 'step 2 · Reports');
  assert.ok(fs.existsSync(data.files.screenshot), 'the screenshot path is a real file');
  const byTitle = await call('get_failure_details', { test: 'premium plan', runId: RUN });
  assert.equal(byTitle.data.test, 'SMK-04');
});

test('unit tests: failures with expected vs actual and where it failed', async (t) => {
  const { data } = await call('get_unit_test_results');
  assert.equal(data.status, 'failed');
  const otp = data.tests.find((x) => x.test.includes('OTP codes are masked'));
  t.diagnostic(JSON.stringify(otp.error));
  assert.deepEqual([otp.error.expected, otp.error.actual], ['"••••••"', '"482913"']);
  assert.match(otp.error.where, /demo\.sample\.mjs:\d+$/);
  assert.equal(data.coverage.threshold, 90);
});

test('codes explained, device status through (pretend) adb', async () => {
  assert.match((await call('explain_codes', { text: '503' })).text, /Service Unavailable/);
  assert.match((await call('explain_codes', { text: 'the worker ended with exit code 137' })).text, /137/);
  const { data } = await call('device_status');
  assert.deepEqual(data.devices, [{ id: 'emulator-5554', state: 'device' }]);
  assert.equal(data.app.version_name, '1.8.52');
});

test('a wrong run or test id says what exists instead', async () => {
  const r = await call('get_latest_run', { runId: '19990101-000000' });
  assert.equal(r.isError, true);
  assert.match(r.text, /not found\. Kept runs \(newest first\): \d{8}-\d{6}/);
  assert.match((await call('get_failure_details', { test: 'XYZ-99', runId: RUN })).text, /No test "XYZ-99" in run 20261110-150000\. Tests in it: SMK-01, SMK-02/);
});

test('readable answers: Markdown text (no JSON dump), the same facts as structured data', async (t) => {
  const s = await call('get_latest_run', { runId: RUN });
  t.diagnostic(s.text.split('\n').slice(0, 4).join(' / '));
  assert.match(s.text, /^## .* run 20261110-150000: ■ BLOCKED/);
  assert.match(s.text, /\| Tests \| Passed \| Failed/);
  assert.ok(!s.text.trim().startsWith('{'), 'not a JSON dump');
  const f = await call('list_failures', { runId: RUN });
  assert.match(f.text, /^- ✖ \*\*SMK-05\*\* \[P\d\] · REGRESSION/m, 'one line per failure, with the history tag');
  assert.ok(f.text.length < 2500, `short (${f.text.length} characters)`);
});

test('lists are paged; long parts are cut with a note on how to get more', async () => {
  const one = await call('list_failures', { runId: RUN, limit: 1 });
  assert.equal(one.data.failures.length, 1);
  assert.ok(one.data.total > 1);
  assert.match(one.text, /Showing 1-1 of \d+; call again with offset: 1/);
  const next = await call('list_failures', { runId: RUN, limit: 1, offset: 1 });
  assert.notEqual(next.data.failures[0].test, one.data.failures[0].test);
  const d = await call('get_failure_details', { test: 'SMK-05', runId: RUN, logLines: 0 });
  assert.equal(d.data.appLog.lastErrors.length, 0);
});

test('compare_runs: latest vs the previous run of the same suite, what failed newly and what was fixed', async (t) => {
  const c = await call('compare_runs', { newer: RUN });
  t.diagnostic(c.text.split('\n')[0]);
  assert.equal(c.data.newer.run, RUN);
  assert.ok(c.data.older.run < RUN);
  assert.ok(Array.isArray(c.data.newlyFailing) && Array.isArray(c.data.fixed));
  assert.match(c.text, /\*\*Newly failing:\*\*/);
  assert.match((await call('compare_runs', { newer: RUN, older: RUN })).text, /two different runs/);
});

test('without MCP_STRUCTURED_OUTPUT only the readable text is sent (what Claude shows)', async () => {
  const [a, b] = InMemoryTransport.createLinkedPair();
  await createServer({ reportsDir: reports }).connect(a);
  const c = new Client({ name: 'plain', version: '1' }); await c.connect(b);
  const r = await c.callTool({ name: 'get_latest_run', arguments: { runId: RUN } });
  assert.equal(r.structuredContent, undefined);
  assert.match(r.content[0].text, /^## smoke run/);
  await c.close();
});

test('input is checked before a tool runs: a bad run id is refused', async () => {
  const r = await call('get_latest_run', { runId: '../../etc' });
  assert.equal(r.isError, true);
  assert.match(r.text, /run id looks like 20261116-110316/);
});

test('resources: the README, the settings and every screen\'s layout spec; the triage prompt', async () => {
  const { resources } = await client.listResources();
  const uris = resources.map((r) => r.uri);
  for (const u of ['egenome://docs/readme', 'egenome://settings/triage', 'egenome://settings/budgets', 'egenome://layout-specs/Login']) assert.ok(uris.includes(u), u);
  const spec = JSON.parse((await client.readResource({ uri: 'egenome://layout-specs/Login' })).contents[0].text);
  assert.equal(spec.spec, 'Login');
  const p = await client.getPrompt({ name: 'triage_latest_run', arguments: { suite: 'smoke' } });
  assert.match(p.messages[0].content.text, /get_latest_run with suite "smoke"/);
});

test('end to end over stdio, the way Claude starts it: nothing but MCP messages on stdout', async (t) => {
  const { NODE_TEST_CONTEXT, ...env } = process.env;
  const transport = new StdioClientTransport({ command: process.execPath, args: [path.join(ROOT, 'mcp', 'server.mjs')], env: { ...env, DASHBOARD_DIR: reports, MCP_STRUCTURED_OUTPUT: '1' }, stderr: 'pipe' });
  const c = new Client({ name: 'stdio-test', version: '1' });
  await c.connect(transport);
  const r = await c.callTool({ name: 'list_runs', arguments: { limit: 3 } });
  const { runs } = r.structuredContent;
  t.diagnostic(`over stdio: ${runs.map((x) => `${x.id} ${x.verdict}`).join(', ')}`);
  assert.equal(runs.length, 3);
  await c.close();
});

test('the Claude Desktop extension (mcp/extension) starts this server from the chosen project folder', async (t) => {
  const { NODE_TEST_CONTEXT, ...env } = process.env;
  const launcher = path.join(ROOT, 'mcp', 'extension', 'server', 'index.mjs');
  const transport = new StdioClientTransport({ command: process.execPath, args: [launcher], env: { ...env, EGENOME_PROJECT: ROOT, DASHBOARD_DIR: reports }, stderr: 'pipe' });
  const c = new Client({ name: 'extension-test', version: '1' });
  await c.connect(transport);
  try { // always close the server it started, or it keeps the test process alive
    const { tools } = await c.listTools();
    t.diagnostic(`through the extension: ${tools.length} tools`);
    assert.equal(tools.length, 13); // 10 read-only + run_unit_tests, start_test_run, stop_test_run
  } finally { await c.close(); }
  // a wrong folder gives a clear message instead of a silent failure
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync(process.execPath, [launcher], { env: { ...env, EGENOME_PROJECT: os.tmpdir() }, encoding: 'utf8', timeout: 20000 });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /mcp[\\/]server\.mjs not found: choose the eGenome\.ai project folder/);
});
