/* eslint-disable @typescript-eslint/no-explicit-any */

import assert from 'assert'
import * as idUtils from './idUtils'

describe('idUtils', () => {
  describe('idToNameSpace()', () => {
    context('without an ID', () => {
      it('returns nothing', () => {
        const result = idUtils.idToNameSpace({})
        assert.strictEqual(result, undefined)
      })
    })

    context('when a path is not found', () => {
      it('returns the hostname', () => {
        const result = idUtils.idToNameSpace(<any>{ $id: 'aaa://HOST' })
        assert.strictEqual(result, 'HOST')
      })
    })
  })

  describe('idToName()', () => {
    context('without an ID', () => {
      it('returns the fallback', () => {
        const result = idUtils.idToName({}, 'FALLBACK')
        assert.strictEqual(result, 'FALLBACK')
      })
    })

    context('when a path is not found', () => {
      it('returns the fallback', () => {
        const result = idUtils.idToName(<any>{ $id: 'aaa://aa' }, 'FALLBACK')
        assert.strictEqual(result, 'FALLBACK')
      })
    })
  })
})
