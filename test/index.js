const jsonSchemaAvro = require('../src/index')
const assert = require('assert')
const fs = require('fs')

describe('index', () => {

	describe('convert()', () => {
		const sampleDir = './test/samples'
		const testDirs = fs.readdirSync(sampleDir)

		testDirs.forEach(dir => {

			describe(dir, () => {
				const inJson = require(`../${sampleDir}/${dir}/input.json`)
				const expected = require(`../${sampleDir}/${dir}/expected.json`)
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

		it('should allow to override output avro schema name', () => {
			const schema = {
			  id: 'http://yourdomain.com/schemas/myschema.json',
			  type: 'object',
			  description: 'foo',
			}
			const name = 'bar'
			const expected = {
			  doc: 'foo',
			  fields: [],
			  type: 'record',
			  name: 'bar',
			  namespace: 'http.yourdomain.com.schemas.myschema.json',
			}
	  
			const result = jsonSchemaAvro.convert(schema, name)
	  
			assert.deepEqual(result, expected)
		  })

	})
})
