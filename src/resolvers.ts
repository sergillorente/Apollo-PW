export const resolvers = {
  Query: {
    user: (_: any, { id }: { id: string }) => ({
      id,
      name: `Mock User ${id}`,
      email: `user${id}@example.com`,
    }),
  },
};
