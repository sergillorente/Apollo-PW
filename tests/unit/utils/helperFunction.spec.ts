import {
  GET_USER_QUERY,
  GITHUB_USER_QUERY,
} from '../../../src/api/helpers/definitions';
import { executeGraphQL } from '../../../src/api/helpers/helpers';
import nock from 'nock';
import axios from 'axios';

describe('Helper Functions', () => {
  describe('executeGraphQL', () => {
    const mockRequest = { post: jest.fn() };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should execute a GraphQL query and return the response', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnValue(200),
        json: jest.fn().mockResolvedValue({
          data: {
            user: { id: '1', name: 'Mock User', email: 'mock@example.com' },
          },
          errors: null,
        }),
      };

      mockRequest.post.mockResolvedValue(mockResponse);

      const query = `query GetUser($id: ID!) { user(id: $id) { id name email } }`;
      const variables = { id: '1' };

      const result = await executeGraphQL(mockRequest, query, variables);

      expect(mockRequest.post).toHaveBeenCalledWith(
        `http://localhost:${process.env.PORT}/graphql`,
        { data: { query, variables } }
      );
      expect(result).toEqual({
        status: 200,
        data: {
          user: { id: '1', name: 'Mock User', email: 'mock@example.com' },
        },
        errors: null,
      });
    });

    it('should handle errors when the GraphQL request fails', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnValue(500),
        json: jest.fn().mockResolvedValue({
          data: null,
          errors: [{ message: 'Internal Server Error' }],
        }),
      };

      mockRequest.post.mockResolvedValue(mockResponse);

      const query = `query GetUser($id: ID!) { user(id: $id) { id name email } }`;
      const variables = { id: 'invalid' };

      const result = await executeGraphQL(mockRequest, query, variables);

      expect(mockRequest.post).toHaveBeenCalledWith(
        `http://localhost:${process.env.PORT}/graphql`,
        { data: { query, variables } }
      );
      expect(result).toEqual({
        status: 500,
        data: null,
        errors: [{ message: 'Internal Server Error' }],
      });
    });
  });

  describe('mockGitHubApi', () => {
    const GITHUB_API_URL = 'https://api.github.com';
    beforeEach(() => {
      process.env.GITHUB_API_URL = GITHUB_API_URL;
      nock.cleanAll();
    });
    afterAll(() => {
      delete process.env.GITHUB_API_URL;
    });

    it('should mock a GET request and return the expected response', async () => {
      const endpoint = '/users/octocat';
      const mockResponse = { name: 'The Octocat', bio: 'GitHub mascot' };

      nock(GITHUB_API_URL).get(endpoint).reply(200, mockResponse);

      const response = await axios.get(`${GITHUB_API_URL}${endpoint}`);

      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(mockResponse);

      expect(nock.isDone()).toBe(true);
    });

    it('should throw an error if the request does not match the mock', async () => {
      const endpoint = '/users/octocat';
      const mockResponse = { name: 'The Octocat', bio: 'GitHub mascot' };

      nock(GITHUB_API_URL).get(endpoint).reply(200, mockResponse);

      await expect(
        axios.get(`${GITHUB_API_URL}/users/unknown-user`)
      ).rejects.toThrow();

      expect(nock.isDone()).toBe(false);
    });
  });

  describe('GraphQL Query Definitions', () => {
    it('should define GET_USER_QUERY correctly', () => {
      expect(GET_USER_QUERY).toContain('query GetUser($id: ID!)');
      expect(GET_USER_QUERY).toContain('user(id: $id)');
      expect(GET_USER_QUERY).toContain('id');
      expect(GET_USER_QUERY).toContain('name');
      expect(GET_USER_QUERY).toContain('email');
    });

    it('should define GITHUB_USER_QUERY correctly', () => {
      expect(GITHUB_USER_QUERY).toContain(
        'query GitHubUser($username: String!)'
      );
      expect(GITHUB_USER_QUERY).toContain('githubUser(username: $username)');
      expect(GITHUB_USER_QUERY).toContain('name');
      expect(GITHUB_USER_QUERY).toContain('avatarUrl');
      expect(GITHUB_USER_QUERY).toContain('bio');
      expect(GITHUB_USER_QUERY).toContain('repositories');
    });
  });
});
