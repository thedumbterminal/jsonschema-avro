const avro = require('avsc')
const assert = require('assert')
const fs = require('fs')

describe('validate', () => {
  const sampleDir = './test/samples'
  // eslint-disable-next-line mocha/no-setup-in-describe
  const testDirs = fs.readdirSync(sampleDir)

  // eslint-disable-next-line mocha/no-setup-in-describe
  testDirs.forEach((dir) => {
    describe(dir, () => {
      let schema

      before(() => {
        schema = require(`../${sampleDir}/${dir}/expected.json`)
      })

      it('a valid schema', function () {
        if (process.env.ONLY && dir !== process.env.ONLY) {
          this.skip()
        } else if (dir === 'array') {
          // Is this avro valid?
          this.skip()
        }

        assert.doesNotThrow(() => {
          avro.Type.forSchema(schema)
        })
      })
    })
  })
})
