import { defineConfig } from '@playwright/test';

const PORT = process.env.PORT || 4000;

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '*.e2e.ts',
  timeout: 30000,
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
});
