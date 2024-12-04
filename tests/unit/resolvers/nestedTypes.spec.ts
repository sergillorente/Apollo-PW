import { resolvers } from '../../../src/core/resolvers';

describe('Nested Types Resolvers', () => {
  describe('User.posts resolver', () => {
    it('should return posts for a user', async () => {
      const mockUser = {
        id: '1',
        name: 'User One',
        email: 'user1@example.com',
      };
      const mockPosts = [
        { id: '101', title: 'Post 1', content: 'Content 1', author: mockUser },
        { id: '102', title: 'Post 2', content: 'Content 2', author: mockUser },
      ];

      resolvers.User = {
        posts: () => mockPosts,
        address: () => ({
          street: '123 Main St',
          city: 'Metropolis',
          country: 'USA',
        }),
      };

      const result = resolvers.User.posts(mockUser);

      expect(result).toEqual(mockPosts);
      expect(result).toHaveLength(2);
    });
  });

  describe('User.address resolver', () => {
    it('should return the address for a user', () => {
      const mockUser = {
        id: '1',
        name: 'User One',
        email: 'user1@example.com',
      };

      resolvers.User = {
        posts: () => [],
        address: () => ({
          street: '123 Main St',
          city: 'Metropolis',
          country: 'USA',
        }),
      };

      const result = resolvers.User.address(mockUser);

      expect(result).toEqual({
        street: '123 Main St',
        city: 'Metropolis',
        country: 'USA',
      });
    });
  });

  describe('Post.author resolver', () => {
    it('should return the author of a post', () => {
      const mockAuthor = {
        id: '1',
        name: 'User One',
        email: 'user1@example.com',
      };
      const mockPost = {
        id: '101',
        title: 'Post 1',
        content: 'Content 1',
        author: mockAuthor,
      };

      resolvers.Post = {
        author: (post: any) => post.author,
      };

      const result = resolvers.Post.author(mockPost);

      expect(result).toEqual(mockAuthor);
    });
  });
});
