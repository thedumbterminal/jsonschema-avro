import { JSONSchemaTyped } from '../types/json-schema';
import { AvroSchemaField } from '../types/avro/avro';
import { setTypeAndDefault } from './setTypeAndDefault';

export function convertProperty (itemName: string, jsonSchema: JSONSchemaTyped, isRequired: boolean): AvroSchemaField {
  const avroSchema: AvroSchemaField = {
    type: jsonSchema.type,
    name: itemName,
    ... (jsonSchema.description && { doc: jsonSchema.description }),
  };
  return setTypeAndDefault(avroSchema, jsonSchema, isRequired);
}
