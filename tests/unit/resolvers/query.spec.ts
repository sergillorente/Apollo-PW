import { resolvers } from '../../../src/api/core/resolvers';

describe('Query Resolvers', () => {
  describe('user resolver', () => {
    it('should return a user by ID', () => {
      const mockId = '1';
      const user = resolvers.Query.user(null, { id: mockId });

      expect(user).toBeDefined();
      expect(user).toEqual({
        id: mockId,
        name: `Mock User ${mockId}`,
        email: `user${mockId}@example.com`,
      });
    });

    it('should return a mock user for any ID, even non-existent ones', () => {
      const nonExistentId = '999';
      const user = resolvers.Query.user(null, { id: nonExistentId });

      expect(user).toBeDefined();
      expect(user).toEqual({
        id: nonExistentId,
        name: `Mock User ${nonExistentId}`,
        email: `user${nonExistentId}@example.com`,
      });
    });
  });

  describe('users resolver', () => {
    it('should return a list of users', () => {
      const users = resolvers.Query.users();

      expect(users).toBeInstanceOf(Array);
      expect(users).toHaveLength(3);
    });

    it('should contain valid user objects', () => {
      const users = resolvers.Query.users();

      users.forEach((user, index) => {
        expect(user).toMatchObject({
          id: `${index + 1}`,
          name: expect.any(String),
          email: expect.any(String),
        });
      });
    });
  });
});
