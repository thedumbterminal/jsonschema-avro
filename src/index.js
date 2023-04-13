const jsonSchemaAvro = (module.exports = {})

// Json schema on the left, avro on the right
const typeMapping = {
  string: 'string',
  null: 'null',
  boolean: 'boolean',
  integer: 'long',
  number: 'float',
}

const RE_SYMBOL = /^[A-Za-z_][A-Za-z0-9_]*$/
const DEFAULT_NAMESPACE = 'nonamespace.int'

jsonSchemaAvro.convert = (jsonSchema) => {
  if (!jsonSchema) {
    throw new Error('No schema given')
  }
  let fields = []
  if (jsonSchema.properties) {
    fields = jsonSchemaAvro._convertProperties(
      jsonSchema.properties,
      jsonSchema.required
    )
  }
  const record = {
    name: jsonSchemaAvro._idToName(jsonSchema, 'main'),
    type: 'record',
    doc: jsonSchema.description,
    fields,
  }
  const nameSpace = jsonSchemaAvro._idToNameSpace(jsonSchema)
  if (nameSpace) {
    record.namespace = nameSpace
  }
  return record
}

jsonSchemaAvro._idToUrl = (id) => new URL(id, `http://${DEFAULT_NAMESPACE}/`)

jsonSchemaAvro._idToNameSpace = (schema) => {
  const id = schema.$id || schema.id
  if (!id) {
    return
  }
  const url = jsonSchemaAvro._idToUrl(id)
  let nameSpace = []
  if (url.host !== DEFAULT_NAMESPACE) {
    const reverseHost = url.host.replace(/-/g, '_').split(/\./).reverse()
    nameSpace = nameSpace.concat(reverseHost)
  }
  if (url.pathname) {
    const splitPath = jsonSchemaAvro._sanitizedSplitPath(url.pathname)
    nameSpace = nameSpace.concat(splitPath.slice(0, splitPath.length - 1))
  }
  return nameSpace.join('.')
}

jsonSchemaAvro._idToName = (schema, fallback) => {
  const id = schema.$id || schema.id
  if (id) {
    const url = jsonSchemaAvro._idToUrl(id)
    if (url.pathname) {
      return jsonSchemaAvro._sanitizedSplitPath(url.pathname).pop()
    }
  }
  return fallback
}

jsonSchemaAvro._sanitizedSplitPath = (path) => {
  return path
    .replace(/^\//, '')
    .replace(/\./g, '_')
    .replace(/-/g, '_')
    .split(/\//)
}

jsonSchemaAvro._isComplex = (schema) => schema.type === 'object'

jsonSchemaAvro._isArray = (schema) => schema.type === 'array'

jsonSchemaAvro._hasEnum = (schema) => Boolean(schema.enum)

jsonSchemaAvro._isRequired = (list, item) => list.includes(item)

jsonSchemaAvro._convertProperties = (schema = {}, required = [], path = []) => {
  return Object.keys(schema).map((item) => {
    const isRequired = jsonSchemaAvro._isRequired(required, item)
    if (jsonSchemaAvro._isComplex(schema[item])) {
      return jsonSchemaAvro._convertComplexProperty(item, schema[item], path)
    } else if (jsonSchemaAvro._isArray(schema[item])) {
      return jsonSchemaAvro._convertArrayProperty(
        item,
        schema[item],
        path,
        isRequired
      )
    } else if (jsonSchemaAvro._hasEnum(schema[item])) {
      return jsonSchemaAvro._convertEnumProperty(
        item,
        schema[item],
        path,
        isRequired
      )
    }
    return jsonSchemaAvro._convertProperty(item, schema[item], isRequired)
  })
}

jsonSchemaAvro._convertComplexProperty = (name, contents, parentPath) => {
  const path = parentPath.concat(name)
  return {
    name,
    doc: contents.description || '',
    type: {
      type: 'record',
      name: `${path.join('_')}_record`,
      fields: jsonSchemaAvro._convertProperties(
        contents.properties,
        contents.required,
        path
      ),
    },
  }
}

jsonSchemaAvro._convertArrayProperty = (
  name,
  contents,
  parentPath,
  isRequired
) => {
  const path = parentPath.concat(name)
  const prop = {
    name,
    doc: contents.description || '',
    type: {
      type: 'array',
      items: jsonSchemaAvro._isComplex(contents.items)
        ? {
            type: 'record',
            name: `${path.join('_')}_record`,
            fields: jsonSchemaAvro._convertProperties(
              contents.items.properties,
              contents.items.required,
              path
            ),
          }
        : jsonSchemaAvro._mapType(contents.items.type),
    },
  }
  if (contents.items.description) {
    prop.type.doc = contents.items.description
  }
  if (contents.default !== undefined) {
    prop.default = contents.default
  } else if (!isRequired) {
    prop.default = null
    prop.type = ['null', prop.type]
  }
  return prop
}

jsonSchemaAvro._convertEnumProperty = (
  name,
  contents,
  parentPath,
  isRequired
) => {
  const path = parentPath.concat(name)
  const hasNull = contents.enum.includes(null)
  const symbols = contents.enum.filter((symbol) => symbol !== null)
  const prop = {
    name,
    doc: contents.description || '',
    type: symbols.every((symbol) => RE_SYMBOL.test(symbol))
      ? {
          type: 'enum',
          name: `${path.join('_')}_enum`,
          symbols,
        }
      : 'string',
  }
  if (contents.default !== undefined) {
    prop.default = contents.default
  } else if (hasNull || !isRequired) {
    if (!isRequired) {
      prop.default = null
    }
    prop.type = ['null', prop.type]
  }
  return prop
}

jsonSchemaAvro._convertProperty = (name, value, isRequired) => {
  const prop = {
    name,
    doc: value.description || '',
    type: jsonSchemaAvro._mapType(value.type),
  }
  if (value.default !== undefined) {
    prop.default = value.default
  } else if (!isRequired) {
    prop.default = null
    if (!Array.isArray(prop.type)) {
      prop.type = [prop.type]
    }
    prop.type = prop.type.filter((t) => t !== 'null')
    prop.type.unshift('null')
  }
  return prop
}

jsonSchemaAvro._mapType = (type) => {
  let types = []
  if (Array.isArray(type)) {
    types = types.concat(type.map((t) => typeMapping[t]))
  } else {
    types.push(typeMapping[type])
  }
  return types.length > 1 ? types : types.shift()
}
