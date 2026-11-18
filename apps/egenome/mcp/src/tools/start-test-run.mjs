// start_test_run: starts a device suite in the background, ONLY after the user confirmed (it clears app data).
import { z } from 'zod';
import { ACTION, fail } from '../shared/types.mjs';
import { device } from '../adapters/project.mjs';
import { activeRunElsewhere } from '../adapters/run-log.mjs';
import { adbDevices, ADB_MISSING, notReadyHint } from '../services/devices.mjs';
import { list } from '../format/md.mjs';

const SUITES = {
  smoke: { minutes: '5-10', what: 'the 8 most important tests: login, Home, Reports, Premium, Settings, sign out' },
  regression: { minutes: '20-45', what: 'every P0 / P1 flow (6 spec files)' },
  layout: { minutes: '10-20', what: 'visits 15 screens and checks their layout' },
};

export default {
  name: 'start_test_run',
  title: 'Start a device test suite',
  description: 'Starts smoke, regression or layout on the device in .env (DEVICE_UDID) as a background job; CLEARS THE APP\'S DATA first and takes 5-45 min. Call it first WITHOUT confirm: it only describes what would happen; show that to the user, and call again with confirm: true only after they agree. Then use check_test_run.',
  input: {
    suite: z.enum(['smoke', 'regression', 'layout']),
    confirm: z.boolean().default(false).describe('true only after the user agreed to what the first call described'),
  },
  annotations: { ...ACTION, destructiveHint: true },

  async run({ suite, confirm }, ctx) {
    const { config, jobs } = ctx;
    const busy = jobs.running('suite');
    if (busy) fail(`A test run is already going (${busy.id}, ${busy.label}, started ${busy.startedAt}). One device run at a time: follow it with check_test_run or stop it with stop_test_run.`);
    const elsewhere = activeRunElsewhere(config.reportsDir);
    if (elsewhere && !jobs.ownsRun(elsewhere.runId)) fail(`A test run started outside the assistant is still going (run ${elsewhere.runId}, last activity ${elsewhere.lastActivity}). Wait for it to finish; one device run at a time.`);

    const devices = await adbDevices();
    if (!devices) fail(`${ADB_MISSING} No device can be checked or used.`);
    const dev = devices.find((d) => d.id === config.deviceUdid);
    if (dev?.state !== 'device') fail(`The device the tests use (DEVICE_UDID=${config.deviceUdid} in .env) is ${dev ? `"${dev.state}" (not ready${notReadyHint(dev.state)})` : 'not connected'}. adb sees: ${devices.map((d) => `${d.id} (${d.state})`).join(', ') || 'nothing'}. Start the emulator or connect the phone, or change DEVICE_UDID.`);

    const tools = config.suiteEnv();
    if (tools.missing.length) fail(`Appium needs ${tools.missing.join(' and ')}, and this server cannot find it. Set it in Windows (System → Environment variables) and restart Claude, or add it to the server's "env" in the Claude config.`);
    const details = await (await device()).deviceDetails(config.deviceUdid);
    const last = ctx.reports.index()?.runs.find((r) => (r.suites || []).includes(suite) && r.durationMs && r.summary.total > 1);
    const plan = {
      suite, what: SUITES[suite].what, device: `${config.deviceUdid}${details?.emulator ? ' (emulator)' : ' (A REAL PHONE)'}`,
      effects: [
        'The eGenome app\'s data on this device is CLEARED first: the test account is logged out and any app data there is lost.',
        details?.emulator ? null : 'WARNING: this is a real phone, not the emulator. Do not run it on a phone where eGenome is used with a personal account.',
        'The tests log in with the test account from .env and go through the app.',
        'Results are recorded on the dashboard (reports/).',
      ].filter(Boolean),
      expectedMinutes: last ? String(Math.max(1, Math.round(last.durationMs / 60000))) : SUITES[suite].minutes,
      timeLimitMinutes: Math.round(config.limits.suiteMs / 60000),
      tools: tools.notes,
    };
    const facts = list([`**What:** ${plan.what}`, `**Device:** ${plan.device}`, `**Takes about:** ${plan.expectedMinutes} min (stopped after ${plan.timeLimitMinutes} min)`, ...plan.tools.map((n) => `**${n.split(':')[0]}:**${n.slice(n.indexOf(':') + 1)}`)]);
    if (!confirm) {
      const next = 'Nothing has started. Show this to the user; if they agree, call start_test_run again with confirm: true.';
      return { text: `## Ready to start ${suite}: NOT started yet\n\n${facts}\n\n**What will happen:**\n${list(plan.effects)}\n\n➡ ${next}`, data: { needsConfirmation: true, ...plan, next } };
    }
    const job = jobs.startSuite(suite);
    const next = `Follow it with check_test_run (job "${job.id}"); every 1-2 minutes is enough.`;
    return { text: `## ▶ ${suite} started (job \`${job.id}\`)\n\n${facts}\n\n➡ ${next}`, data: { started: true, job: job.id, ...plan, next } };
  },
};
