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
	if(jsonSchemaAvro._isComplex(jsonSchema)){
		return jsonSchemaAvro._convertComplexProperty('main', jsonSchema.properties, {doc: jsonSchema.description})
	}
	return jsonSchemaAvro._convertProperties(jsonSchema)
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

jsonSchemaAvro._convertComplexProperty = (name, contents, options = {}) => {
	const complex = {
		name: name,
		type: 'record',
		fields: jsonSchemaAvro.convert(contents)
	}
	if(options.doc){
		complex.doc = options.doc
	}
	return complex
}

jsonSchemaAvro._convertProperty = (name, value) => {
	return {
		name: name,
		type: typeMapping[value.type]
	}
}