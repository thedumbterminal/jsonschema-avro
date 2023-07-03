import assert from 'assert'
import { JSONSchema4Schema } from './json-schema-v4.type'

const sourceSchema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  $id: 'https://example.com/json-schema-v4-test.json',
  title: 'JSON Schema v4 test title',
  description: 'JSON Schema v4 test description',
  type: 'object',
  properties: {
    a: {
      description: 'description a',
      type: 'number',
    },
    b: {
      description: 'description b',
      type: 'string',
    },
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
          items: {
            description: 'arr2 items description',
            type: 'string',
          },
        },
      },
    },
  },
  propertyNames: 123,
}

describe('JSON Schema V4', () => {
  it('parses a schema', () => {
    assert.doesNotThrow(() => JSONSchema4Schema.parse(sourceSchema))
  })

  it('throws invalid_type', () => {
    assert.throws(
      () => JSONSchema4Schema.parse({ id: 123 }),
      (err: any) =>
        err?.name === 'ZodError' && err?.issues?.[0]?.code === 'invalid_type'
    )
  })

  it('throws an invalid_union', () => {
    assert.throws(
      () => JSONSchema4Schema.parse({ items: true }),
      (err: any) =>
        err?.name === 'ZodError' && err?.issues?.[0]?.code === 'invalid_union'
    )
  })
})
