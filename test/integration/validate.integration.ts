import * as avro from 'avsc';
import assert from 'assert';
import * as fs from 'fs';
import {join} from 'path';

const sampleDir = join(__dirname, 'samples');

describe('validate',  () => {

  // eslint-disable-next-line mocha/no-setup-in-describe
  const testDirs = fs.readdirSync(sampleDir);

  // eslint-disable-next-line mocha/no-setup-in-describe
  testDirs.forEach((dir) => {
      describe(dir,  () => {
        it('a valid schema', function () {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const schema: any = require(join(sampleDir, `/${dir}/expected.json`));
          if (process.env.ONLY && dir !== process.env.ONLY) {
            this.skip();
          }
          assert.doesNotThrow(() => {
            avro.Type.forSchema(schema);
          });
        });
      });
  });
});
