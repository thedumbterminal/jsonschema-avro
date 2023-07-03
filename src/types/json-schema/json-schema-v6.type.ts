/**
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/json-schema/index.d.ts
 */

import { z } from 'zod';

export const JSONSchema6VersionSchema = z.string();
export const JSONSchema6TypeNameSchema =  z.union([
  z.literal('string'),
  z.literal('number'),
  z.literal('integer'),
  z.literal('boolean'),
  z.literal('object'),
  z.literal('array'),
  z.literal('null'),
  z.literal('any'),
]);
export const JSONSchema6ObjectSchema = z.record(z.string(), JSONSchema6TypeNameSchema);

export const JSONSchema6ArraySchema = JSONSchema6TypeNameSchema.array();

export const JSONSchema6TypeSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  JSONSchema6ObjectSchema,
  JSONSchema6ArraySchema,
  z.null(),
]);

export const JSONSchema6BaseSchema = z.object({
  id: z.string().optional(),
  $ref: z.string().optional(),
  $schema: JSONSchema6VersionSchema.optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  default: JSONSchema6TypeSchema.optional(),
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
  enum: JSONSchema6TypeSchema.array().optional(),
  type: z.union([JSONSchema6TypeNameSchema, JSONSchema6TypeNameSchema.array()]).optional(),
  format: z.string().optional(),
  examples: JSONSchema6TypeSchema.array().optional(),
  required: z.string().array().optional(),
});


/**
 * @see https://zod.dev/?id=recursive-types
 */
export type JSONSchema6Definition = z.infer<typeof JSONSchema6Schema> | boolean;

export type JSONSchema6 = z.infer<typeof JSONSchema6BaseSchema> & {
  items?: JSONSchema6Definition | JSONSchema6Definition[] | undefined;
  additionalItems?: JSONSchema6Definition | undefined;
  additionalProperties?: JSONSchema6Definition | undefined;
  propertyNames?: JSONSchema6Definition | undefined;
  contains?: JSONSchema6Definition | undefined;
  definitions?: {
    [k: string]: JSONSchema6Definition;
  } | undefined;
  properties?: {
    [k: string]: JSONSchema6Definition;
  } | undefined;
  patternProperties?: {
    [k: string]: JSONSchema6Definition;
  } | undefined;
  dependencies?: {
    [k: string]: JSONSchema6Definition | string[];
  } | undefined;
  allOf?: JSONSchema6Definition[] | undefined;
  anyOf?: JSONSchema6Definition[] | undefined;
  oneOf?: JSONSchema6Definition[] | undefined;
  not?: JSONSchema6Definition | undefined;
}

export const JSONSchema6Schema: z.ZodType<JSONSchema6> = JSONSchema6BaseSchema.extend({
  items: z.lazy(() => z.union([JSONSchema6DefinitionSchema, JSONSchema6DefinitionSchema.array()]).optional()),
  additionalItems: z.lazy(() => JSONSchema6DefinitionSchema.optional()),
  propertyNames: z.lazy(() => JSONSchema6DefinitionSchema.optional()),
  contains: z.lazy(() => z.record(z.string(), JSONSchema6DefinitionSchema).optional()),
  additionalProperties: z.lazy(() => JSONSchema6DefinitionSchema.optional()),
  dependencies: z.lazy(() => z.record(z.string(), z.union([JSONSchema6DefinitionSchema, z.string().array()])).optional()),
  definitions: z.lazy(() => z.record(z.string(), JSONSchema6DefinitionSchema).optional()),
  properties: z.lazy(() => z.record(z.string(), JSONSchema6DefinitionSchema).optional()),
  patternProperties: z.lazy(() => z.record(z.string(), JSONSchema6DefinitionSchema).optional()),
  allOf: z.lazy(() => JSONSchema6DefinitionSchema.array().optional()),
  anyOf: z.lazy(() => JSONSchema6DefinitionSchema.array().optional()),
  oneOf: z.lazy(() => JSONSchema6DefinitionSchema.array().optional()),
  not: z.lazy(() => JSONSchema6DefinitionSchema.optional()),
});

export const JSONSchema6DefinitionSchema = z.union([JSONSchema6Schema, z.boolean()]);


