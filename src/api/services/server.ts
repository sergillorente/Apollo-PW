import * as dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import express from 'express';
import { validateEnv } from '../config/validateEnv';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from '../core/schema';
import { resolvers } from '../core/resolvers';

validateEnv();

const DEFAULT_PORT = Number(process.env.PORT) || 4000;

export const startMockServer = async (port: number): Promise<ApolloServer> => {
  const app = express();

  const uiPath = path.resolve(__dirname, '../../../dist');
  console.log('Serving UI from:', uiPath);
  app.use(express.static(uiPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(uiPath, 'index.html'));
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(port, () => {
    console.log(`🚀 GraphQL server ready at http://localhost:${port}/graphql`);
    console.log(`🎨 UI available at http://localhost:${port}`);
  });

  return server;
};

if (require.main === module) {
  let serverInstance: null | (() => Promise<void>) = null;

  startMockServer(DEFAULT_PORT)
    .then(() => {
      serverInstance = async () => {
        console.log('Shutting down server...');
        process.exit(0);
      };
      console.log('Press Ctrl+C to stop the server');
      process.stdin.resume();
    })
    .catch((err) => {
      console.error('Failed to start mock server:', err);
      process.exit(1);
    });

  const shutdown = async () => {
    if (serverInstance) {
      await serverInstance();
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
