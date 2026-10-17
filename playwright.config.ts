import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:3015', trace: 'retain-on-failure' },
  webServer: {
    command: 'python3 scripts/preview.py',
    url: 'http://127.0.0.1:3015',
    env: { PORT: '3015' },
    reuseExistingServer: !process.env.CI,
  },
});
