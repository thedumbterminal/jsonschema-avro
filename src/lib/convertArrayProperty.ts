import { JSONSchema } from '../types/json-schema';
import { AvroSchemaField } from '../types/avro';
import { schema as avsc } from 'avsc';
import { convertArrayPropertyItems } from './convertArrayPropertyItems';

export function convertArrayProperty(
  name: string,
  contents: JSONSchema,
  parentPath: string[],
  isRequired: boolean,
): AvroSchemaField | undefined {
  const path = parentPath.concat(name);
  const items = convertArrayPropertyItems(contents.items, path);
  if (items === undefined) {
    // No Avro schema equivalent
    return undefined;
  }
  const propType: avsc.ArrayType = { type: 'array', items };

  const prop: AvroSchemaField = {
    name,
    doc: contents.description ?? '',
    type: propType,
  };

  if (contents.default !== undefined) {
    prop.default = contents.default;
  } else if (!isRequired) {
    prop.default = null;
    prop.type = ['null', propType];
  }

  return prop;
}
