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
	if(!jsonSchema){
		throw new Error('No schema given')
	}
	return {
		name: 'main',
		type: 'record',
		doc: jsonSchema.description,
		fields: jsonSchema.properties ? jsonSchemaAvro._convertProperties(jsonSchema.properties) : []
	}
}

jsonSchemaAvro._isComplex = (schema) => {
	return schema.type === 'object'
}

jsonSchemaAvro._hasEnum = (schema) => {
	return Boolean(schema.enum)
}

jsonSchemaAvro._convertProperties = (schema) => {
	return Object.keys(schema).map((item) => {
		if(jsonSchemaAvro._isComplex(schema[item])){
			return jsonSchemaAvro._convertComplexProperty(item, schema[item])
		}
		else if(jsonSchemaAvro._hasEnum(schema[item])){
			return jsonSchemaAvro._convertEnumProperty(item, schema[item])
		}
		return jsonSchemaAvro._convertProperty(item, schema[item])
	})
}

jsonSchemaAvro._convertComplexProperty = (name, contents) => {
	return {
		name: name,
		doc: contents.description || '',
		type: {
			type: 'record',
			name: `${name}_record`,
			fields: jsonSchemaAvro._convertProperties(contents.properties)
		} 
	}
}

jsonSchemaAvro._convertEnumProperty = (name, contents) => {
	return {
		name: name,
		doc: contents.description || '',
		type: {
			type: 'enum',
			name: `${name}_enum`,
			symbols: contents.enum
		}
	}
}

jsonSchemaAvro._convertProperty = (name, value) => {
	return {
		name: name,
		doc: value.description || '',
		type: typeMapping[value.type]
	}
}