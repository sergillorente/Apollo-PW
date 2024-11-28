import { test } from './fixtures/mock-server-fixture';
import { expect } from '@playwright/test';
import { GET_USER_QUERY } from '../../src/helpers/definitions';
import { executeGraphQL } from '../../src/helpers/helpers';

test.describe('GraphQL API Tests', () => {
  test('Query mock GraphQL API for user data', async ({ request }) => {
    const variables = { id: '1' };

    const { status, data, errors } = await executeGraphQL(request, GET_USER_QUERY, variables);

    // Validate HTTP status
    expect(status).toBe(200);

    // Validate GraphQL response structure
    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.user).toBeDefined();

    // Validate user data
    expect(data.user.id).toBe('1');
    expect(data.user.name).toBe('Mock User 1');
    expect(data.user.email).toBe('user1@example.com');
  });
});
