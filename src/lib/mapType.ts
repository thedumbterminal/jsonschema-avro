import { AvroSchemaField } from '../types/avro/avro'
import { schema as avsc } from 'avsc'

const typeMapping: { [k: string]: string | undefined } = {
  string: 'string',
  null: 'null',
  boolean: 'boolean',
  integer: 'long',
  number: 'double',
}

export const mapType =
  (propName: string) =>
  (jsonType: any): AvroSchemaField['type'] | avsc.EnumType['type'] => {
    if (typeof jsonType === 'string' && jsonType.length) {
      const mappedType = typeMapping[jsonType]
      if (mappedType === undefined) {
        throw new Error(
          `Invalid JSON schema type "${jsonType}" for "${propName}"`
        )
      }
      return mappedType
    }
    return jsonType
  }
