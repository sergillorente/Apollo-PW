export const resolvers = {
    Query: {
      user: (_: any, { id }: { id: string }) => ({
        id,
        name: `Mock User ${id}`,
        email: `user${id}@example.com`,
      }),
      users: () => [
        { id: '1', name: 'User One', email: 'user1@example.com' },
        { id: '2', name: 'User Two', email: 'user2@example.com' },
        { id: '3', name: 'User Three', email: 'user3@example.com' },
      ],
    },
    Mutation: {
      createUser: async (_: any, { input }: { input: { name: string; email: string } }) => {
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
        return newUser;
      },
    },
  };
  