import { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema';

export type JSONSchema = JSONSchema4 | JSONSchema6 | JSONSchema7

export const isComplex = (property: JSONSchema): boolean =>
  property.type === 'object';
export const isArray = (property: JSONSchema): boolean =>
  property.type === 'array' && property.items !== undefined;
