import nock from 'nock';
import { mapMockResponseToGraphQL, mockGitHubUserResponse } from '../github/mockData';

const GITHUB_API_URL = process.env.GITHUB_API_URL!;

export const mockGitHubApi = (
  endpoint: string,
  status: number,
  response: object = {}
) => {
  console.log(`Mocking: ${GITHUB_API_URL}${endpoint}`);
  nock(GITHUB_API_URL).get(endpoint).reply(status, response);
};

export const mockGraphQLRequest = (
  port: number,
  status: number = 200,
  response: object = mapMockResponseToGraphQL(mockGitHubUserResponse)
) => {
  const graphqlResponse = {
    data: {
      githubUser: response,
    },
  };

  nock(`http://localhost:${port}`)
    .post('/graphql')
    .reply(status, graphqlResponse);
};
