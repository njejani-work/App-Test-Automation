#!/usr/bin/env node
// Entry point of the eGenome tests MCP server. Clients (Claude Desktop / Cowork, Claude Code, VS Code) start this file
// and talk to it over stdio. No tool logic here: see src/registry.mjs (the tool list) and src/tools/ (one per file).
//   node mcp/server.mjs                 (the client usually does this)
//   cd mcp && npm run inspect           (try the tools by hand in MCP Inspector)
// Settings: src/config.mjs (DASHBOARD_DIR, MCP_UNIT_TIMEOUT_MIN, MCP_SUITE_TIMEOUT_MIN, MCP_LOG_LEVEL).
import './src/stdout-guard.mjs'; // first: stdout is reserved for MCP messages
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './src/create-server.mjs';

export { createServer } from './src/create-server.mjs';
export { ROOT } from './src/config.mjs';

// started directly (by a client or `npm start`), not imported by a test
const direct = process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (direct) {
  try {
    const server = createServer();
    await server.connect(new StdioServerTransport());
    console.error('[egenome-tests] ready');
  } catch (e) {
    console.error(`[egenome-tests] could not start: ${e.message}`);
    process.exit(1);
  }
}
