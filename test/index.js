const jsonSchemaAvro = require('../src/index')
const inJson = require('./example.json')
const expected = require('./expected.json')
const assert = require('assert')

describe('index', () => {

	describe('convert()', () => {
		let result

		before(() => {
			result = jsonSchemaAvro.convert(inJson)
		})

		it('converts to avro', () => {
			//console.log(JSON.stringify(result, null, 2))
			assert.deepEqual(result, expected)
		})
	})
})
