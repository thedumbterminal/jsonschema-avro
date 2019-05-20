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
	if (!jsonSchema) {
		throw new Error('No schema given')
	}
	const namesCache = {}
	const record = {
		name: jsonSchemaAvro._idToName(jsonSchema.id) || 'main',
		type: 'record',
		doc: jsonSchema.description,
		fields: jsonSchema.properties ? jsonSchemaAvro._convertProperties(jsonSchema.properties, jsonSchema.required || [], namesCache) : []
	}
	const nameSpace = jsonSchemaAvro._idToNameSpace(jsonSchema.id)
	if (nameSpace) {
		record.namespace = nameSpace
	}
	return record
}

jsonSchemaAvro._idToNameSpace = (id) => {
	if (!id) {
		return
	}
	const parts = url.parse(id)
	let nameSpace = []
	if (parts.host) {
		const reverseHost = parts.host.split(/\./).reverse()
		nameSpace = nameSpace.concat(reverseHost)
	}
	if (parts.path) {
		const splitPath = parts.path.replace(/^\//, '').replace('.', '_').split(/\//)
		nameSpace = nameSpace.concat(splitPath.slice(0, splitPath.length - 1))
	}
	return nameSpace.join('.')
}

jsonSchemaAvro._idToName = (id) => {
	if (!id) {
		return
	}
	const parts = url.parse(id)
	if (!parts.path) {
		return
	}
	return parts.path.replace(/^\//, '').replace('.', '_').split(/\//).pop()
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

jsonSchemaAvro._isRequired = (list, item) => list.includes(item)

jsonSchemaAvro._getUniqueName = (name, type, namesCache = {}) => {
	const nameKey = `${ name }_${ type }`
	if (namesCache[nameKey] === undefined) {
		namesCache[nameKey] = 1
		return nameKey
	}
	namesCache[nameKey] += 1
	return `${ name }${ namesCache[nameKey] }_${ type }`
}

jsonSchemaAvro._setTypeAndDefault = (prop = {}, contents = {}, isRequired = false) => {
	const type = prop.type

	if (contents.hasOwnProperty('default')) {
		//console.log('has a default')
		prop.default = contents.default
	}
	else if (!isRequired) {
		//console.log('not required and has no default')
		prop.default = null
	}

	if (Array.isArray(type)) {
		if (prop.default !== null && !isRequired) {
			prop.type = type.map(type => typeMapping[type]).filter(type => typeof type === 'string')
		}
		else {
			const notNullTypes = type.map(type => typeMapping[type]).filter(type => typeof type === 'string' && type !== 'null')
			if (prop.default === null) {
				prop.type = ['null'].concat(notNullTypes)
			}
			else if (notNullTypes.length === 0) {
				prop.type = 'null'
			}
			else {
				prop.type = notNullTypes.length === 1 ? notNullTypes[0] : notNullTypes
			}
		}
	}
	else {
		const mappedType = typeof type === 'string' ? typeMapping[type] : type
		if (mappedType === undefined) {
			prop.type = 'null'
		}
		else {
			prop.type = prop.default === null ? ['null', type] : type
		}
	}

	return prop
}

jsonSchemaAvro._convertProperties = (schema = {}, required = [], namesCache = {}) => {
	return Object.keys(schema).map((item) => {
		const isRequired = jsonSchemaAvro._isRequired(required, item)
		if (jsonSchemaAvro._isComplex(schema[item])) {
			return jsonSchemaAvro._convertComplexProperty(item, schema[item], isRequired, namesCache)
		}
		else if (jsonSchemaAvro._isArray(schema[item])) {
			return jsonSchemaAvro._convertArrayProperty(item, schema[item], isRequired, namesCache)
		}
		else if (jsonSchemaAvro._hasEnum(schema[item])) {
			return jsonSchemaAvro._convertEnumProperty(item, schema[item], isRequired, namesCache)
		}
		return jsonSchemaAvro._convertProperty(item, schema[item], isRequired, namesCache)
	})
}

jsonSchemaAvro._convertComplexProperty = (name, contents, isRequired = false, namesCache = {}) => {
	const prop = {
		name,
		doc: contents.description || '',
		type: {
			type: 'record',
			name: jsonSchemaAvro._getUniqueName(name, 'record', namesCache),
			fields: jsonSchemaAvro._convertProperties(contents.properties, contents.required, namesCache)
		}
	}
	return jsonSchemaAvro._setTypeAndDefault(prop, contents, isRequired)
}

jsonSchemaAvro._convertArrayProperty = (name, contents, isRequired = false, namesCache = {}) => {
	const prop = {
		name,
		doc: contents.description || '',
		type: {
			type: 'array',
			items: jsonSchemaAvro._isComplex(contents.items)
				? {
					type: 'record',
					name: jsonSchemaAvro._getUniqueName(name, 'record', namesCache),
					fields: jsonSchemaAvro._convertProperties(contents.items.properties, contents.items.required, namesCache)
				}
				: jsonSchemaAvro._convertProperty(name, contents.items, false, namesCache)
		}
	}
	return jsonSchemaAvro._setTypeAndDefault(prop, contents, isRequired)
}

jsonSchemaAvro._convertEnumProperty = (name, contents, isRequired = false, namesCache = {}) => {
	const prop = {
		name,
		doc: contents.description || '',
		type: contents.enum.every((symbol) => reSymbol.test(symbol))
			? {
				type: 'enum',
				name: jsonSchemaAvro._getUniqueName(name, 'enum', namesCache),
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
