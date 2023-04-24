import assert from 'assert';
import { convertArrayPropertyItems } from './convertArrayPropertyItems';

describe('convertArrayProperty', function () {
  context('no Avro items equivalent', function () {
    it('returns undefined when items is undefined', function () {
      const result = convertArrayPropertyItems(true, []);
      assert.strictEqual(result, undefined);
    });

    it('returns undefined when items is boolean', function () {
      const result = convertArrayPropertyItems(true, []);
      assert.strictEqual(result, undefined);
    });
  });
});
