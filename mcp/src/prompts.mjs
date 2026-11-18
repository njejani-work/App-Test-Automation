// Ready-made instructions the user can pick in the client.
import { z } from 'zod';

export function registerPrompts(server) {
  server.registerPrompt('triage_latest_run', {
    title: 'Triage the latest run',
    description: 'Go through the latest run: verdict, each failure with its likely cause and the next action.',
    argsSchema: { suite: z.string().optional().describe('e.g. smoke') },
  }, ({ suite }) => ({
    messages: [{ role: 'user', content: { type: 'text', text: [
      `Triage the latest ${suite ? `${suite} ` : ''}test run of the eGenome.ai app.`,
      `1. Call get_latest_run${suite ? ` with suite "${suite}"` : ''} and state the verdict and why.`,
      '2. Call list_failures. Group failures that share a cause.',
      '3. For each group, call get_failure_details for one test and decide: product bug, test bug, environment or infrastructure, using the failed step, the error, the layout results, the app log and the history (NEW / RECURRING / FLAKY / REGRESSION).',
      '4. If useful, call compare_runs to see what changed since the previous run.',
      '5. Say what to do next for each (with the file and line when the test code is at fault), most urgent (P0, regressions) first.',
      'Quote test ids (SMK-02) and keep it short. Never ask for or show .env values or OTP codes.',
    ].join('\n') } }],
  }));
}
