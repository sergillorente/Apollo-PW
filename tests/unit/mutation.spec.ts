import { resolvers } from '../../src/resolvers';

describe('Mutation Resolvers', () => {
  it('createUser resolver should create and return a new user', async () => {
    const mockPubSub = {
      publish: jest.fn(),
    };

    // Inject mockPubSub into the resolver
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

    const input = { name: 'John Doe', email: 'john.doe@example.com' };
    const newUser = await resolvers.Mutation.createUser(null, { input });

    // Assertions
    expect(newUser).toBeDefined();
    expect(newUser.name).toBe(input.name);
    expect(newUser.email).toBe(input.email);
    expect(newUser.role).toBe('USER');
    expect(newUser.isActive).toBe(true);

    // Verify publish was called
    expect(mockPubSub.publish).toHaveBeenCalledWith('USER_CREATED', {
      userCreated: newUser,
    });
  });
});
