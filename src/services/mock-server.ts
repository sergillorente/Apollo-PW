import * as dotenv from 'dotenv';
dotenv.config();

import { validateEnv } from '../config/validateEnv';
import { ApolloServer } from 'apollo-server';
import { typeDefs } from '../core/schema';
import { resolvers } from '../core/resolvers';

validateEnv();

const DEFAULT_PORT = Number(process.env.PORT) || 4000;

export const startMockServer = async (
  port: number = DEFAULT_PORT
): Promise<ApolloServer> => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.listen({ port });
  console.log(`🚀 Mock GraphQL server ready at http://localhost:${port}`);
  return server;
};
if (require.main === module) {
  let serverInstance: ApolloServer | null = null;

  startMockServer()
    .then((server) => {
      serverInstance = server;
      console.log('Press Ctrl+C to stop the server');
      process.stdin.resume();
    })
    .catch((err) => {
      console.error('Failed to start mock server:', err);
      process.exit(1);
    });

  const shutdown = async () => {
    if (serverInstance) {
      console.log('Shutting down server...');
      await serverInstance.stop();
    }
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
