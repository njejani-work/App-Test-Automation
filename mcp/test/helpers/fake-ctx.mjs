// A ctx for calling a tool's run() directly, from a fixture file: no server, no reports folder, no device.
import fs from 'node:fs';
import { createLogger } from '../../src/logger.mjs';

export function fakeCtx(fixture, { secrets = [] } = {}) {
  const { index, runs } = JSON.parse(fs.readFileSync(new URL(`../fixtures/${fixture}`, import.meta.url), 'utf8'));
  const logged = [];
  return {
    logged,
    config: { structured: true, reportsDir: '/reports', limits: { unitMs: 1000, suiteMs: 1000 } },
    log: createLogger('debug', (line) => logged.push(line)),
    mask: (t) => secrets.reduce((s, x) => s.split(x).join('••••••'), String(t)),
    reports: {
      freshen: async () => {},
      index: () => index,
      run: (id) => runs[id] || null,
      unitRuns: () => [],
      file: (...p) => ['/reports', ...p].join('/'),
      abs: (rel) => (rel ? `/reports/${rel}` : null),
    },
  };
}
