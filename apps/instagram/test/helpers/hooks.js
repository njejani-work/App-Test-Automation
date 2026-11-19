// Instagram's own WebdriverIO hooks. They run before the toolkit's dashboard hooks (createConfig adds those after).
import fs from 'node:fs';
import { step, logAction } from '@apptest/toolkit/dashboard/recorder.js';
import { installPermissionGuard, denyPermissionPopupIfShown } from './permissions.js';
import { installLogging, registerSecrets } from './evidence.js';
import { users } from '../data/users.js';
import { LOG_DIR } from '../../app.config.js';

export const hooks = {
  /** Launcher, once: a fresh Allure folder, and this run's log folder. */
  onPrepare() {
    fs.rmSync('./allure-results', { recursive: true, force: true });
    fs.mkdirSync(LOG_DIR, { recursive: true });
  },

  /** Worker, once per spec file. */
  async before() {
    // the specs' step('...') and the typed / tapped elements go to the shared recorder (see evidence.js)
    globalThis.DASHBOARD_STEP = step;
    globalThis.DASHBOARD_ACTION = logAction;
    await driver.setTimeout({ implicit: 0 });
    try { await driver.activateApp('com.instagram.android'); } catch { /* already in the foreground */ }
    registerSecrets([users.valid.password, users.invalid.password]); // masked in every log and report
    // Deny the notification-permission popup whenever it appears during any wait. First, and on its own: if anything
    // here fails, WebdriverIO only logs it and goes on, and the tests would wait behind the popup (19 Nov 2026).
    // DENY_ALL_PERMISSIONS=true denies every runtime-permission popup, not just notifications.
    installPermissionGuard({ only: process.env.DENY_ALL_PERMISSIONS === 'true' ? null : /notif/i });
    try { installLogging(); } catch (e) { console.error(`[evidence] click / typing log not installed: ${e.message}`); }
  },

  /** The popup can still be up from the previous test. */
  async beforeTest() {
    await denyPermissionPopupIfShown();
  },
};
