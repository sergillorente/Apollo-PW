import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

export default defineConfig({
  projects: [
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: {
        baseURL: `http://localhost:${PORT}`,
      },
    },
    {
      name: 'integration',
      testDir: './tests/integration',
      use: {
        baseURL: `http://localhost:${PORT}`,
      },
    },
  ],
  timeout: 30000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on',
  },
});
