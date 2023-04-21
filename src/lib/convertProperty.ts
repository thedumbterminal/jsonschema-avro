import { JSONSchema } from '../types/json-schema';
import { AvroSchemaField } from '../types/avro';
import { mapType } from './mapType';
import {schema} from 'avsc';
import DefinedType = schema.DefinedType;

/**
 * Converts a JSON schema property into an Avro schema RecordType field
 *
 * @param {String} name The name of the property to be converted
 * @param {JSONSchema} value The JSON schema property to be converted
 * @param {boolean} isRequired Flags the property as required or optional
 */
export const convertProperty = (
  name: string,
  value: JSONSchema,
  isRequired: boolean,
): AvroSchemaField | undefined => {
  const propType = mapType(value.type);

  if (propType === undefined) {
    // No Avro schema equivalent
    return undefined;
  }

  const prop: AvroSchemaField = {
    name,
    doc: value.description || '',
    type: propType,
  };

  if (value.default !== undefined) {
    prop.default = value.default;
  } else if (!isRequired) {
    prop.default = null;
    const nonNullTypes: DefinedType[] = (Array.isArray(propType) ? propType : [propType]).filter((t) => t !== 'null');
    prop.type = ['null', ...nonNullTypes];
  }
  return prop;


// default: value.default ?? (isRequired ? undefined : null),
};
