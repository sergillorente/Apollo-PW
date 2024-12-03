export const mockGitHubUserResponse = {
  name: 'The Octocat',
  avatar_url: 'https://example.com/avatar.png',
  bio: 'GitHub mascot',
};

export const mapMockResponseToGraphQL = (response: any) => ({
  name: response.name,
  avatarUrl: response.avatar_url,
  bio: response.bio,
});
