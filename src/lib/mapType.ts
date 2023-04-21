import { schema as avsc } from 'avsc';
import { typeMapping } from '../map/typeMapping';
import { JSONSchema } from '../types/json-schema';

/**
 * @param {JSONSchema["type"]} [jsonSchemaType] - The source JSON schema
 * @returns {avsc.DefinedType | avsc.DefinedType[] | undefined} The Avro schema equivalent of input JSON schema type(s), if an equivalent is not found.
 */
export function mapType(
  jsonSchemaType?: JSONSchema['type'],
): avsc.DefinedType | avsc.DefinedType[] | undefined {
  if (jsonSchemaType === undefined) {
    return undefined;
  }
  const jsonSchemaTypes: string[] = Array.isArray(jsonSchemaType)
    ? jsonSchemaType
    : [jsonSchemaType];
  if (!jsonSchemaTypes.every((t) => typeof t === 'string')) {
    return undefined;
  }
  const avroTypes = jsonSchemaTypes.reduce((acc, t) => {
    const avroType = typeMapping[t];
    return avroType ? [...acc, avroType] : acc;
  }, new Array<avsc.DefinedType>());

  return avroTypes.length > 1 ? avroTypes : avroTypes.shift();
}
