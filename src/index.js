const url = require('url')
const jsonSchemaAvro = module.exports = {}

// Json schema on the left, avro on the right
const typeMapping = {
	'string': 'string',
	'null': 'null',
	'boolean': 'boolean',
	'integer': 'int',
	'number': 'float'
}

const reSymbol = /^[A-Za-z_][A-Za-z0-9_]*$/

jsonSchemaAvro.convert = (jsonSchema) => {
	if(!jsonSchema){
		throw new Error('No schema given')
	}
	const record = {
		name: jsonSchemaAvro._idToName(jsonSchema.id) || 'main',
		type: 'record',
		doc: jsonSchema.description,
		fields: jsonSchema.properties ? jsonSchemaAvro._convertProperties(jsonSchema.properties, jsonSchema.required) : []
	}
	const nameSpace = jsonSchemaAvro._idToNameSpace(jsonSchema.id)
	if(nameSpace){
		record.namespace = nameSpace
	}
	return record
}

jsonSchemaAvro._idToNameSpace = (id) => {
	if(!id){
		return
	}
	const parts = url.parse(id)
	let nameSpace = []
	if(parts.host){
		const reverseHost = parts.host.split(/\./).reverse()
		nameSpace = nameSpace.concat(reverseHost)
	}
	if(parts.path){
		const splitPath = parts.path.replace(/^\//, '').replace('.', '_').split(/\//)
		nameSpace = nameSpace.concat(splitPath.slice(0, splitPath.length - 1))
	}
	return nameSpace.join('.')
}

jsonSchemaAvro._idToName = (id) => {
	if(!id){
		return
	}
	const parts = url.parse(id)
	if(!parts.path){
		return
	}
	return parts.path.replace(/^\//, '').replace('.', '_').split(/\//).pop()
}

jsonSchemaAvro._isComplex = (schema) => schema.type === 'object'

jsonSchemaAvro._isArray = (schema) => schema.type === 'array'

jsonSchemaAvro._hasEnum = (schema) => Boolean(schema.enum)

jsonSchemaAvro._isRequired = (list, item) => list.includes(item)

jsonSchemaAvro._convertProperties = (schema = {}, required = [], path = []) => {
	return Object.keys(schema).map((item) => {
		const isRequired = jsonSchemaAvro._isRequired(required, item)
		if(jsonSchemaAvro._isComplex(schema[item])){
			return jsonSchemaAvro._convertComplexProperty(item, schema[item], path, isRequired)
		}
		else if(jsonSchemaAvro._isArray(schema[item])){
			return jsonSchemaAvro._convertArrayProperty(item, schema[item], path, isRequired)
		}
		else if(jsonSchemaAvro._hasEnum(schema[item])){
			return jsonSchemaAvro._convertEnumProperty(item, schema[item], path, isRequired)
		}
		return jsonSchemaAvro._convertProperty(item, schema[item], isRequired)
	})
}

jsonSchemaAvro._convertComplexProperty = (name, contents, parentPath = [], isRequired = false) => {
	const path = parentPath.slice().concat(name)
	const prop = {
		name,
		doc: contents.description || '',
		type: {
			type: 'record',
			name: `${path.join('_')}_record`,
			fields: jsonSchemaAvro._convertProperties(contents.properties, contents.required, path)
		}
	}
	return jsonSchemaAvro._setTypeAndDefault(prop, contents, isRequired)
}

jsonSchemaAvro._convertArrayProperty = (name, contents, parentPath = [], isRequired = false) => {
	const path = parentPath.slice().concat(name)
	const prop = {
		name,
		doc: contents.description || '',
		type: {
			type: 'array',
			items: jsonSchemaAvro._isComplex(contents.items)
				? {
					type: 'record',
					name: `${path.join('_')}_record`,
					fields: jsonSchemaAvro._convertProperties(contents.items.properties, contents.items.required, path)
				}
				: jsonSchemaAvro._convertProperty(name, contents.items)
		}
	}
	return jsonSchemaAvro._setTypeAndDefault(prop, contents, isRequired)
}

jsonSchemaAvro._convertEnumProperty = (name, contents, parentPath = [], isRequired = false) => {
	const path = parentPath.slice().concat(name)
	const prop = {
		name,
		doc: contents.description || '',
		type: contents.enum.every((symbol) => reSymbol.test(symbol))
			? {
				type: 'enum',
				name: `${path.join('_')}_enum`,
				symbols: contents.enum
			}
			: 'string'
	}
	return jsonSchemaAvro._setTypeAndDefault(prop, contents, isRequired)
}

jsonSchemaAvro._convertProperty = (name, value, isRequired = false) => {
	const prop = {
		name,
		doc: value.description || '',
		type: value.type
	}
	return jsonSchemaAvro._setTypeAndDefault(prop, value, isRequired)
}

jsonSchemaAvro._setTypeAndDefault = (prop = {}, contents = {}, isRequired = false) => {
	const type = prop.type

	if(contents.hasOwnProperty('default')){
		//console.log('has a default')
		prop.default = contents.default
	}
	else if(!isRequired){
		//console.log('not required and has no default')
		prop.default = null
	}

	if(Array.isArray(type)){
		if(prop.default !== null && !isRequired){
			prop.type = type.map(type => typeMapping[type]).filter(type => typeof type === 'string')
		}
		else{
			const notNullTypes = type.map(type => typeMapping[type]).filter(type => typeof type === 'string' && type !== 'null')
			if(prop.default === null){
				prop.type = ['null'].concat(notNullTypes)
			}
			else if(notNullTypes.length === 0){
				prop.type = 'null'
			}
			else{
				prop.type = notNullTypes.length === 1 ? notNullTypes[0] : notNullTypes
			}
		}
	}
	else{
		const mappedType = typeof type === 'string' ? typeMapping[type] : type
		if(mappedType === undefined){
			prop.type = 'null'
		}
		else{
			prop.type = prop.default === null ? ['null', type] : type
		}
	}

	return prop
}
