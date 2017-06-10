const jsonSchemaAvro = require('../src/index')
const assert = require('assert')

describe('index', () => {
	
	describe('convert()', () => {
		
		let inJson
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
						"name": "address",
						"type": "record",
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
				]
			}
			inJson = {
				"description": "Example description",
				"type": "object",
				"properties": {
					"first_name": { "type": "string" },
					"last_name": { "type": "string" },
					"address": {
						"type": "object",
						"properties": {
							"street_address": { "type": "string" },
							"country": { "type" : "string" }
						}
					}
				}
			}
			result = jsonSchemaAvro.convert(inJson)
		})
		
		it('converts to avro', () => {
			//console.log(JSON.stringify(result, null, 2))
			assert.deepEqual(result, expected)
		})
	})
})
