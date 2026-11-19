// WebdriverIO configuration: the shared settings (@apptest/toolkit) + this app's app.config.js + its own hooks.
//
//   npm run test:smoke
//     └─ WebdriverIO + Mocha                   picks the suite, device, timeouts, reporters (toolkit + app.config.js)
//          └─ spec (test/specs/smoke)          test steps written as page-object calls
//               └─ page objects                know how to find and use each screen
//                    └─ Appium (port 4723)     turns WebDriver calls into device commands
//                         └─ UiAutomator2      on the emulator: taps, types, reads the screen
//                              └─ the APK built by scripts/build-apk.sh (out/)
import 'dotenv/config'; // first: app.config.js reads APK_PATH, APP_ID and APP_ACTIVITY from .env
import { createConfig } from '@apptest/toolkit/wdio/index.js';
import app from './app.config.js';
import { hooks } from './test/helpers/hooks.js';

// replace afterTest: this project never had the toolkit's screenshot-on-failure hook (the dashboard takes its own)
export const config = await createConfig(app, { hooks, replace: ['afterTest'] });
