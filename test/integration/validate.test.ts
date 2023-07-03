import * as avro from 'avsc'
import * as assert from 'assert'
import { readdirSync } from 'fs'

describe('validate', () => {
  const sampleDir = './test/integration/samples'
  // eslint-disable-next-line mocha/no-setup-in-describe
  const testDirs = readdirSync(sampleDir)

  // eslint-disable-next-line mocha/no-setup-in-describe
  testDirs.forEach((dir) => {
    describe(dir, () => {
      let schema: any

      before(() => {
        schema = require(`../../${sampleDir}/${dir}/expected.json`)
      })

      it('a valid schema', function () {
        if (process.env.ONLY && dir !== process.env.ONLY) {
          this.skip()
        }
        assert.doesNotThrow(() => {
          avro.Type.forSchema(schema)
        })
      })
    })
  })
})
