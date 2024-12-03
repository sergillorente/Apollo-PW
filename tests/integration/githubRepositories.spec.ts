import { test } from '../e2e/fixtures/mock-server-fixture';
import { expect } from '@playwright/test';
import { fetchGitHubRepositories } from '../../src/services/github/githubServices';
import nock from 'nock';
import { mockGitHubApi } from '../../src/services/utils/reusables';

const mockRepositoriesResponse = [
  {
    name: 'Repo1',
    description: 'First repository',
    stargazers_count: 100,
  },
  {
    name: 'Repo2',
    description: 'Second repository',
    stargazers_count: 50,
  },
];

test.describe('GitHub Service - fetchGitHubRepositories', () => {
  test.beforeEach(() => {
    nock.cleanAll();
  });

  test.afterEach(() => {
    nock.cleanAll();
  });

  test('should fetch repositories for a valid username', async () => {
    const username = 'octocat';

    mockGitHubApi(`/users/${username}/repos`, 200, mockRepositoriesResponse);

    const repositories = await fetchGitHubRepositories(username);

    expect(repositories).toHaveLength(mockRepositoriesResponse.length);
    repositories.forEach((repo, index) => {
      expect(repo).toEqual({
        name: mockRepositoriesResponse[index].name,
        description: mockRepositoriesResponse[index].description,
        stars: mockRepositoriesResponse[index].stargazers_count,
      });
    });
  });

  test('should handle unauthorized errors', async () => {
    const username = 'octocat';

    mockGitHubApi(`/users/${username}/repos`, 401);

    await expect(fetchGitHubRepositories(username)).rejects.toThrow(
      'Unauthorized: Invalid GitHub token or missing permissions.'
    );
  });

  test('should handle rate limit errors', async () => {
    const username = 'octocat';

    mockGitHubApi(`/users/${username}/repos`, 403);

    await expect(fetchGitHubRepositories(username)).rejects.toThrow(
      `Rate limit exceeded. URL: /users/${username}/repos. Please try again later.`
    );
  });

  test('should return an empty array for users with no repositories', async () => {
    const username = 'new-user';

    mockGitHubApi(`/users/${username}/repos`, 200, []);

    const repositories = await fetchGitHubRepositories(username);

    expect(repositories).toEqual([]);
  });

  test('should handle network errors', async () => {
    const username = 'octocat';

    nock(process.env.GITHUB_API_URL!)
      .get(`/users/${username}/repos`)
      .replyWithError('Network error');

    await expect(fetchGitHubRepositories(username)).rejects.toThrow(
      'GitHub API error: Network error'
    );
  });
});
