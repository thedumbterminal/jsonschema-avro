import { isArray, isComplex, isJSONSchemaEnum, JSONSchema } from '../types/json-schema';
import { AvroSchemaArrayType, AvroSchemaField, AvroSchemaRecordType } from '../types/avro/avro';
import { convertArrayProperty } from './convertArrayProperty';
import { convertProperty } from './convertProperty';
import { convertComplexProperty } from './convertComplexProperty';
import { convertEnumProperty } from './convertEnumProperty';

export function convertProperties(
  jsonSchema: JSONSchema,
  parentPathList: string[] = [],
  rootName = '',
): AvroSchemaRecordType | AvroSchemaArrayType {
    const { properties, required } = jsonSchema;

    if (isArray(jsonSchema)) {
      return convertArrayProperty(
        rootName,
        jsonSchema,
        parentPathList,
        true,
      ).type;
    }

    const avroSchema: AvroSchemaRecordType = {
      type: 'record',
      fields: [],
      name: parentPathList.length > 0 ? `${parentPathList.join('_')}_record` : rootName,
    };

    if (properties !== Object(properties)) {
      return avroSchema;
    }

    return {
      ...avroSchema,
      fields: Object.entries(properties ?? {}).reduce(
        (convertedProperties, [propertyName, propertySchema]) => {
          const isRequired = Array.isArray(required) && required.includes(propertyName);

          if (isComplex(propertySchema)) {
            return convertedProperties.concat(
              convertComplexProperty(
                propertyName,
                propertySchema,
                parentPathList,
                isRequired,
              ),
            );
          } else if (isArray(propertySchema)) {
            if (
              propertySchema.items !== undefined &&
              typeof propertySchema.items !== 'boolean'
            ) {
              const convertedArrayProperty = convertArrayProperty(
                propertyName,
                propertySchema,
                parentPathList,
                isRequired,
              );
              return convertedArrayProperty ? convertedProperties.concat(convertedArrayProperty) : convertedProperties;
            }
          } else if (isJSONSchemaEnum(propertySchema)) {
            return convertedProperties.concat(
              convertEnumProperty(
                propertyName,
                propertySchema,
                parentPathList,
                isRequired,
              ),
            );
          } else {
            return convertedProperties.concat(
              convertProperty(
                propertyName,
                propertySchema,
                isRequired,
              ),
            );
          }
          return convertedProperties;
        },
        new Array<AvroSchemaField>(),
      ),
    };
  }

