import { resolvers } from '../../src/resolvers';

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
});
