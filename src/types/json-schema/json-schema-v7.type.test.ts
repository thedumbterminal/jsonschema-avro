import assert from 'assert';
import { JSONSchema7Schema } from './json-schema-v7.type';

const sourceSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://example.com/json-schema-v7-test.json',
  description: 'JSON Schema v7 test description',
  type: 'object',
  properties: {
    arr1: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    arr2: {
      type: 'array',
      items: { $ref: '#/$defs/arr2' },
    },
  },
  $defs: {
    arr2: {
      type: 'object',
      required: ['propA', 'propB'],
      properties: {
        propA: {
          type: 'string',
          description: 'propA description',
        },
        propB: {
          type: 'boolean',
          description: 'propB description',
        },
      },
    },
  },
};

describe('JSON Schema V7', () => {
  it('parses a schema', () => {
    assert.doesNotThrow(() => JSONSchema7Schema.parse(sourceSchema));
  });

  it('throws invalid_type', () => {
    assert.throws(
      () => JSONSchema7Schema.parse({ id: 123 }),
      (err: any) => err?.name === 'ZodError' && err?.issues?.[0]?.code === 'invalid_type',
    );
  });

  it('throws invalid_union', () => {
    assert.throws(
      () => JSONSchema7Schema.parse({ if: 123 }),
      (err: any) => err?.name === 'ZodError' && err?.issues?.[0]?.code === 'invalid_union',
    );
  });
});


