// Documents the assistant can read: the README, the settings files and each screen's layout spec.
// Only these fixed files (from config) are served; a spec name is reduced to a bare file name.
import fs from 'node:fs';
import path from 'node:path';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerResources(server, { config }) {
  const fixed = (name, uri, file, mimeType, description) => server.registerResource(name, uri, { title: path.basename(file), description, mimeType },
    async (u) => ({ contents: [{ uri: u.href, mimeType, text: fs.readFileSync(file, 'utf8') }] }));
  fixed('readme', 'egenome://docs/readme', config.docs.readme, 'text/markdown', 'How the project works: setup, suites, page objects, layout checks, dashboard, unit tests.');
  fixed('triage-settings', 'egenome://settings/triage', config.docs.triage, 'application/json', 'Modules and owners, test priorities, known issues, known log lines, quarantine.');
  fixed('budgets', 'egenome://settings/budgets', config.docs.budgets, 'application/json', 'Performance limits: app start, memory, slow tests, API times.');

  const specs = () => { try { return fs.readdirSync(config.specsDir).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)); } catch { return []; } };
  server.registerResource('layout-spec', new ResourceTemplate('egenome://layout-specs/{screen}', {
    list: async () => ({ resources: specs().map((s) => ({ uri: `egenome://layout-specs/${s}`, name: `Layout spec: ${s}`, mimeType: 'application/json' })) }),
  }), { title: 'Layout spec of a screen', description: 'Expected elements, text, positions and rules of one screen.', mimeType: 'application/json' }, async (u, { screen }) => {
    const name = path.basename(String(screen));
    if (!specs().includes(name)) throw new Error(`No layout spec "${name}". Specs: ${specs().join(', ')}`);
    return { contents: [{ uri: u.href, mimeType: 'application/json', text: fs.readFileSync(path.join(config.specsDir, `${name}.json`), 'utf8') }] };
  });
}
