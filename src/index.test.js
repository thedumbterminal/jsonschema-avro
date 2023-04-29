const jsonSchemaAvro = require('./index')
const assert = require('assert')

describe('index', () => {
  describe('convert()', () => {
    context('without a schema', () => {
      it('throws', () => {
        assert.throws(() => {
          jsonSchemaAvro.convert()
        }, new Error('No schema given'))
      })
    })

    context('invalid type', () => {
      it('throws', () => {
        assert.throws(() => {
          jsonSchemaAvro.convert({
            type: 'object',
            properties: { test: { type: 'invalid' } },
          })
        }, new Error('Invalid JSON schema type "invalid" for "test"'))
      })
    })

    context('invalid type in union', () => {
      it('throws', () => {
        assert.throws(() => {
          jsonSchemaAvro.convert({
            type: 'object',
            properties: { test: { type: ['null', 'invalid'] } },
          })
        }, new Error('Invalid JSON schema type "invalid" for "test"'))
      })
    })
  })
})
