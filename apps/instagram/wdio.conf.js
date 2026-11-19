// Instagram tests: the shared WebdriverIO config (@apptest/toolkit) with this app's settings and hooks.
import 'dotenv/config'; // first: the test accounts in test/data/users.js are read from .env when imported
import { createConfig } from '@apptest/toolkit/wdio/index.js';
import app from './app.config.js';
import { hooks } from './test/helpers/hooks.js';
export const config = await createConfig(app, { hooks, replace: ['afterTest'] }); // no extra screenshot hook: as before
