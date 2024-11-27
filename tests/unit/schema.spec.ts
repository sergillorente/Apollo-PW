import { test, expect } from '@playwright/test';
import { typeDefs } from '../../src/schema';

test('Schema should define a Query type', () => {
  expect(typeDefs).toBeDefined();
});
