import { PubSub } from 'graphql-subscriptions';

type Events = {
  USER_CREATED: { userCreated: { id: string; name: string; email: string } };
};

const pubSub = new PubSub<Events>();
const USER_CREATED = 'USER_CREATED';

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
      await pubSub.publish(USER_CREATED, { userCreated: newUser });
      return newUser;
    },
  },
};
