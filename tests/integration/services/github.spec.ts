import { test } from '../../e2e/fixtures/mock-server-fixture';
import { expect } from '@playwright/test';
import nock from 'nock';
import { GITHUB_USER_QUERY } from '../../../src/helpers/definitions';
import { mockGitHubApi } from '../../../src/services/utils/reusables';
import { executeGraphQL } from '../../../src/helpers/helpers';

test.describe('GraphQL Integration - real API', () => {
  test.beforeEach(() => {
    nock.cleanAll();
  });

  test.afterEach(() => {
    nock.cleanAll();
  });

  test('should fetch user details for a valid username via GraphQL', async ({
    request,
  }) => {
    const username = 'octocat';

    const variables = { username };
    const { status, data, errors } = await executeGraphQL(
      request,
      GITHUB_USER_QUERY,
      variables
    );

    expect(status).toBe(200);
    expect(errors).toBeUndefined();

    expect(data.githubUser).toMatchObject({
      name: 'The Octocat',
      avatarUrl: expect.stringMatching(
        /^https:\/\/avatars\.githubusercontent\.com/
      ),
      bio: null,
    });

    expect(data.githubUser.repositories).toBeDefined();
    expect(data.githubUser.repositories.length).toBeGreaterThan(0);
    data.githubUser.repositories.forEach((repo: any) => {
      expect(repo).toHaveProperty('name');
      expect(repo).toHaveProperty('stars');
    });
  });

  test('should return null-like response for an invalid username via GraphQL', async ({
    request,
  }) => {
    const username = 'unknown-user';

    const variables = { username };
    const { status, data } = await executeGraphQL(
      request,
      GITHUB_USER_QUERY,
      variables
    );

    expect(status).toBe(200);
    expect(data.githubUser).toMatchObject({
      name: null,
      avatarUrl: expect.any(String),
      bio: null,
      repositories: [],
    });
  });

  test('should return an error for missing username via GraphQL', async ({
    request,
  }) => {
    const variables = { username: null };

    const { status, errors } = await executeGraphQL(
      request,
      GITHUB_USER_QUERY,
      variables
    );

    expect(status).toBe(400);
    expect(errors).toBeDefined();
    expect(errors[0].message).toMatch(
      'Variable "$username" of non-null type "String!" must not be null.'
    );
  });

  test('should handle server errors gracefully via GraphQL', async ({
    request,
  }) => {
    const username = 'octocat';

    mockGitHubApi(`/users/${username}`, 500, {
      errors: [{ message: 'Internal server error' }],
    });

    const variables = { username };
    const { status, data } = await executeGraphQL(
      request,
      GITHUB_USER_QUERY,
      variables
    );

    expect(status).toBe(200);
    expect(data.githubUser).toMatchObject({
      name: 'The Octocat',
      avatarUrl: expect.any(String),
      bio: null,
      repositories: expect.any(Array),
    });
    expect(data.githubUser.repositories.length).toBeGreaterThan(0);
    data.githubUser.repositories.forEach((repo: any) => {
      expect(repo).toHaveProperty('name');
      expect(repo).toHaveProperty('stars');
    });
  });
});
