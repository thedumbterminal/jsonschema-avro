import { JSONSchema } from '../types/json-schema';
import { AvroSchemaField } from '../types/avro';
import { schema as avsc } from 'avsc';
import { RE_SYMBOL } from './config';
import { JSONSchema4Type, JSONSchema6Type, JSONSchema7Type } from 'json-schema';

interface IEnumInfo {
  hasNull: boolean
  hasNonString: boolean
  symbols: string[]
}

function getEnumInfo(
  values: JSONSchema4Type[] | JSONSchema6Type[] | JSONSchema7Type[],
): IEnumInfo {
  return values.slice(0).reduce<IEnumInfo>(
    (acc, symbol) => {
      if (symbol === null) {
        return { ...acc, hasNull: true };
      }
      if (typeof symbol === 'string' && RE_SYMBOL.test(symbol)) {
        return { ...acc, symbols: [...acc.symbols, symbol] };
      }
      return { ...acc, hasNonString: true };
    },
    { symbols: new Array<string>(), hasNull: false, hasNonString: false },
  );
}

export function convertEnumProperty(
  name: string,
  parentPath: string[],
  isRequired: boolean,
  enumValues: JSONSchema4Type[] | JSONSchema6Type[] | JSONSchema7Type[],
  description = '',
  defaultValue?: JSONSchema['default'],
): AvroSchemaField {
  const path = parentPath.concat(name);
  const { hasNull, hasNonString, symbols } = getEnumInfo(enumValues);
  const propType: avsc.EnumType | 'string' = hasNonString
    ? 'string'
    : {
        type: 'enum',
        name: `${path.join('_')}_enum`,
        symbols,
      };

  const prop: AvroSchemaField = {
    name,
    doc: description,
    type: propType,
  };

  if (defaultValue !== undefined) {
    prop.default = defaultValue;
  } else if (hasNull || !isRequired) {
    if (!isRequired) {
      prop.default = null;
    }
    prop.type = ['null', propType];
  }

  return prop;
}
