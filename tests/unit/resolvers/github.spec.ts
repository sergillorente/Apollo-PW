import { resolvers } from '../../../src/api/core/resolvers';
import {
  fetchGitHubRepositories,
  fetchGitHubUser,
} from '../../../src/api/services/github/githubServices';

jest.mock('../../../src/api/services/github/githubServices');

describe('GitHub Resolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('githubUser resolver', () => {
    it('should fetch and return GitHub user data', async () => {
      const mockUsername = 'octocat';
      const mockUserData = {
        name: 'The Octocat',
        avatar_url: 'https://example.com/avatar.png',
        bio: 'GitHub Mascot',
      };

      (fetchGitHubUser as jest.Mock).mockResolvedValue(mockUserData);
      (fetchGitHubRepositories as jest.Mock).mockResolvedValue([]);

      const result = await resolvers.Query.githubUser(null, {
        username: mockUsername,
      });

      expect(result).toEqual({
        name: mockUserData.name,
        avatarUrl: mockUserData.avatar_url,
        bio: mockUserData.bio,
        repositories: [],
      });

      expect(fetchGitHubUser).toHaveBeenCalledWith(mockUsername);
      expect(fetchGitHubRepositories).toHaveBeenCalledWith(mockUsername); // Optionally assert this
    });

    it('should handle errors gracefully', async () => {
      (fetchGitHubUser as jest.Mock).mockRejectedValue(new Error('API Error'));

      (fetchGitHubRepositories as jest.Mock).mockResolvedValue([]);

      const result = await resolvers.Query.githubUser(null, {
        username: 'invalid-user',
      });

      expect(result).toEqual({
        name: null,
        avatarUrl: null,
        bio: null,
        repositories: [],
      });
    });
  });

  describe('githubRepositories resolver', () => {
    it('should fetch and return repositories for a GitHub user', async () => {
      const mockUsername = 'octocat';
      const mockRepos = [{ name: 'Repo1', stars: 10 }];

      (fetchGitHubRepositories as jest.Mock).mockResolvedValue(mockRepos);

      const result = await resolvers.Query.githubRepositories(null, {
        username: mockUsername,
      });

      expect(result).toEqual(mockRepos);
      expect(fetchGitHubRepositories).toHaveBeenCalledWith(mockUsername);
    });
  });
});
