import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: false,
  reporter: 'line',
  use: {
    baseURL: 'http://localhost:4173',
    browserName: 'chromium',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'node scripts/serve-site.mjs',
    url: 'http://localhost:4173',
    reuseExistingServer: true
  }
});
