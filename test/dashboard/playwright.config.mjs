// Page tests for the dashboard (not for the Wikipedia app). Run: npm run test:dashboard:page
// Builds the demo runs into .dashboard-test/reports, then opens reports/index.html from disk (file://),
// the same way you open it. Three views: desktop (light), desktop (dark), phone.
// Evidence screenshots: .dashboard-test/screenshots/   HTML report: .dashboard-test/report/
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './page',
  outputDir: '../../.dashboard-test/results',
  globalSetup: './page/global-setup.mjs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 30_000,
  reporter: [['list'], ['html', { outputFolder: '../../.dashboard-test/report', open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 }, colorScheme: 'light' } },
    { name: 'dark', use: { viewport: { width: 1440, height: 1000 }, colorScheme: 'dark' } },
    { name: 'phone', use: { ...devices['Pixel 7'], browserName: 'chromium' } },
  ],
});
