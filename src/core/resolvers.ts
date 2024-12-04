import {
  fetchGitHubRepositories,
  fetchGitHubUser,
} from '../services/github/githubServices';

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
    githubUser: async (_: any, { username }: { username: string }) => {
      try {
        const user = await fetchGitHubUser(username);
        const repositories = await fetchGitHubRepositories(username);
        return {
          name: user.name || null,
          avatarUrl: user.avatar_url || null,
          bio: user.bio || null,
          repositories: repositories || [],
        };
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error fetching GitHub user data: ${error.message}`);
        } else {
          console.error('An unknown error occurred');
        }
        return {
          name: null,
          avatarUrl: null,
          bio: null,
          repositories: [],
        };
      }
    },
    githubRepositories: async (_: any, { username }: { username: string }) => {
      return await fetchGitHubRepositories(username);
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      { input }: { input: { name: string; email: string } }
    ) => {
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
    updateUser: async (
      _: any,
      { id, input }: { id: string; input: { name?: string; email?: string } }
    ) => {
      const updatedUser = {
        id,
        name: input.name || `Updated User ${id}`,
        email: input.email || `updated${id}@example.com`,
        role: 'USER',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
        isActive: true,
        posts: [],
        address: null,
      };

      if (id === '999') return null;

      return updatedUser;
    },
    deleteUser: async (_: any, { id }: { id: string }) => {
      const existingUserIds = ['1', '2', '3'];
      if (existingUserIds.includes(id)) {
        return true;
      }
      return false;
    },
  },
  User: {
    posts: (user: any) => [
      { id: '101', title: 'First Post', content: 'Hello World', author: user },
      {
        id: '102',
        title: 'Second Post',
        content: 'GraphQL is Awesome',
        author: user,
      },
    ],
    address: (user: any) => ({
      street: '123 Main St',
      city: 'Metropolis',
      country: 'USA',
    }),
  },
  Post: {
    author: (post: any) => post.author,
  },
};
