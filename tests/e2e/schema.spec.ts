import { test, expect } from '@playwright/test';
import { typeDefs } from '../../src/schema';

test.describe('GraphQL Schema', () => {
  test('should define the schema correctly', () => {
    expect(typeDefs).toBeDefined();
    expect(typeDefs.kind).toBe('Document');
  });
});
