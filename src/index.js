let $RefParser;
try {
	$RefParser = require('json-schema-ref-parser');
}
catch(e) { 
	$RefParser = null;
}

const jsonSchemaAvro = module.exports = {}

// Json schema on the left, avro on the right
const typeMapping = {
	'array': 'array',
	'string': 'string',
	'null': 'null',
	'boolean': 'boolean',
	'integer': 'int',
	'number': 'float'
}

const reSymbol = /^[A-Za-z_][A-Za-z0-9_]*$/;

jsonSchemaAvro.convert = async (schema) => {
	if(!schema){
		throw new Error('No schema given')
	}
	const avroSchema = $RefParser ?
		await $RefParser.dereference(schema)
		  .then(function(jsonSchema) {
		    return jsonSchemaAvro._mainRecord(jsonSchema)
		  })
		  .catch(function(err) {
		  	throw err;
		  }) :
		await Promise.resolve(jsonSchemaAvro._mainRecord(schema));
	return avroSchema
}

jsonSchemaAvro._mainRecord = (jsonSchema) => {
	return jsonSchemaAvro._isOneOf(jsonSchema) || jsonSchemaAvro._isAnyOf(jsonSchema) ? 
		{
			namespace: jsonSchemaAvro._convertId(jsonSchema.id),
			...jsonSchemaAvro._convertCombinationOfProperty('main', jsonSchema)
		}:
		{
			namespace: jsonSchemaAvro._convertId(jsonSchema.id),
			name: 'main',
			type: 'record',
			doc: jsonSchema.description,
			fields: [].concat.apply([], jsonSchemaAvro._getCombinationOf(jsonSchema).
				map((it) => it.properties ? jsonSchemaAvro._convertProperties(it.properties) : [])
			)
		}
}

jsonSchemaAvro._convertId = (id) => {
	return id ? id.replace(/([^a-z0-9]+)/ig, '.') : id
}

jsonSchemaAvro._isComplex = (schema) => {
	return schema.type === 'object'
}

jsonSchemaAvro._isArray = (schema) => {
	return schema.type === 'array'
}

jsonSchemaAvro._hasEnum = (schema) => {
	return Boolean(schema.enum)
}

jsonSchemaAvro._isCombinationOf = (schema) => {
	// common handling for 'union' in avro
	return 	schema.hasOwnProperty('oneOf') || 
			schema.hasOwnProperty('allOf') || 
			schema.hasOwnProperty('anyOf')
}

jsonSchemaAvro._isOneOf = (schema) => {
	return 	schema.hasOwnProperty('oneOf')
}

jsonSchemaAvro._isAllOf = (schema) => {
	return 	schema.hasOwnProperty('allOf')
}

jsonSchemaAvro._isAnyOf = (schema) => {
	return 	schema.hasOwnProperty('anyOf')
}

jsonSchemaAvro._getCombinationOf = (schema) => {
	// common handling for 'union' in avro
	return 	schema.hasOwnProperty('anyOf') ? 
				schema.anyOf :
				(schema.hasOwnProperty('oneOf') ?
					schema.oneOf :
					(schema.hasOwnProperty('allOf') ?
						schema.allOf : 
						// wrap to simplify recursion in edge cases
						[ schema ] 
					)
				)
}

jsonSchemaAvro._convertProperties = (schema) => {
	return Object.keys(schema).map((item) => {
		if(jsonSchemaAvro._isComplex(schema[item])){
			return jsonSchemaAvro._convertComplexProperty(item, schema[item])
		}
		else if (jsonSchemaAvro._isArray(schema[item])) {
			return jsonSchemaAvro._convertArrayProperty(item, schema[item])
		}
		else if(jsonSchemaAvro._hasEnum(schema[item])){
			return jsonSchemaAvro._convertEnumProperty(item, schema[item])
		}
		else if(jsonSchemaAvro._isCombinationOf(schema[item])){
			return jsonSchemaAvro._convertCombinationOfProperty(item, schema[item])
		}
		return jsonSchemaAvro._convertProperty(item, schema[item])
	})
}

jsonSchemaAvro._collectCombinationProperties = (contents) => {
	return [].concat.apply([], 
		jsonSchemaAvro._getCombinationOf(contents).map(
			(it) => {
				return jsonSchemaAvro._isCombinationOf(it) ?
					jsonSchemaAvro._collectCombinationProperties(it) :
					(it.properties ? jsonSchemaAvro._convertProperties(it.properties) : [])
			}
		)
	)
}

jsonSchemaAvro._convertCombinationOfProperty = (name, contents) => {
	return (
				{
					name: name,
					doc: contents.description || '',
					type: [].concat.apply([], jsonSchemaAvro._getCombinationOf(contents).
							map((it, index) => {
								return (it && it.type && it.type === 'null') ? 
									'null' : 
									( 	
										{
											type: 'record',
											name: 	it.name ? 
													`${it.name}_record` : 
													(jsonSchemaAvro._isOneOf(contents) || jsonSchemaAvro._isAllOf(contents) ? 
														`${name}_record` :
														`record_${index}`
													),
											doc: it.description || '',
											fields: 
												jsonSchemaAvro._isCombinationOf(it) ?
												jsonSchemaAvro._collectCombinationProperties(it) :
												(it.properties ? jsonSchemaAvro._convertProperties(it.properties) : [])
										}
									)
							}
						)
					)
				}
			)
}

jsonSchemaAvro._convertComplexProperty = (name, contents) => {
	return {
		name: name,
		doc: contents.description || '',
		type: {
			type: 'record',
			name: `${name}_record`,
			fields: [].concat.apply([], jsonSchemaAvro._getCombinationOf(contents || {}).
				map((it) => it.properties ? jsonSchemaAvro._convertProperties(it.properties) : [])
			)
		}
	}
}

jsonSchemaAvro._getItems = (name, contents) => {
	return jsonSchemaAvro._isComplex(contents.items)
				? {
					type: 'record',
					name: `${name}_record`,
					fields: jsonSchemaAvro._convertProperties(contents.items.properties || {})
				}
				: jsonSchemaAvro._convertProperty(name, contents.items)
}

jsonSchemaAvro._convertArrayProperty = (name, contents) => {
	return {
		name: name,
		doc: contents.description || '',
		type: {
			type: 'array',
			items: jsonSchemaAvro._getItems(name, contents)
		}
	}
}

jsonSchemaAvro._convertEnumProperty = (name, contents) => {
	const valid = contents.enum.every((symbol) => reSymbol.test(symbol))
	let prop = {
		name: name,
		doc: contents.description || '',
		type: valid ? {
			type: 'enum',
			name: `${name}_enum`,
			symbols: contents.enum
		} : 'string'
	}
	if(contents.hasOwnProperty('default')){
		prop.default = contents.default
	}
	return prop
}

jsonSchemaAvro._convertProperty = (name, value) => {
	let prop = {
		name: name,
		doc: value.description || ''
	}
	if(value.hasOwnProperty('default')){
		prop.default = value.default
	}
	if(Array.isArray(value.type)){
		prop.type = value.type.map(type => typeMapping[type])
		if(prop.type.indexOf('array') > -1) {
			prop.items = jsonSchemaAvro._getItems(name, value)
		}
	}
	else{
		prop.type = typeMapping[value.type]
	}
	return prop
}
