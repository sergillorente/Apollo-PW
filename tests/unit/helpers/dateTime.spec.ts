import { DateTimeResolver } from 'graphql-scalars';
import { Kind, StringValueNode } from 'graphql';

describe('DateTime Scalar', () => {
  it('should serialize valid date strings correctly', () => {
    const validDate = '2023-01-01T00:00:00Z';
    const normalizedDate = '2023-01-01T00:00:00.000Z';
    expect(DateTimeResolver.serialize(validDate).toISOString()).toBe(
      normalizedDate
    );
  });

  it('should throw an error for invalid date strings', () => {
    const invalidDate = 'invalid-date';
    expect(() => DateTimeResolver.serialize(invalidDate)).toThrow();
  });

  it('should parse valid date literals correctly', () => {
    const literal: StringValueNode = {
      kind: Kind.STRING,
      value: '2023-01-01T00:00:00Z',
    };
    const normalizedDate = '2023-01-01T00:00:00.000Z';
    expect(DateTimeResolver.parseLiteral(literal).toISOString()).toBe(
      normalizedDate
    );
  });

  it('should throw an error for invalid date literals', () => {
    const literal: StringValueNode = {
      kind: Kind.STRING,
      value: 'invalid-date',
    };
    expect(() => DateTimeResolver.parseLiteral(literal)).toThrow();
  });
});
