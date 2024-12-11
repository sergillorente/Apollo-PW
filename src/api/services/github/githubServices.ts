import axios from 'axios';
import { GitHubRepository, GitHubUser } from './interfaces';
import { makeRequest } from './handleErrors';

export const githubApi = axios.create({
  baseURL: process.env.GITHUB_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN!}`,
  },
});

export const fetchGitHubUser = async (
  username: string
): Promise<GitHubUser> => {
  return await makeRequest<GitHubUser>(`/users/${username}`);
};

export const fetchGitHubRepositories = async (
  username: string
): Promise<GitHubRepository[]> => {
  const repos = await makeRequest<any[]>(`/users/${username}/repos`);
  return repos.map((repo) => ({
    name: repo.name,
    description: repo.description,
    stars: repo.stargazers_count,
  }));
};
