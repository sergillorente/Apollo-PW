import { test } from '../../src/fixtures/mock-server-fixture';
import { expect } from '@playwright/test';
import { ApolloServer } from 'apollo-server';
import { typeDefs } from '../../src/schema';
import { resolvers } from '../../src/resolvers';

test.describe('GraphQL API Integration', () => {
  let server: ApolloServer;

  test.beforeAll(async () => {
    server = new ApolloServer({ typeDefs, resolvers });
    await server.listen({ port: 4001 });
  });

  test.afterAll(async () => {
    await server.stop();
  });

  test('should fetch a user by ID', async ({ request }) => {
    const query = `
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          name
          email
        }
      }
    `;
    const variables = { id: '1' };
    const response = await request.post('http://localhost:4001/graphql', {
      data: { query, variables },
    });

    expect(response.status()).toBe(200);

    const { data } = await response.json();
    expect(data.user.id).toBe('1');
    expect(data.user.name).toBe('Mock User');
  });

  test('should create a new user', async ({ request }) => {
    const mutation = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          name
          email
        }
      }
    `;
    const variables = {
      input: { name: 'New User', email: 'newuser@example.com' },
    };
    const response = await request.post('http://localhost:4001/graphql', {
      data: { mutation, variables },
    });

    expect(response.status()).toBe(200);

    const { data } = await response.json();
    expect(data.createUser.name).toBe('New User');
    expect(data.createUser.email).toBe('newuser@example.com');
  });
});
