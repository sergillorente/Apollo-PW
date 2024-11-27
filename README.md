# Apollo-PW

A modern **GraphQL API testing** and **mocking framework** using [Apollo Server](https://www.apollographql.com/docs/apollo-server/) and [Playwright](https://playwright.dev/). This repository provides a foundation for testing GraphQL APIs, generating mock data, and running integration tests efficiently.

---

## Features

- **Apollo Server**: Easily mock and serve a GraphQL API locally.
- **Playwright Testing**: Comprehensive integration tests for GraphQL endpoints.
- **TypeScript Support**: Type-safe development with robust tooling.
- **Linting and Formatting**: Ensures clean and consistent code using ESLint and Prettier.
- **GraphQL Code Generation**: Automates the creation of TypeScript types for GraphQL schemas and operations.
- **Ready-to-Use CI/CD**: Simple integration with GitHub Actions or other CI/CD platforms.

---

## Getting Started

### Install dependencies
- ```npm install```

### Usage
**Start the Mock Server**
- ```npm run start:mock-server```
The server will start at http://localhost:4000.

**Run Tests**
- ```npm test```

**Lint the Code**
- ```npm run lint```

**Format the Code**
- ```npm run format```

**Generate GraphQL Types**
- ```npm run generate```