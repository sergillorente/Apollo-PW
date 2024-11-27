import { test } from '../../src/fixtures/mock-server-fixture';
import { expect } from '@playwright/test';

test.describe('GraphQL API Tests', () => {
  test('Query mock GraphQL API for user data', async ({ request }) => {
    const response = await request.post('http://localhost:4000/graphql', {
      data: {
        query: `
          query GetUser($id: ID!) {
            user(id: $id) {
              id
              name
              email
            }
          }
        `,
        variables: { id: '1' },
      },
    });

    expect(response.status()).toBe(200);

    const { data } = await response.json();
    expect(data.user.id).toBe('1');
    expect(data.user.name).toBe('Mock User 1');
    expect(data.user.email).toBe('user1@example.com');
  });
});
