import { test } from './fixtures/mock-server-fixture';
import { expect } from '@playwright/test';
import { GET_USER_QUERY } from '../../src/helpers/definitions';
import { executeGraphQL } from '../../src/helpers/helpers';

test.describe('GraphQL API Tests', () => {
    const testCases = [
      { id: '1', expectedName: 'Mock User 1', expectedEmail: 'user1@example.com' },
      { id: '2', expectedName: 'Mock User 2', expectedEmail: 'user2@example.com' },
    ];
  
    testCases.forEach(({ id, expectedName, expectedEmail }) => {
      test(`Fetch user data for ID ${id}`, async ({ request }) => {
        const { status, data, errors } = await executeGraphQL(request, GET_USER_QUERY, { id });
  
        // Validate HTTP status
        expect(status).toBe(200);
  
        // Validate GraphQL response structure
        expect(errors).toBeUndefined();
        expect(data).toBeDefined();
        expect(data.user).toBeDefined();
  
        // Validate user data
        expect(data.user.id).toBe(id);
        expect(data.user.name).toBe(expectedName);
        expect(data.user.email).toBe(expectedEmail);
      });
    });
  });
