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
    // Claim commands are run directly from a clean checkout. Build the exact
    // extension and static site that the browser tests consume instead of
    // relying on ignored artifacts from an earlier command.
    command: 'npm run build:site && node scripts/serve-site.mjs',
    url: 'http://localhost:4173',
    reuseExistingServer: true
  }
});
