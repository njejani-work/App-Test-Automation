// The server's only logger: one line per message on stderr (never stdout, see stdout-guard.mjs).
// MCP_LOG_LEVEL=debug also logs each tool call with its time and answer size.
const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

const show = (x) => (x instanceof Error ? x.stack || x.message : typeof x === 'string' ? x : JSON.stringify(x));

/** @returns {import('./shared/types.mjs').Logger} */
export function createLogger(level = 'info', write = (line) => process.stderr.write(line)) {
  const max = LEVELS[level] ?? LEVELS.info;
  const at = (name) => (...parts) => { if (LEVELS[name] <= max) write(`[egenome-tests] ${name}: ${parts.map(show).join(' ')}\n`); };
  return { error: at('error'), warn: at('warn'), info: at('info'), debug: at('debug') };
}
