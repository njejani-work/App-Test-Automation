// Every tool follows the conventions (see docs/ARCHITECTURE.md), and errors reach the AI as clear messages.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { TOOLS, answer } from '../src/registry.mjs';
import { ToolError } from '../src/shared/types.mjs';
import { fakeCtx } from './helpers/fake-ctx.mjs';
import { loadConfig } from '../src/config.mjs';

const toolFiles = fs.readdirSync(new URL('../src/tools/', import.meta.url)).filter((f) => f.endsWith('.mjs'));

test('one tool per file, every file registered, file name = tool name in kebab-case', () => {
  assert.equal(TOOLS.length, toolFiles.length);
  for (const t of TOOLS) assert.ok(toolFiles.includes(`${t.name.replace(/_/g, '-')}.mjs`), `${t.name} lives in src/tools/${t.name.replace(/_/g, '-')}.mjs`);
});

test('names, descriptions and annotations follow the conventions', () => {
  const config = loadConfig({}, { secrets: [] });
  const forApp = (v) => (typeof v === 'function' ? v(config) : v); // some depend on the app (its name, its suites)
  for (const t of TOOLS) {
    const description = forApp(t.description);
    assert.match(t.name, /^[a-z]+(_[a-z]+)+$/, `${t.name}: snake_case verb_noun`);
    assert.ok(description.length >= 60 && description.length <= 420, `${t.name}: description of ${description.length} characters (60-420)`);
    assert.equal(typeof t.annotations.readOnlyHint, 'boolean', `${t.name}: says whether it is read-only`);
    assert.equal(typeof t.run, 'function');
    for (const [k, v] of Object.entries(forApp(t.input))) assert.ok(v.safeParse, `${t.name}.${k} is a zod schema`);
  }
  const lists = TOOLS.filter((t) => t.name.startsWith('list_'));
  for (const t of lists) assert.ok(t.input.limit && t.input.offset, `${t.name} has limit and offset`);
});

test('no source file is longer than 150 lines', () => {
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(new URL(`${e.name}/`, dir)) : [new URL(e.name, dir)]));
  for (const f of [...walk(new URL('../src/', import.meta.url)), new URL('../server.mjs', import.meta.url)]) {
    const n = fs.readFileSync(f, 'utf8').split('\n').length;
    assert.ok(n <= 150, `${f.pathname.split('/mcp/')[1]}: ${n} lines`);
  }
});

test('an unexpected crash becomes a short message (no stack trace to the client), logged in full on stderr', async () => {
  const ctx = fakeCtx('runs-small.json');
  const broken = { name: 'broken_tool', run: async () => { const e = new TypeError("Cannot read properties of undefined (reading 'x')"); e.stack = 'TypeError: …\n    at secret/path.js:1:1'; throw e; } };
  const r = await answer(broken, ctx)({});
  assert.equal(r.isError, true);
  assert.match(r.content[0].text, /^broken_tool hit an unexpected problem \(Cannot read properties of undefined \(reading 'x'\)\)\. The details are in the server log/);
  assert.doesNotMatch(r.content[0].text, /secret\/path/);
  assert.match(ctx.logged.join(''), /error: broken_tool failed with TypeError/);
});

test('an expected problem (ToolError) is passed on as it is', async () => {
  const r = await answer({ name: 'x_y', run: async () => { throw new ToolError('Run "1" not found. Kept runs: …'); } }, fakeCtx('runs-small.json'))({});
  assert.deepEqual([r.isError, r.content[0].text], [true, 'Run "1" not found. Kept runs: …']);
});
