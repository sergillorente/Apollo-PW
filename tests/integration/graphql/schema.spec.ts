import { test, expect } from '@playwright/test';
import { typeDefs } from '../../../src/core/schema';
import {
  buildASTSchema,
  GraphQLSchema,
  isObjectType,
  isEnumType,
} from 'graphql';

test.describe('GraphQL Schema', () => {
  let schema: GraphQLSchema;

  test.beforeAll(() => {
    schema = buildASTSchema(typeDefs);
  });

  test('should define the schema correctly', () => {
    expect(schema).toBeDefined();
  });

  test('should define the User type correctly', () => {
    const userType = schema.getType('User');
    expect(userType).toBeDefined();

    if (isObjectType(userType)) {
      expect(userType.astNode?.kind).toBe('ObjectTypeDefinition');
      const fields = userType.getFields();

      expect(fields.name.type.toString()).toBe('String!');
      expect(fields.email.type.toString()).toBe('String!');
      expect(fields.role.type.toString()).toBe('Role!');
      expect(fields.posts.type.toString()).toBe('[Post!]!');
    } else {
      throw new Error('User is not an object type');
    }
  });

  test('should define the Role enum correctly', () => {
    const roleEnum = schema.getType('Role');
    expect(roleEnum).toBeDefined();

    if (isEnumType(roleEnum)) {
      const values = roleEnum.getValues().map((v) => v.name);

      expect(values).toEqual(['ADMIN', 'USER', 'GUEST']);
    } else {
      throw new Error('Role is not an enum type');
    }
  });

  test('should validate GitHubUser type', () => {
    const gitHubUserType = schema.getType('GitHubUser');
    expect(gitHubUserType).toBeDefined();

    if (isObjectType(gitHubUserType)) {
      const fields = gitHubUserType.getFields();

      expect(fields.name.type.toString()).toBe('String');
      expect(fields.avatarUrl.type.toString()).toBe('String');
      expect(fields.bio.type.toString()).toBe('String');
      expect(fields.repositories.type.toString()).toBe('[Repository!]!');
    } else {
      throw new Error('GitHubUser is not an object type');
    }
  });
});
