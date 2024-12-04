import { test } from '../../e2e/fixtures/mock-server-fixture';
import { expect } from '@playwright/test';
import { GET_USER_QUERY } from '../../../src/helpers/definitions';
import { executeGraphQL } from '../../../src/helpers/helpers';

const EXPECTED_USER = {
  id: '1',
  name: 'Mock User 1',
  email: 'user1@example.com',
};

test.describe('GraphQL API Tests - User Query', () => {
  test('should return user data for a valid ID', async ({ request }) => {
    const variables = { id: EXPECTED_USER.id };

    const { status, data, errors } = await executeGraphQL(
      request,
      GET_USER_QUERY,
      variables
    );

    test.step('Validate GraphQL response structure and status', () => {
      expect(status).toBe(200);
      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(data.user).toBeDefined();
    });

    test.step('Validate user data matches the expected values', () => {
      expect(data.user).toMatchObject(EXPECTED_USER);
    });
  });
});
