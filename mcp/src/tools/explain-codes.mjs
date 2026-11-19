// explain_codes: what the codes in a text mean (uses the dashboard's code tables).
import { z } from 'zod';
import { READ_ONLY } from '../shared/types.mjs';
import { codes } from '../adapters/project.mjs';

export default {
  name: 'explain_codes',
  title: 'What a code means',
  description: 'One-line meaning of the codes in a text: HTTP status codes, process exit codes, signals, Android / Appium errors, P0-P3 priorities.',
  input: { text: z.string().min(1).max(2000).describe('An error message, a log line, or just a code like 503 or "exit code 137"') },
  annotations: READ_ONLY,

  async run({ text }) {
    const { codesIn, httpMeaning } = await codes();
    const meanings = codesIn(text);
    const bare = text.trim();
    if (/^\d{3}$/.test(bare) && httpMeaning(Number(bare))) meanings.unshift(`HTTP ${bare}: ${httpMeaning(Number(bare))}`);
    return {
      text: meanings.length ? meanings.map((m) => `- ${m}`).join('\n') : `No known code found in "${bare.slice(0, 80)}".`,
      data: { meanings },
    };
  },
};
