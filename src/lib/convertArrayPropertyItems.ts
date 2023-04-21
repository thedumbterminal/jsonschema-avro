import { isComplex, JSONSchema } from '../types/json-schema';
import { AvroTypeOrSchema } from '../types/avro';
import { mapType } from './mapType';
import { convertProperties } from './convertProperties';

export function convertArrayPropertyItems(
  items: JSONSchema['items'],
  path: string[],
): AvroTypeOrSchema | undefined {
  if (items === undefined || typeof items === 'boolean') {
    // No Avro schema equivalent
    return undefined;
  }

  if (!isComplex(items) && !Array.isArray(items)) {
    return mapType(items.type);
  }

  return {
    type: 'record',
    name: `${path.join('_')}_record`,
    fields: convertProperties(items, path),
  };
}
