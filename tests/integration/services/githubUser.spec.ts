import { test } from '../../e2e/fixtures/mock-server-fixture';
import { expect } from '@playwright/test';
import { fetchGitHubUser } from '../../../src/services/github/githubServices';
import nock from 'nock';
import { mockGitHubApi } from '../../../src/services/utils/reusables';
import { mockGitHubUserResponse } from '../../../src/services/github/mockData';

test.describe('GitHub Service - fetchGitHubUser', () => {
  test.beforeEach(() => {
    nock.cleanAll();
  });

  test.afterEach(() => {
    nock.cleanAll();
  });

  test('should fetch user details for a valid username', async () => {
    const username = 'octocat';
    const expectedUser = mockGitHubUserResponse[0];

    mockGitHubApi(`/users/${username}`, 200, expectedUser);

    const user = await fetchGitHubUser(username);

    expect(user).toEqual({
      name: expectedUser.name,
      avatar_url: expectedUser.avatar_url,
      bio: expectedUser.bio,
    });
  });

  test('should handle unauthorized errors', async () => {
    const username = 'octocat';

    mockGitHubApi(`/users/${username}`, 401);

    await expect(fetchGitHubUser(username)).rejects.toThrow(
      'Unauthorized: Invalid GitHub token or missing permissions.'
    );
  });

  test('should handle rate limit errors', async () => {
    const username = 'octocat';

    mockGitHubApi(`/users/${username}`, 403);

    await expect(fetchGitHubUser(username)).rejects.toThrow(
      `Rate limit exceeded. URL: /users/${username}. Please try again later.`
    );
  });

  test('should handle not found errors for invalid usernames', async () => {
    const username = 'unknown-user';

    mockGitHubApi(`/users/${username}`, 404);

    await expect(fetchGitHubUser(username)).rejects.toThrow(
      `GitHub API error: Request failed with status code 404. URL: /users/${username}. Status: 404`
    );
  });

  test('should handle network errors', async () => {
    const username = 'octocat';

    nock(process.env.GITHUB_API_URL!)
      .get(`/users/${username}`)
      .replyWithError('Network error');

    await expect(fetchGitHubUser(username)).rejects.toThrow(
      'GitHub API error: Network error'
    );
  });
});
