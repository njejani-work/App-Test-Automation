// list_layout_specs: which screens have a layout spec, and whether each one was reviewed.
// A small tool written as a learning example: one input, one folder read, a table out.

// 1. Imports: zod describes the inputs; READ_ONLY tells the client this tool changes nothing.
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { READ_ONLY } from '../shared/types.mjs';
import { limit, offset } from '../shared/schemas.mjs';
import { table, pageNote } from '../format/md.mjs';

// "elements" is an object keyed by element name ({ headline: {...}, sendOtpBtn: {...} }); "rules" is a list
const count = (x) => (Array.isArray(x) ? x.length : Object.keys(x || {}).length);

// 2. The tool is a plain object. The registry (src/registry.mjs) turns it into an MCP tool.
export default {
  // the name the AI calls: snake_case, verb_noun
  name: 'list_layout_specs',
  // a short title people see in Claude
  title: 'Layout specs',
  // written FOR THE AI: when to use the tool and what it gets back
  description: 'Lists the screens that have a layout spec (test/layout/specs): elements and rules checked, the screen size it was recorded on, and whether a person has reviewed it. Use it before explaining a layout failure.',

  // 3. Inputs, described with zod. The SDK checks them before run() is called and fills in defaults.
  input: {
    onlyNotReviewed: z.boolean().default(false).describe('Only the specs nobody has reviewed yet'),
    // every list_* tool pages its answer (a project rule, checked by test/registry.test.mjs)
    limit: limit(20),
    offset,
  },

  // reads files, changes nothing
  annotations: READ_ONLY,

  // 4. The work. `input` holds the checked inputs; `ctx` gives settings (ctx.config), the logger, data access...
  async run({ onlyNotReviewed, limit: max, offset: from }, ctx) {
    const dir = ctx.config.specsDir; // a fixed folder from config.mjs: the tool never takes a path from the AI

    // read every <Screen>.json in the folder
    const all = fs.readdirSync(dir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => {
        const spec = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
        return {
          screen: spec.spec,
          page: spec.page,
          elements: count(spec.elements),
          rules: count(spec.rules),
          recordedOn: spec.baseline ? `${spec.baseline.w}x${spec.baseline.h}` : null,
          recordedAt: spec.generatedAt?.slice(0, 10) || null,
          reviewed: spec.reviewed === true,
        };
      })
      .filter((s) => !onlyNotReviewed || !s.reviewed);
    const specs = all.slice(from, from + max); // this page only

    // 5. The answer: `text` (Markdown that people and the AI read) and `data` (the same facts as JSON).
    const reviewed = all.filter((s) => s.reviewed).length;
    const text = all.length
      ? [
        `## ${all.length} layout spec(s), ${reviewed} reviewed`,
        table(['Screen', 'Page object', 'Elements', 'Rules', 'Recorded on', 'Date', 'Reviewed'],
          specs.map((s) => [s.screen, s.page, s.elements, s.rules, s.recordedOn, s.recordedAt, s.reviewed ? '✔ yes' : '✖ no'])),
      ].join('\n\n') + pageNote(specs.length, all.length, from)
      : 'No layout specs match.';
    return { text, data: { total: all.length, reviewed, offset: from, specs } };
  },
};
