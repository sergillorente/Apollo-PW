export const GET_USER_QUERY = `
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;

export const GITHUB_USER_QUERY = `
  query GitHubUser($username: String!) {
    githubUser(username: $username) {
      name
      avatarUrl
      bio
      repositories {
        name
        stars
      }
    }
  }
`;
