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
		if(jsonSchemaAvro._isComplex(schema[item])){
			return jsonSchemaAvro._convertComplexProperty(item, schema[item], path)
		}
		else if(jsonSchemaAvro._isArray(schema[item])){
			return jsonSchemaAvro._convertArrayProperty(item, schema[item], path)
		}
		else if(jsonSchemaAvro._hasEnum(schema[item])){
			return jsonSchemaAvro._convertEnumProperty(item, schema[item], path)
		}
		return jsonSchemaAvro._convertProperty(item, schema[item], jsonSchemaAvro._isRequired(required, item))
	})
}

jsonSchemaAvro._convertComplexProperty = (name, contents, parentPath = []) => {
	const path = parentPath.slice().concat(name)
	return {
		name,
		doc: contents.description || '',
		type: {
			type: 'record',
			name: `${path.join('_')}_record`,
			fields: jsonSchemaAvro._convertProperties(contents.properties, contents.required, path)
		}
	}
}

jsonSchemaAvro._convertArrayProperty = (name, contents, parentPath = []) => {
	const path = parentPath.slice().concat(name)
	return {
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
}

jsonSchemaAvro._convertEnumProperty = (name, contents, parentPath = []) => {
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
	if(contents.hasOwnProperty('default')){
		prop.default = contents.default
	}
	return prop
}

jsonSchemaAvro._convertProperty = (name, value, isRequired = false) => {
	const prop = {
		name,
		doc: value.description || ''
	}
	let types = []
	if(value.hasOwnProperty('default')){
		//console.log('has a default')
		prop.default = value.default
	}
	else if(!isRequired){
		//console.log('not required and has no default')
		prop.default = null
		types.push('null')
	}
	if(Array.isArray(value.type)){
		types = types.concat(value.type.filter(type => type !== 'null').map(type => typeMapping[type]))
	}
	else{
		types.push(typeMapping[value.type])
	}
	//console.log('types', types)
	//console.log('size', types.length)
	prop.type = types.length > 1 ? types : types.shift()
	//console.log('prop', prop)
	return prop
}
