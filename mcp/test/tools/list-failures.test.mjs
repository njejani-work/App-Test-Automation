// Unit test of one tool (the example to copy): call run() with a fake ctx built from a fixture file.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import tool from '../../src/tools/list-failures.mjs';
import { ToolError } from '../../src/shared/types.mjs';
import { answer } from '../../src/registry.mjs';
import { fakeCtx } from '../helpers/fake-ctx.mjs';

const input = (args = {}) => z.object(tool.input).parse(args); // the defaults the SDK would fill in

test('list_failures: one line per failure with priority, history tag, error, failed step and same-cause tests', async () => {
  const { text, data } = await tool.run(input(), fakeCtx('runs-small.json'));
  assert.equal(data.run, '20261116-110316');
  assert.equal(data.failed, 2);
  assert.deepEqual(data.failures.map((f) => f.test), ['SMK-02', 'SMK-03']);
  const smk2 = data.failures[0];
  assert.equal(smk2.error, 'LoginPage did not open within 20000ms', 'only the first line of the error');
  assert.equal(smk2.history.tag, 'REGRESSION');
  assert.deepEqual(smk2.sameCauseAs, ['SMK-03']);
  assert.match(text, /^## 2 failed test\(s\) in smoke run 20261116-110316/);
  assert.match(text, /^- ✖ \*\*SMK-02\*\* \[P0\] · REGRESSION · product bug · `LoginPage did not open within 20000ms` · at "LoginPage.open" · same cause as SMK-03$/m);
  assert.match(text, /^- ✖ \*\*SMK-03\*\* \[P1\] · FLAKY/m, "passed and failed on the same app build (B2)");
});

test('list_failures: limit and offset page through the list, with a note on how to get the next page', async () => {
  const ctx = fakeCtx('runs-small.json');
  const first = await tool.run(input({ limit: 1 }), ctx);
  assert.deepEqual([first.data.failures.length, first.data.total], [1, 2]);
  assert.match(first.text, /Showing 1-1 of 2; call again with offset: 1/);
  const second = await tool.run(input({ limit: 1, offset: 1 }), ctx);
  assert.equal(second.data.failures[0].test, 'SMK-03');
  assert.doesNotMatch(second.text, /Showing/);
});

test('list_failures: a run without failures says so', async () => {
  const { text, data } = await tool.run(input({ runId: '20261115-090000' }), fakeCtx('runs-small.json'));
  assert.equal(data.total, 0);
  assert.equal(text, '## smoke run 20261115-090000: no failures ✔');
});

test('list_failures: an unknown run is a clear ToolError listing the kept runs', async () => {
  await assert.rejects(tool.run(input({ runId: '19990101-000000' }), fakeCtx('runs-small.json')),
    (e) => e instanceof ToolError && /Run "19990101-000000" not found\. Kept runs \(newest first\): 20261116-110316 \(smoke\), 20261115-090000 \(smoke\)/.test(e.message));
});

test('through the registry: Markdown + structured data; secrets masked in both', async () => {
  const r = await answer(tool, fakeCtx('runs-small.json', { secrets: ['20000ms'] }))(input());
  assert.equal(r.isError, undefined);
  assert.match(r.content[0].text, /did not open within ••••••/);
  assert.equal(r.structuredContent.failures[0].error, 'LoginPage did not open within ••••••');
});
