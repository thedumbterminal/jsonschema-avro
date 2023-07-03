/**
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/json-schema/index.d.ts
 */

import { z } from 'zod';

export const JSONSchema7VersionSchema = z.string();
export const JSONSchema7TypeNameSchema =  z.union([
  z.literal('string'),
  z.literal('number'),
  z.literal('integer'),
  z.literal('boolean'),
  z.literal('object'),
  z.literal('array'),
  z.literal('null'),
]);
export const JSONSchema7ObjectSchema = z.record(z.string(), JSONSchema7TypeNameSchema);

export const JSONSchema7ArraySchema = JSONSchema7TypeNameSchema.array();

export const JSONSchema7TypeSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  JSONSchema7ObjectSchema,
  JSONSchema7ArraySchema,
  z.null(),
]);

export const JSONSchema7BaseSchema = z.object({
  id: z.string().optional(),
  $ref: z.string().optional(),
  $schema: JSONSchema7VersionSchema.optional(),
  $comment: z.string().optional(),
  type: z.union([JSONSchema7TypeNameSchema, JSONSchema7TypeNameSchema.array()]).optional(),
  enum: JSONSchema7TypeSchema.array().optional(),
  const: JSONSchema7TypeSchema.optional(),
  multipleOf: z.number().optional(),
  maximum: z.number().optional(),
  exclusiveMaximum: z.boolean().optional(),
  minimum: z.number().optional(),
  exclusiveMinimum: z.boolean().optional(),
  maxLength: z.number().optional(),
  minLength: z.number().optional(),
  pattern: z.string().optional(),
  maxItems: z.number().optional(),
  minItems: z.number().optional(),
  uniqueItems: z.boolean().optional(),
  maxProperties: z.number().optional(),
  minProperties: z.number().optional(),
  required: z.string().array().optional(),
  format: z.string().optional(),
  contentMediaType: z.string().optional(),
  contentEncoding: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  default: JSONSchema7TypeSchema.optional(),
  readOnly: z.boolean().optional(),
  writeOnly: z.boolean().optional(),
  examples: JSONSchema7TypeSchema.array().optional(),
});


/**
 * @see https://zod.dev/?id=recursive-types
 */
export type JSONSchema7Definition = z.infer<typeof JSONSchema7Schema> | boolean;

export type JSONSchema7 = z.infer<typeof JSONSchema7BaseSchema> & {
  $defs?: {
    [key: string]: JSONSchema7Definition;
  } | undefined;
  items?: JSONSchema7Definition | JSONSchema7Definition[] | undefined;
  additionalItems?: JSONSchema7Definition | undefined;
  contains?: JSONSchema7Definition | undefined;
  properties?: {
    [k: string]: JSONSchema7Definition;
  } | undefined;
  patternProperties?: {
    [k: string]: JSONSchema7Definition;
  } | undefined;
  additionalProperties?: JSONSchema7Definition | undefined;
  dependencies?: {
    [k: string]: JSONSchema7Definition | string[];
  } | undefined;
  propertyNames?: JSONSchema7Definition | undefined;
  if?: JSONSchema7Definition | undefined;
  then?: JSONSchema7Definition | undefined;
  else?: JSONSchema7Definition | undefined;
  allOf?: JSONSchema7Definition[] | undefined;
  anyOf?: JSONSchema7Definition[] | undefined;
  oneOf?: JSONSchema7Definition[] | undefined;
  not?: JSONSchema7Definition | undefined;
  definitions?: {
    [k: string]: JSONSchema7Definition;
  } | undefined;
}

export const JSONSchema7Schema: z.ZodType<JSONSchema7> = JSONSchema7BaseSchema.extend({
  $defs: z.lazy(() => z.record(z.string(), JSONSchema7DefinitionSchema).optional()),
  items: z.lazy(() => z.union([JSONSchema7DefinitionSchema, JSONSchema7DefinitionSchema.array()]).optional()),
  additionalItems: z.lazy(() => JSONSchema7DefinitionSchema.optional()),
  contains: z.lazy(() => z.record(z.string(), JSONSchema7DefinitionSchema).optional()),
  properties: z.lazy(() => z.record(z.string(), JSONSchema7DefinitionSchema).optional()),
  patternProperties: z.lazy(() => z.record(z.string(), JSONSchema7DefinitionSchema).optional()),
  additionalProperties: z.lazy(() => JSONSchema7DefinitionSchema.optional()),
  dependencies: z.lazy(() => z.record(z.string(), z.union([JSONSchema7DefinitionSchema, z.string().array()])).optional()),
  propertyNames: z.lazy(() => JSONSchema7DefinitionSchema.optional()),
  if: z.lazy(() => JSONSchema7DefinitionSchema.optional()),
  then: z.lazy(() => JSONSchema7DefinitionSchema.optional()),
  else: z.lazy(() => JSONSchema7DefinitionSchema.optional()),
  allOf: z.lazy(() => JSONSchema7DefinitionSchema.array().optional()),
  anyOf: z.lazy(() => JSONSchema7DefinitionSchema.array().optional()),
  oneOf: z.lazy(() => JSONSchema7DefinitionSchema.array().optional()),
  not: z.lazy(() => JSONSchema7DefinitionSchema.optional()),
  definitions: z.lazy(() => z.record(z.string(), JSONSchema7DefinitionSchema).optional()),
});

export const JSONSchema7DefinitionSchema = z.union([JSONSchema7Schema, z.boolean()]);
