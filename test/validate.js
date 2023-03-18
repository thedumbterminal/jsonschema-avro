const avro = require('avsc');
const assert = require('assert')
const fs = require('fs')

describe('validate', () => {
  const sampleDir = './test/samples'
  // eslint-disable-next-line mocha/no-setup-in-describe
  const testDirs = fs.readdirSync(sampleDir)

  // eslint-disable-next-line mocha/no-setup-in-describe
  testDirs.forEach((dir) => {
    if (process.env.ONLY && dir !== process.env.ONLY) {
      return
    }

    describe(dir, () => {
      let schema

      before(() => {
        schema = require(`../${sampleDir}/${dir}/expected.json`)
        console.log(JSON.stringify(schema, null, 2))
      })

      it('a valid schema', () => {
        assert.doesNotThrow(() => {
          avro.Type.forSchema(schema)
        })
      })
    })
  })
})
