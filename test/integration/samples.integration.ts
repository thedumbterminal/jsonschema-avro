import { schema as avsc } from 'avsc';
import assert from 'assert';
import * as fs from 'fs';
import convert from '../../src';
import {join} from 'path';

const sampleDir = join(__dirname, 'samples');

describe('samples', () => {
  describe('convert()', () => {
    // eslint-disable-next-line mocha/no-setup-in-describe
    const testDirs = fs.readdirSync(sampleDir);

    // eslint-disable-next-line mocha/no-setup-in-describe
    testDirs.forEach((dir) => {
      describe(dir, () => {
        let expected: string;
        let result: avsc.RecordType;

        before(() => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const inJson = require(join(sampleDir, `${dir}/input.json`));
          expected = require(join(sampleDir, `${dir}/expected.json`));
          result = convert(inJson);
        });

        it('converts to avro', function () {
          if (process.env.ONLY && dir !== process.env.ONLY) {
            this.skip();
          }
          assert.deepEqual(result, expected);
        });
      });
    });
  });
});
