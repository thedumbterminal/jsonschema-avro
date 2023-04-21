import assert from 'assert';
import { idToNameSpace } from './idToNamespace';

describe('idToNameSpace', function () {
  context('without an ID', function () {
    it('returns nothing', function () {
      const result = idToNameSpace({});
      assert.strictEqual(result, undefined);
    });
  });

  context('when a path is not found', function () {
    it('returns the hostname', function () {
      const result = idToNameSpace({ $id: 'aaa://HOST' });
      assert.strictEqual(result, 'HOST');
    });
  });
});
