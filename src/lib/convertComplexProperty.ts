import { JSONSchema } from '../types/json-schema';
import { convertProperties } from './convertProperties';
import { setTypeAndDefault } from './setTypeAndDefault';
import { AvroSchemaField } from '../types/avro/avro';


export function convertComplexProperty(
  itemName: string,
  jsonSchema: JSONSchema,
  parentPathList: string[],
  isRequired: boolean,
): AvroSchemaField {
  const pathList = parentPathList.concat(itemName);
  const avroSchema:  AvroSchemaField = {
    name: itemName,
    type: convertProperties(jsonSchema, pathList, itemName),
    ... (jsonSchema.description && { doc:  jsonSchema.description }),
  };
  return setTypeAndDefault(avroSchema, jsonSchema, isRequired);
}
