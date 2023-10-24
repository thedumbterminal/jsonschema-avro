import { JSONSchema } from '../types/json-schema'

export function getRequiredProperties(schema: JSONSchema): string[] {
  return Array.isArray(schema.required) ? schema.required : []
}
