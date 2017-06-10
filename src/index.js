const jsonSchemaAvro = module.exports = {}

// Json schema on the left, avro on the right
const typeMapping = {
	'string': 'string',
	'null': 'null',
	'boolean': 'boolean',
	'integer': 'int',
	'number': 'float'
}

jsonSchemaAvro.convert = (jsonSchema) => {
	return {
		name: 'main',
		type: 'record',
		doc: jsonSchema.description,
		fields: jsonSchemaAvro._convertProperties(jsonSchema.properties)
	}
}

jsonSchemaAvro._isComplex = (schema) => {
	return schema.type === 'object'
}

jsonSchemaAvro._convertProperties = (schema) => {
	return Object.keys(schema).map((item) => {
		if(jsonSchemaAvro._isComplex(schema[item])){
			return jsonSchemaAvro._convertComplexProperty(item, schema[item].properties)
		}
		return jsonSchemaAvro._convertProperty(item, schema[item])
	})
}

jsonSchemaAvro._convertComplexProperty = (name, contents) => {
	const complex = {
		name: name,
		type: {
			type: 'record',
			name: `${name}_record`,
			fields: jsonSchemaAvro._convertProperties(contents)
		} 
	}
	return complex
}

jsonSchemaAvro._convertProperty = (name, value) => {
	return {
		name: name,
		type: typeMapping[value.type]
	}
}