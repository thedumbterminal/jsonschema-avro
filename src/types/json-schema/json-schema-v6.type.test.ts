import assert from 'assert';
import { JSONSchema6Schema } from './json-schema-v6.type';

const sourceSchema = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  $id: 'https://example.com/json-schema-v6-test.json',
  title: 'JSON Schema v6 test title',
  description: 'JSON Schema v6 test description',
  type: 'object',
  propertyNames: {
    anyOf: [
      { $ref: '#/definitions/fooNames' },
      { $ref: '#/definitions/barNames' },
    ],
  },
  properties: {
    a: {
      description: 'description a',
      type: 'number',
    },
    b: true,
    nested: {
      description: 'nested property description',
      type: 'object',
      properties: {
        arr1: {
          type: 'array',
          items: {
            description: 'arr1 items description',
            type: 'string',
          },
        },
        arr2: {
          type: 'array',
          items: true,
        },
      },
    },
  },
};

describe('JSON Schema V6', () => {
  it('parses a schema', () => {
    assert.doesNotThrow(() => JSONSchema6Schema.parse(sourceSchema));
  });

  it('throws invalid_type', () => {
    assert.throws(
      () => JSONSchema6Schema.parse({ id: 123 }),
      (err: any) => err?.name === 'ZodError' && err?.issues?.[0]?.code === 'invalid_type',
    );
  });

  it('throws invalid_union', () => {
    assert.throws(
      () => JSONSchema6Schema.parse({ propertyNames: 123 }),
      (err: any) => err?.name === 'ZodError' && err?.issues?.[0]?.code === 'invalid_union',
    );
  });
});


