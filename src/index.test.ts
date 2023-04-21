import assert from 'assert';
import convert from './index';

describe('convert', function () {
  context('without a schema', function () {
    it('throws', function () {
      assert.throws(() => {
        convert();
      }, new Error('No schema given'));
    });
  });
});
