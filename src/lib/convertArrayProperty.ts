import {
  isArray,
  isComplex,
  isJSONSchemaEnum,
  JSONSchemaArray, JSONSchemaTyped,
} from '../types/json-schema'
import { convertProperties } from './convertProperties'
import { convertEnumProperty } from './convertEnumProperty'
import { setTypeAndDefault } from './setTypeAndDefault'
import { AvroSchemaArrayField, AvroSchemaType } from '../types/avro/avro'

function convertArrayItems(
  itemName: string,
  jsonSchema: JSONSchemaArray,
  parentPathList: string[]
): AvroSchemaType {
  const pathList = parentPathList.concat(itemName)

  if (isComplex(jsonSchema.items) || isArray(jsonSchema.items)) {
    return convertProperties(jsonSchema.items, pathList)
  } else if (isJSONSchemaEnum(jsonSchema.items)) {
    return convertEnumProperty(itemName, jsonSchema.items, parentPathList, true)
      .type
  }
  const type = (<JSONSchemaTyped>jsonSchema?.items)?.type
  return setTypeAndDefault({ type }, jsonSchema, true).type
}

export function convertArrayProperty(
  itemName: string,
  jsonSchema: JSONSchemaArray,
  parentPathList: string[],
  isRequired: boolean
): AvroSchemaArrayField {
  const avroSchema: AvroSchemaArrayField = {
    name: itemName,
    type: {
      type: 'array',
      items: convertArrayItems(itemName, jsonSchema, parentPathList),
    },
    ...(jsonSchema.description && { doc: jsonSchema.description }),
  }
  return setTypeAndDefault(avroSchema, jsonSchema, isRequired)
}
