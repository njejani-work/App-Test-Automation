// stop_test_run: stops a run started here, with everything it started (WebdriverIO, Appium).
import { ACTION, fail } from '../shared/types.mjs';
import { jobId } from '../shared/schemas.mjs';
import { mark } from '../format/md.mjs';

export default {
  name: 'stop_test_run',
  title: 'Stop a test run',
  description: 'Stops a run started with start_test_run (default: the one going now) and everything it started. The app may be left on any screen; results so far stay on the dashboard.',
  input: { job: jobId },
  annotations: ACTION,

  async run({ job: id }, ctx) {
    const job = id ? ctx.jobs.find(id) : ctx.jobs.running('suite');
    if (!job) fail(id ? `No job "${id}".` : 'No test run started from here is going.');
    const already = job.status !== 'running';
    if (!already) {
      job.stop();
      await Promise.race([job.done, new Promise((r) => setTimeout(r, 10000))]);
    }
    const data = { job: job.id, status: job.status, exitCode: job.exitCode, run: ctx.jobs.runIdOf(job), note: already ? 'It had already finished.' : 'Stopped. The results recorded so far are on the dashboard; the app may be left on any screen.' };
    return { text: `## Job \`${job.id}\`: ${mark(job.status)}\n\n${data.note}${data.run ? ` (run ${data.run})` : ''}`, data };
  },
};
