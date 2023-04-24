import { JSONSchema } from '../types/json-schema';
import { AvroSchemaField } from '../types/avro';
import { convertProperties } from './convertProperties';

export function convertComplexProperty(
  name: string,
  contents: JSONSchema,
  parentPath: string[],
): AvroSchemaField {
  const path = parentPath.concat(name);
  return {
    name,
    doc:
      typeof contents === 'object' && typeof contents.description === 'string'
        ? contents.description
        : '',
    type: {
      type: 'record',
      name: `${path.join('_')}_record`,
      fields: convertProperties(contents, path),
    },
  };
}
