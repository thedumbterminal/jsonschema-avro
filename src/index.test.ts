import assert from 'assert'
import convert from './index'

describe('index', () => {
  describe('convert()', () => {
    context('without a schema', () => {
      it('throws', () => {
        assert.throws(() => {
          convert()
        }, new Error('No schema given'))
      })
    })
  })
})
