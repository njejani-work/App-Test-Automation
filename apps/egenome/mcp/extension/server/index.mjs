// Claude Desktop extension launcher: starts the eGenome test project's MCP server (mcp/server.mjs) from the project
// folder chosen when the extension was installed (EGENOME_PROJECT). The server and its packages stay in the project,
// so this extension is tiny and always runs the project's current code.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.env.EGENOME_PROJECT || '';
const server = path.join(root, 'mcp', 'server.mjs');
const fail = (msg) => { console.error(`[egenome-tests] ${msg}`); process.exit(1); };
if (!root) fail('No project folder set: open the extension\'s settings in Claude and choose the eGenome.ai folder.');
if (!fs.existsSync(server)) fail(`${server} not found: choose the eGenome.ai project folder (the one with mcp/ in it).`);
if (!fs.existsSync(path.join(root, 'mcp', 'node_modules', '@modelcontextprotocol', 'sdk'))) fail('The MCP packages are not installed: run `npm run mcp:install` in the project folder, then restart the extension.');
process.argv[1] = server; // the server starts talking over stdio when it is the main script
await import(pathToFileURL(server).href);
