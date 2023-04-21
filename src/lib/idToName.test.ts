import assert from 'assert';
import { idToName } from './idToName';

describe('idToName', function () {
  context('without an ID', function () {
    it('returns the fallback', function () {
      const result = idToName({}, 'FALLBACK');
      assert.strictEqual(result, 'FALLBACK');
    });
  });

  context('when a path is not found', function () {
    it('returns the fallback', function () {
      const result = idToName({ $id: 'aaa://aa' }, 'FALLBACK');
      assert.strictEqual(result, 'FALLBACK');
    });
  });
});
