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
  })

  describe('_idToNameSpace()', () => {
    context('without an ID', () => {
      it('returns nothing', () => {
        const result = jsonSchemaAvro._idToNameSpace({})
        assert.strictEqual(result, undefined)
      })
    })

    context('when a path is not found', () => {
      it('returns the hostname', () => {
        const result = jsonSchemaAvro._idToNameSpace({ $id: 'aaa://HOST' })
        assert.strictEqual(result, 'HOST')
      })
    })
  })

  describe('_idToName()', () => {
    context('without an ID', () => {
      it('returns the fallback', () => {
        const result = jsonSchemaAvro._idToName({}, 'FALLBACK')
        assert.strictEqual(result, 'FALLBACK')
      })
    })

    context('when a path is not found', () => {
      it('returns the fallback', () => {
        const result = jsonSchemaAvro._idToName({ $id: 'aaa://aa' }, 'FALLBACK')
        assert.strictEqual(result, 'FALLBACK')
      })
    })
  })

  describe('_convertArrayProperty()', () => {
    context('with a default', () => {})
  })
})
