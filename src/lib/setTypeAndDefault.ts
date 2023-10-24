import { AvroSchemaField } from '../types/avro/avro'
import { JSONSchema } from '../types/json-schema'
import { mapType } from './mapType'
import { schema as avsc } from 'avsc'

export function setTypeAndDefault<
  T extends {
    type?: AvroSchemaField['type'] | avsc.EnumType['type'] | undefined
    default?: AvroSchemaField['default']
    name?: string
  },
>(originalAvroSchema: T, jsonSchema: JSONSchema, isRequired: boolean): T {
  const { type } = originalAvroSchema
  const avroSchema = { ...originalAvroSchema }

  if (jsonSchema.default !== undefined) {
    avroSchema.default = jsonSchema.default
  } else if (!isRequired) {
    avroSchema.default = null
  }

  const hasNull =
    avroSchema.default === null ||
    (Array.isArray(type) && type.includes('null'))
  const __mapType = mapType(avroSchema.name ?? '')

  if (Array.isArray(type)) {
    const mappedTypes = (hasNull ? ['null'] : [])
      .concat(hasNull ? type.filter((item) => item !== 'null') : type)
      .map(__mapType)
    const avroType = mappedTypes.length === 1 ? mappedTypes[0] : mappedTypes
    return { ...avroSchema, type: avroType }
  } else {
    const mappedType = __mapType(type)
    const avroType =
      hasNull && mappedType !== 'null' ? ['null', mappedType] : mappedType
    return { ...avroSchema, type: avroType }
  }
}
