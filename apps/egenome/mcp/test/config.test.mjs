// Settings: checked at start-up; the reports folder must stay inside the project (or the temp folder for tests).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { loadConfig, allowedReportsDir, ROOT } from '../src/config.mjs';

test('defaults: reports/ in the project, 5 and 60 minute limits, only npm scripts as commands', () => {
  const c = loadConfig({}, { secrets: [] });
  assert.equal(c.reportsDir, path.join(ROOT, 'reports'));
  assert.deepEqual(c.limits, { unitMs: 300000, suiteMs: 3600000 });
  assert.deepEqual(c.commands.suite('smoke'), { cmd: 'npm', args: ['run', 'test:smoke'] });
  assert.ok(Object.isFrozen(c));
});

test('a folder outside the project is refused; a wrong setting gives a clear message', () => {
  assert.throws(() => allowedReportsDir(path.parse(ROOT).root + 'Windows'), /DASHBOARD_DIR must be inside the project folder/);
  assert.equal(allowedReportsDir(path.join(os.tmpdir(), 'x')), path.join(os.tmpdir(), 'x'));
  assert.throws(() => loadConfig({ MCP_SUITE_TIMEOUT_MIN: 'soon' }), /Bad MCP setting: MCP_SUITE_TIMEOUT_MIN/);
  assert.throws(() => loadConfig({ MCP_LOG_LEVEL: 'loud' }), /Bad MCP setting: MCP_LOG_LEVEL/);
});
