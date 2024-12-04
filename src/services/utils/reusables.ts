import nock from 'nock';

const GITHUB_API_URL = process.env.GITHUB_API_URL!;

export const mockGitHubApi = (
  endpoint: string,
  status: number,
  response: object = {}
) => {
  nock(GITHUB_API_URL).get(endpoint).reply(status, response);
};
