import { gql } from 'apollo-server';

export const typeDefs = gql`
  scalar DateTime

  type Query {
    user(id: ID!): User
    users(limit: Int, offset: Int): [User!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    createdAt: DateTime!
    updatedAt: DateTime!
    isActive: Boolean!
    posts: [Post!]!
    address: Address
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  type Address {
    street: String!
    city: String!
    country: String!
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  input UpdateUserInput {
    name: String
    email: String
  }

  enum Role {
    ADMIN
    USER
    GUEST
  }
`;
