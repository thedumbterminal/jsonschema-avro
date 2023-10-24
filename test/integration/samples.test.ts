import { schema as avsc } from 'avsc'
import assert from 'assert'
import { readdirSync } from 'fs'
import convert from '../../src'

describe('samples', () => {
  describe('convert()', () => {
    const sampleDir = './test/integration/samples'
    // eslint-disable-next-line mocha/no-setup-in-describe
    const testDirs = readdirSync(sampleDir)

    // eslint-disable-next-line mocha/no-setup-in-describe
    testDirs.forEach((dir) => {
      describe(dir, () => {
        let expected: string
        let result: avsc.AvroSchema

        before(() => {
          if (process.env.ONLY && dir !== process.env.ONLY) {
            return
          }
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const inJson = require(`../../${sampleDir}/${dir}/input.json`)
          expected = require(`../../${sampleDir}/${dir}/expected.json`)
          result = convert(inJson)
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
