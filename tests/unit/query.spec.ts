import { resolvers } from '../../src/resolvers';

describe('Query Resolvers', () => {
  test('user resolver should return a user by ID', async () => {
    const user = resolvers.Query.user(null, { id: '1' });
    expect(user).toBeDefined();
    expect(user.id).toBe('1');
    expect(user.name).toBe('Mock User 1');
  });

  test('users resolver should return a list of users', async () => {
    const users = resolvers.Query.users();
    expect(users).toBeInstanceOf(Array);
    expect(users.length).toBeGreaterThan(0);
  });
});
