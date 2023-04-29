const idUtils = require('./idUtils')
const assert = require('assert')

describe('idUtils', () => {
  describe('toNameSpace()', () => {
    context('without an ID', () => {
      it('returns nothing', () => {
        const result = idUtils.toNameSpace({})
        assert.strictEqual(result, undefined)
      })
    })

    context('when a path is not found', () => {
      it('returns the hostname', () => {
        const result = idUtils.toNameSpace({ $id: 'aaa://HOST' })
        assert.strictEqual(result, 'HOST')
      })
    })
  })

  describe('toName()', () => {
    context('without an ID', () => {
      it('returns the fallback', () => {
        const result = idUtils.toName({}, 'FALLBACK')
        assert.strictEqual(result, 'FALLBACK')
      })
    })

    context('when a path is not found', () => {
      it('returns the fallback', () => {
        const result = idUtils.toName({ $id: 'aaa://aa' }, 'FALLBACK')
        assert.strictEqual(result, 'FALLBACK')
      })
    })
  })
})
