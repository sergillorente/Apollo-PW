export async function executeGraphQL(
  request: any,
  query: string,
  variables: any
) {
  const response = await request.post(
    `http://localhost:${process.env.PORT}/graphql`,
    {
      data: { query, variables },
    }
  );

  const json = await response.json();
  return { status: response.status(), data: json.data, errors: json.errors };
}
