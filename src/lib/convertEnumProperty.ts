import { JSONSchemaEnum } from '../types/json-schema'
import { schema as avsc } from 'avsc'
import { JSONSchema4Type, JSONSchema6Type, JSONSchema7Type } from 'json-schema'
import { AvroSchemaField } from '../types/avro/avro'
import { setTypeAndDefault } from './setTypeAndDefault'

export const RE_SYMBOL = /^[A-Za-z_][A-Za-z0-9_]*$/

interface IEnumInfo {
  hasNull: boolean
  hasNonString: boolean
  symbols: string[]
}

function getEnumInfo(
  values: JSONSchema4Type[] | JSONSchema6Type[] | JSONSchema7Type[]
): IEnumInfo {
  return values.slice(0).reduce<IEnumInfo>(
    (acc, symbol) => {
      if (symbol === null) {
        return { ...acc, hasNull: true }
      }
      if (typeof symbol === 'string' && RE_SYMBOL.test(symbol)) {
        return { ...acc, symbols: [...acc.symbols, symbol] }
      }
      return { ...acc, hasNonString: true }
    },
    { symbols: new Array<string>(), hasNull: false, hasNonString: false }
  )
}

export function convertEnumProperty(
  itemName: string,
  jsonSchema: JSONSchemaEnum,
  parentPathList: string[],
  isRequired: boolean
): AvroSchemaField {
  const pathList = parentPathList.concat(itemName)
  const { hasNull, hasNonString, symbols } = getEnumInfo(jsonSchema.enum)
  const propType: avsc.EnumType | 'string' = hasNonString
    ? 'string'
    : {
        type: 'enum',
        name: `${pathList.join('_')}_enum`,
        symbols,
      }

  const prop: AvroSchemaField = {
    name: itemName,
    type: propType,
  }

  if (jsonSchema.description) {
    prop.doc = jsonSchema.description
  }

  if ((hasNull || !isRequired) && typeof propType === 'string') {
    if (!isRequired) {
      prop.default = null
    }
    prop.type = ['null', propType]
  }

  return setTypeAndDefault(prop, jsonSchema, isRequired)
}
