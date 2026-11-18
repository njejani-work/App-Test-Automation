// Small Markdown helpers shared by the tools. Answers stay short: tables only for real tables, lists otherwise.
export const cell = (v) => String(v ?? '—').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ');
export const table = (head, rows) => (rows.length
  ? [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join('\n')
  : '_none_');
export const list = (items) => items.filter(Boolean).map((i) => `- ${i}`).join('\n');
export const block = (text) => `\`\`\`text\n${String(text ?? '').trim()}\n\`\`\``;
export const when = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
export const secs = (ms) => `${Math.round((ms || 0) / 100) / 10} s`;
export const names = (a) => (a?.length ? a.join(', ') : 'none');
const MARKS = { passed: '✔ passed', failed: '✖ failed', skipped: '– skipped', warning: '⚠ warning', running: '… running', cancelled: '✖ cancelled', 'timed out': '✖ timed out', stopped: '■ stopped', PASS: '✔ PASS', UNSTABLE: '≈ UNSTABLE', BLOCKED: '■ BLOCKED', 'NO TESTS': '– NO TESTS' };
/** A status with a symbol AND the word (never the symbol alone). */
export const mark = (s) => MARKS[s] || s;
/** "Showing 1-20 of 34; call again with offset: 20 for more." when a list was cut. */
export const pageNote = (shown, total, offset) => (offset + shown < total ? `\n\n_Showing ${offset + 1}-${offset + shown} of ${total}; call again with offset: ${offset + shown} for more._` : '');
