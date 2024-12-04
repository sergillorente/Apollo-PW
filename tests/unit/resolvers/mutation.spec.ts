import { resolvers } from '../../../src/core/resolvers';

describe('Mutation Resolvers', () => {
  describe('createUser resolver', () => {
    const mockPubSub = {
      publish: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create and return a new user', async () => {
      const input = { name: 'John Doe', email: 'john.doe@example.com' };

      resolvers.Mutation.createUser = async (_: any, { input }: any) => {
        const newUser = {
          id: `${Math.floor(Math.random() * 1000)}`,
          name: input.name,
          email: input.email,
          role: 'USER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
          posts: [],
          address: null,
        };
        await mockPubSub.publish('USER_CREATED', { userCreated: newUser });
        return newUser;
      };

      const newUser = await resolvers.Mutation.createUser(null, { input });

      expect(newUser).toBeDefined();
      expect(newUser).toEqual({
        id: expect.any(String),
        name: input.name,
        email: input.email,
        role: 'USER',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        isActive: true,
        posts: [],
        address: null,
      });

      expect(mockPubSub.publish).toHaveBeenCalledWith('USER_CREATED', {
        userCreated: newUser,
      });
    });

    it('should call publish exactly once', async () => {
      const input = { name: 'Jane Doe', email: 'jane.doe@example.com' };

      const mockResolver = async (_: any, { input }: any) => {
        const newUser = {
          id: `${Math.floor(Math.random() * 1000)}`,
          name: input.name,
          email: input.email,
          role: 'USER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
          posts: [],
          address: null,
        };
        await mockPubSub.publish('USER_CREATED', { userCreated: newUser });
        return newUser;
      };

      resolvers.Mutation.createUser = mockResolver;

      await resolvers.Mutation.createUser(null, { input });

      expect(mockPubSub.publish).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateUser resolver', () => {
    it('should update and return a user', async () => {
      const mockId = '1';
      const mockInput = {
        name: 'Updated Name',
        email: 'updated.email@example.com',
      };
      const mockUpdatedUser = {
        id: mockId,
        name: mockInput.name,
        email: mockInput.email,
        role: 'USER',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: expect.any(String),
        isActive: true,
        posts: [],
        address: null,
      };

      resolvers.Mutation.updateUser = jest
        .fn()
        .mockResolvedValue(mockUpdatedUser);

      const updatedUser = await resolvers.Mutation.updateUser(null, {
        id: mockId,
        input: mockInput,
      });

      expect(updatedUser).toEqual(mockUpdatedUser);
      expect(resolvers.Mutation.updateUser).toHaveBeenCalledWith(null, {
        id: mockId,
        input: mockInput,
      });
    });

    it('should handle invalid user ID', async () => {
      const invalidId = '999';
      resolvers.Mutation.updateUser = jest.fn().mockResolvedValue(null);

      const result = await resolvers.Mutation.updateUser(null, {
        id: invalidId,
        input: {},
      });

      expect(result).toBeNull();
      expect(resolvers.Mutation.updateUser).toHaveBeenCalledWith(null, {
        id: invalidId,
        input: {},
      });
    });

    it('should throw an error if the update fails unexpectedly', async () => {
      const mockId = '1';
      const mockInput = { name: 'Name' };

      resolvers.Mutation.updateUser = jest
        .fn()
        .mockRejectedValue(new Error('Database connection failed'));

      await expect(
        resolvers.Mutation.updateUser(null, { id: mockId, input: mockInput })
      ).rejects.toThrow('Database connection failed');
    });
  });

  describe('deleteUser resolver', () => {
    it('should delete a user by ID', async () => {
      const mockId = '1';

      resolvers.Mutation.deleteUser = jest.fn().mockResolvedValue(true);

      const result = await resolvers.Mutation.deleteUser(null, { id: mockId });

      expect(result).toBe(true);
      expect(resolvers.Mutation.deleteUser).toHaveBeenCalledWith(null, {
        id: mockId,
      });
    });

    it('should return false for non-existent user ID', async () => {
      const invalidId = '999';

      resolvers.Mutation.deleteUser = jest.fn().mockResolvedValue(false);

      const result = await resolvers.Mutation.deleteUser(null, {
        id: invalidId,
      });

      expect(result).toBe(false);
      expect(resolvers.Mutation.deleteUser).toHaveBeenCalledWith(null, {
        id: invalidId,
      });
    });

    it('should throw an error if deletion fails unexpectedly', async () => {
      const mockId = '1';

      resolvers.Mutation.deleteUser = jest
        .fn()
        .mockRejectedValue(new Error('Internal server error'));

      await expect(
        resolvers.Mutation.deleteUser(null, { id: mockId })
      ).rejects.toThrow('Internal server error');
    });
  });
});
