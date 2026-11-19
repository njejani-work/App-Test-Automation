// The ONE list of tools, plus how every tool call is answered: Markdown text (+ structured data when switched on), secrets masked,
// expected problems as clear messages, unexpected ones logged to stderr (never a stack trace to the client).
import { ToolError } from './shared/types.mjs';
import listRuns from './tools/list-runs.mjs';
import getLatestRun from './tools/get-latest-run.mjs';
import listFailures from './tools/list-failures.mjs';
import getFailureDetails from './tools/get-failure-details.mjs';
import compareRuns from './tools/compare-runs.mjs';
import getUnitTestResults from './tools/get-unit-test-results.mjs';
import explainCodes from './tools/explain-codes.mjs';
import deviceStatus from './tools/device-status.mjs';
import listLayoutSpecs from './tools/list-layout-specs.mjs';
import runUnitTests from './tools/run-unit-tests.mjs';
import startTestRun from './tools/start-test-run.mjs';
import checkTestRun from './tools/check-test-run.mjs';
import stopTestRun from './tools/stop-test-run.mjs';

/** In the order clients show them: reading first, then running. */
export const TOOLS = [
  getLatestRun, listFailures, getFailureDetails, compareRuns, listRuns, getUnitTestResults, explainCodes, deviceStatus, listLayoutSpecs,
  runUnitTests, startTestRun, checkTestRun, stopTestRun,
];

/** A tool's description and input may depend on the app (its name, its suites): then they are functions of the config. */
const forApp = (v, config) => (typeof v === 'function' ? v(config) : v);

export function registerTools(server, ctx, tools = TOOLS) {
  for (const tool of tools) {
    server.registerTool(tool.name, { title: tool.title, description: forApp(tool.description, ctx.config), inputSchema: forApp(tool.input, ctx.config), annotations: tool.annotations }, answer(tool, ctx));
  }
}

const text = (t) => [{ type: 'text', text: t }];

/** Wraps a tool's run() into an MCP answer. Exported for tests. */
export function answer(tool, ctx) {
  return async (input, extra) => {
    const started = Date.now();
    try {
      const { text: md, data } = await tool.run(input, ctx, extra);
      const out = ctx.mask(md);
      ctx.log.debug(`${tool.name} ${Date.now() - started} ms, ${out.length} characters`);
      return { content: text(out), ...(data && ctx.config.structured ? { structuredContent: maskData(data, ctx.mask) } : {}) };
    } catch (e) {
      if (e instanceof ToolError) return { content: text(ctx.mask(e.message)), isError: true };
      ctx.log.error(`${tool.name} failed with`, e);
      const why = String(e?.message || e).split('\n')[0].slice(0, 200);
      return { content: text(ctx.mask(`${tool.name} hit an unexpected problem (${why}). The details are in the server log (stderr); try again, or report it with the input used.`)), isError: true };
    }
  };
}

/** Masks secrets inside the structured data too; if masking breaks the JSON, no structured data is sent. */
function maskData(data, mask) {
  const json = JSON.stringify(data);
  const masked = mask(json);
  if (masked === json) return data;
  try { return JSON.parse(masked); } catch { return undefined; }
}
