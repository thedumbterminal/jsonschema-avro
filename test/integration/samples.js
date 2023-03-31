const jsonSchemaAvro = require('../../src/index')
const assert = require('assert')
const fs = require('fs')

describe('samples', () => {
  describe('convert()', () => {
    const sampleDir = './test/integration/samples'
    // eslint-disable-next-line mocha/no-setup-in-describe
    const testDirs = fs.readdirSync(sampleDir)

    // eslint-disable-next-line mocha/no-setup-in-describe
    testDirs.forEach((dir) => {
      describe(dir, () => {
        let expected
        let result

        before(() => {
          const inJson = require(`../../${sampleDir}/${dir}/input.json`)
          expected = require(`../../${sampleDir}/${dir}/expected.json`)
          result = jsonSchemaAvro.convert(inJson)
        })

        it('converts to avro', function () {
          // console.log(JSON.stringify(result, null, 2))
          if (process.env.ONLY && dir !== process.env.ONLY) {
            this.skip()
          }
          assert.deepEqual(result, expected)
        })
      })
    })
  })
})
