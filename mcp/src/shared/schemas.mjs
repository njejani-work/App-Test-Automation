// Input fields shared by several tools, so the same thing is always called and described the same way.
import { z } from 'zod';

export const runId = z.string().regex(/^\d{8}-\d{6}$/, 'a run id looks like 20261116-110316').optional()
  .describe('Run id like 20261116-110316; default: the latest');
export const suite = z.string().max(40).optional().describe('Suite name, e.g. smoke (the app\'s suites: start_test_run lists them)');
export const limit = (def = 20, max = 100) => z.number().int().min(1).max(max).default(def).describe(`How many to return (default ${def})`);
export const offset = z.number().int().min(0).default(0).describe('Skip this many (for the next page)');
export const testId = z.string().min(1).max(120).describe('Test id like SMK-02, or part of its title');
export const jobId = z.string().regex(/^(unit|suite)-\d+$/).optional().describe('Job id from start_test_run; default: the newest');
