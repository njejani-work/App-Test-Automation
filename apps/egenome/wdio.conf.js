// eGenome tests: the shared WebdriverIO config (@apptest/toolkit) with this app's settings (app.config.js).
import { createConfig } from '@apptest/toolkit/wdio/index.js';
import app from './app.config.js';
export const config = await createConfig(app);
