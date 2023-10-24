import { JSONSchema } from './types/json-schema'
import { idToName, idToNameSpace } from './lib/idUtils'
import { convertProperties } from './lib/convertProperties'
import { schema as avsc } from 'avsc'

function convert(jsonSchema?: JSONSchema): avsc.AvroSchema {
  if (!jsonSchema) {
    throw new Error('No schema given')
  }
  const name = idToName(jsonSchema, 'main')
  const convertedProperties = convertProperties(jsonSchema, [], name)
  const namespace = idToNameSpace(jsonSchema)
  return {
    name,
    ...convertedProperties,
    ...(jsonSchema.description &&
      convertedProperties.type !== 'array' && { doc: jsonSchema.description }),
    ...(namespace && { namespace }),
  }
}

export default convert
