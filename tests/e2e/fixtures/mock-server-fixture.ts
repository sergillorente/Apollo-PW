import { test as baseTest } from '@playwright/test';
import { ApolloServer } from 'apollo-server';
import { startMockServer } from '../../../src/mock-server';

type TestFixtures = {
  server: ApolloServer;
};

export const test = baseTest.extend<TestFixtures>({
  server: async ({}, use) => {
    const server = await startMockServer(4000);
    await use(server);
    if (server) {
      await server.stop();
    }
  },
});
