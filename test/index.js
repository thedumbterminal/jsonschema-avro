const jsonSchemaAvro = require('../src/index')
const inJson = require('./example.json')
const assert = require('assert')

describe('index', () => {

	describe('convert()', () => {

		let result
		let expected

		before(() => {
			expected = {
				"name": "main",
				"type": "record",
				"doc": "Example description",
				"fields": [
					{
						"name": "first_name",
						"type": "string"
					},
					{
						"name": "last_name",
						"type": "string"
					},
					{
						"name": "gender",
						"type": {
							"name": "gender_enum",
							"symbols": [
								"Male",
								"Female"
							],
							"type": "enum"
						}
					},
					{
						"name": "address",
						"type": {
							"type": "record",
							"name": "address_record",
							"fields": [
								{
									"name": "street_address",
									"type": "string"
								},
								{
									"name": "country",
									"type": "string"
								}
							]
						}
					}
				]
			}
			result = jsonSchemaAvro.convert(inJson)
		})

		it('converts to avro', () => {
			//console.log(JSON.stringify(result, null, 2))
			assert.deepEqual(result, expected)
		})
	})
})
