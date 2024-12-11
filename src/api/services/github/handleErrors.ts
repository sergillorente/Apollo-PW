import { githubApi } from './githubServices';

export const makeRequest = async <T>(url: string): Promise<T> => {
  try {
    const response = await githubApi.get<T>(url);
    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    if (status === 401) {
      throw new Error(
        `Unauthorized: Invalid GitHub token or missing permissions. URL: ${url}`
      );
    }
    if (status === 403) {
      throw new Error(
        `Rate limit exceeded. URL: ${url}. Please try again later.`
      );
    }
    throw new Error(
      `GitHub API error: ${error.message}. URL: ${url}. Status: ${status}`
    );
  }
};
