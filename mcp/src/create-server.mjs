// Builds one MCP server: settings, logger, data access and jobs, then the tools, resources and prompt.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { loadConfig, VERSION } from './config.mjs';
import { createLogger } from './logger.mjs';
import { masker } from './adapters/env-file.mjs';
import { createReportStore } from './adapters/reports.mjs';
import { createJobs } from './services/jobs.mjs';
import { registerTools } from './registry.mjs';
import { registerResources } from './resources.mjs';
import { registerPrompts } from './prompts.mjs';

const instructions = (app) => `The ${app.name} app tests (Appium/WebdriverIO on Android; this server is for ${app.name} only). Reading results: get_latest_run, then list_failures, then get_failure_details for one test (ids like SMK-02); compare_runs for what changed. Running: run_unit_tests (safe, seconds). Device suites with start_test_run clear app data: ALWAYS call it first without confirm, show the user what it says, and call it with confirm: true only after they agree; then follow it with check_test_run. Never ask for or reveal .env values, passwords or OTP codes.`;

/** @param {object} [overrides] for tests: reportsDir, commands, limits, deviceUdid, secrets, logger */
export function createServer(overrides = {}) {
  const config = loadConfig(process.env, overrides);
  const log = overrides.logger || createLogger(config.logLevel, undefined, `${config.app.id}-tests`);
  const mask = masker(config.secrets);
  const ctx = { config, log, mask, reports: createReportStore(config.reportsDir, log), jobs: createJobs(config, mask, log) };

  const server = new McpServer({ name: `${config.app.id}-tests`, version: VERSION }, { instructions: instructions(config.app) });
  registerTools(server, ctx);
  registerResources(server, ctx);
  registerPrompts(server, config.app);

  // a closing server stops what it started (no Appium left running in the background)
  server.server.onclose = () => ctx.jobs.stopAll();
  process.once('exit', () => ctx.jobs.stopAll());
  return server;
}
