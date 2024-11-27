import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

export const startMockServer = async (
  port: number = 4000
): Promise<ApolloServer> => {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.listen({ port });
  console.log(`🚀 Mock GraphQL server ready at http://localhost:${port}`);
  return server;
};

if (require.main === module) {
  startMockServer(4000)
    .then(() => {
      console.log('Press Ctrl+C to stop the server');
      process.stdin.resume(); // Prevent Node.js process from exiting
    })
    .catch((err) => {
      console.error('Failed to start mock server:', err);
      process.exit(1);
    });
}
