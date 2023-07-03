import { schema as avsc } from 'avsc'

/**
 * Subset of Avro types used in the conversion from JSON schema to Avro schema
 */

export interface AvroSchemaField {
  name: string
  doc?: string
  type: AvroComplexType | AvroSchemaRecordType | string | string[]
  default?: any
  order?: 'ascending' | 'descending' | 'ignore'
}
export interface AvroSchemaRecordType {
  type: 'record' | 'error'
  name: string
  namespace?: string
  doc?: string
  aliases?: string[]
  fields: AvroSchemaField[]
}
export interface AvroSchemaArrayType {
  type: 'array'
  items: AvroSchemaType
}

export type AvroComplexType =
  | avsc.EnumType
  | avsc.NamedType
  | AvroSchemaArrayType
  | AvroSchemaRecordType
export type AvroSchemaArrayField = AvroSchemaField & {
  type: AvroSchemaArrayType
}
export type AvroSchemaType = AvroDefinedType | AvroDefinedType[]
export type AvroDefinedType = avsc.PrimitiveType | AvroComplexType | string
