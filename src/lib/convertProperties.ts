import { isArray, isComplex, JSONSchema } from '../types/json-schema';
import { AvroSchemaField } from '../types/avro';
import { convertProperty } from './convertProperty';
import { convertComplexProperty } from './convertComplexProperty';
import { convertArrayProperty } from './convertArrayProperty';
import { convertEnumProperty } from './convertEnumProperty';

export function convertProperties(
  schema: JSONSchema,
  path: string[] = [],
): AvroSchemaField[] {
  const requiredProperties = Array.isArray(schema.required)
    ? schema.required
    : [];

  return Object.entries(schema.properties ?? {}).reduce(
    (acc, [key, property]): AvroSchemaField[] => {
      const isRequired = requiredProperties.includes(key);

      if (typeof property === 'boolean') {
        return acc;
      } else if (isComplex(property)) {
        return [...acc, convertComplexProperty(key, property, path)];
      } else if (isArray(property)) {
        const avroField = convertArrayProperty(key, property, path, isRequired);
        return avroField ? [...acc, avroField] : acc;
      } else if (Array.isArray(property?.enum)) {
        const avroField = convertEnumProperty(
          key,
          path,
          isRequired,
          property.enum,
          property.description,
          property.default,
        );
        return [...acc, avroField];
      }

      const avroField = convertProperty(key, property, isRequired);
      return avroField ? [...acc, avroField] : acc;
    },
    new Array<AvroSchemaField>(),
  );
}
