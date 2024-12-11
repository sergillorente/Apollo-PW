export interface GitHubUser {
  name: string;
  avatar_url: string;
  bio: string;
}

export interface GitHubRepository {
  name: string;
  description: string;
  stars: number;
}
