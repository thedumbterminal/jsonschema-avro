const idUtils = require('./idUtils')

const jsonSchemaAvro = (module.exports = {})

// Json schema on the left, avro on the right
const typeMapping = {
  string: 'string',
  null: 'null',
  boolean: 'boolean',
  integer: 'long',
  number: 'double',
}

const RE_SYMBOL = /^[A-Za-z_][A-Za-z0-9_]*$/

jsonSchemaAvro.convert = (jsonSchema) => {
  if (jsonSchema !== Object(jsonSchema)) {
    throw new Error('No schema given')
  }
  const name = idUtils.toName(jsonSchema, 'main')
  const record = {
    name,
    ...jsonSchemaAvro._convertProperties(jsonSchema, [], name),
  }
  if (jsonSchema.description && record.type !== 'array') {
    record.doc = String(jsonSchema.description)
  }
  const nameSpace = idUtils.toNameSpace(jsonSchema)
  if (nameSpace) {
    record.namespace = nameSpace
  }
  return record
}

jsonSchemaAvro._isComplex = (schema) => schema === Object(schema) && schema.type === 'object'

jsonSchemaAvro._isArray = (schema) => schema.type === 'array'

jsonSchemaAvro._hasEnum = (schema) => Boolean(schema.enum)

jsonSchemaAvro._convertProperties = (jsonSchema, parentPathList, rootName) => {
  const { properties, items, required } = jsonSchema

  if (items === Object(items)) {
    const { type, ...rest } = jsonSchemaAvro._convertArrayProperty(
      rootName || '',
      jsonSchema,
      parentPathList,
      true
    )
    if(type === Object(type) && type.type === 'array' && type.items !== undefined) {
      return {
        type: type.type,
        items: type.items,
      }
    }
    return {
      ...rest,
      ...type,
    }
  }

  const avroSchema = { type: 'record', fields: [] }

  if (parentPathList.length > 0) {
    avroSchema.name = `${parentPathList.join('_')}_record`
  }

  if (properties !== Object(properties)) {
    return avroSchema
  }

  return {
    ...avroSchema,
    fields: Object.keys(properties).reduce((convertedProperties, propertyName) => {
      const isRequired =
        Array.isArray(required) === true &&
        required.includes(propertyName) === true
      const propertySchema = properties[propertyName]

      if (jsonSchemaAvro._isComplex(propertySchema)) {
        convertedProperties.push(jsonSchemaAvro._convertComplexProperty(
          propertyName,
          propertySchema,
          parentPathList,
          isRequired
        ))
      } else if (jsonSchemaAvro._isArray(propertySchema)) {
        if(propertySchema.items !== undefined) {
          convertedProperties.push(jsonSchemaAvro._convertArrayProperty(
            propertyName,
            propertySchema,
            parentPathList,
            isRequired
          ))
        }
      } else if (jsonSchemaAvro._hasEnum(propertySchema)) {
        convertedProperties.push(jsonSchemaAvro._convertEnumProperty(
          propertyName,
          propertySchema,
          parentPathList,
          isRequired
        ))
      } else {
        convertedProperties.push(jsonSchemaAvro._convertProperty(
          propertyName,
          propertySchema,
          isRequired
        ))
      }

      return convertedProperties;
    }, []),
  }
}

jsonSchemaAvro._convertComplexProperty = (
  itemName,
  jsonSchema,
  parentPathList,
  isRequired
) => {
  const pathList = parentPathList.concat(itemName)
  const avroSchema = {
    name: itemName,
    type: jsonSchemaAvro._convertProperties(jsonSchema, pathList),
  }
  if (jsonSchema.description) {
    avroSchema.doc = String(jsonSchema.description)
  }
  return jsonSchemaAvro._setTypeAndDefault(avroSchema, jsonSchema, isRequired)
}

