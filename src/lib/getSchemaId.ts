import { JSONSchema4, JSONSchema6 } from 'json-schema';
import { JSONSchema } from '../types/json-schema';

export function getSchemaId(schema: JSONSchema): string | undefined {
  return (schema as JSONSchema6).$id ?? (schema as JSONSchema4).id;
}