jsonSchemaAvro._convertArrayProperty = (
  itemName,
  jsonSchema,
  parentPathList,
  isRequired
) => {
  const pathList = parentPathList.concat(itemName)
  let items

  if (
    jsonSchemaAvro._isComplex(jsonSchema.items) ||
    jsonSchemaAvro._isArray(jsonSchema.items)
  ) {
    items = jsonSchemaAvro._convertProperties(jsonSchema.items, pathList)
  } else if (jsonSchemaAvro._hasEnum(jsonSchema.items)) {
    items = jsonSchemaAvro._convertEnumProperty(
      jsonSchema.items.name || itemName,
      jsonSchema.items,
      parentPathList,
      true
    ).type
  } else {
    items = jsonSchemaAvro._convertProperty(
      jsonSchema.items.name,
      jsonSchema.items,
      true
    )

    if (Array.isArray(items.type)) {
      items.type = items.type.map((type) => {
        if (jsonSchemaAvro._isComplex(type) || jsonSchemaAvro._isArray(type)) {
          return jsonSchemaAvro._convertProperties(type, pathList)
        }
        if (jsonSchemaAvro._hasEnum(type)) {
          return jsonSchemaAvro._convertEnumProperty(
            type.name || itemName,
            type,
            parentPathList,
            true
          ).type
        }
        return type
      })
    }
  }

  const avroSchema = {
    type: {
      type: 'array',
      items,
    },
  }

  const { doc, ...rest } = items
  if (Object.keys(rest).length === 1 && rest.type !== undefined) {
    avroSchema.type.items = rest.type
  }

  if (itemName) {
    avroSchema.name = String(itemName)
  }
  if (jsonSchema.description) {
    avroSchema.doc = String(jsonSchema.description)
  }

  return jsonSchemaAvro._setTypeAndDefault(avroSchema, jsonSchema, isRequired)
}

jsonSchemaAvro._convertEnumProperty = (
  itemName,
  jsonSchema,
  parentPathList,
  isRequired
) => {
  const pathList = parentPathList.concat(itemName)
  const symbols = jsonSchema.enum.filter((symbol) => symbol !== null)
  const avroSchema = {
    name: itemName,
    type: symbols.every((symbol) => RE_SYMBOL.test(symbol))
      ? {
          type: 'enum',
          name: `${pathList.join('_')}_enum`,
          symbols,
        }
      : 'string',
  }
  if (jsonSchema.description) {
    avroSchema.doc = String(jsonSchema.description)
  }
  if (jsonSchema.enum.includes(null)) {
    avroSchema.type = ['null', avroSchema.type]
  }
  return jsonSchemaAvro._setTypeAndDefault(avroSchema, jsonSchema, isRequired)
}

jsonSchemaAvro._convertProperty = (itemName, jsonSchema, isRequired) => {
  const avroSchema = {
    type: jsonSchema.type,
  }
  if (itemName) {
    avroSchema.name = String(itemName)
  }
  if (jsonSchema.description) {
    avroSchema.doc = String(jsonSchema.description)
  }
  return jsonSchemaAvro._setTypeAndDefault(avroSchema, jsonSchema, isRequired)
}

jsonSchemaAvro._mapType = (propName) => (jsonType) => {
  const mappedType =
    jsonType !== Object(jsonType) ? typeMapping[jsonType] : jsonType
  if (mappedType === undefined) {
    throw new Error(`Invalid JSON schema type "${jsonType}" for "${propName}"`)
  }
  return mappedType
}

jsonSchemaAvro._setTypeAndDefault = (
  originalAvroSchema,
  jsonSchema,
  isRequired
) => {
  const { type } = originalAvroSchema
  const avroSchema = { ...originalAvroSchema }

  if (jsonSchema.default !== undefined) {
    avroSchema.default = jsonSchema.default
  } else if (isRequired !== true) {
    avroSchema.default = null
  }

  const hasNull =
    avroSchema.default === null ||
    (Array.isArray(type) && type.includes('null'))
  const mapType = jsonSchemaAvro._mapType(avroSchema.name)

  if (Array.isArray(type)) {
    const mappedTypes = (hasNull ? ['null'] : [])
      .concat(hasNull ? type.filter((item) => item !== 'null') : type)
      .map(mapType)

    avroSchema.type = mappedTypes.length === 1 ? mappedTypes[0] : mappedTypes
  } else {
    const mappedType = mapType(type)
    avroSchema.type =
      hasNull && mappedType !== 'null' ? ['null', mappedType] : mappedType
  }
  return avroSchema
}
