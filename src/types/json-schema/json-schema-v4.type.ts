/**
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/json-schema/index.d.ts
 */

import { z } from 'zod';

export const JSONSchema4TypeNameSchema = z.union([
  z.literal('string'),
  z.literal('number'),
  z.literal('integer'),
  z.literal('boolean'),
  z.literal('object'),
  z.literal('array'),
  z.literal('null'),
  z.literal('any'),
]);

export const JSONSchema4ObjectSchema = z.record(z.string(), JSONSchema4TypeNameSchema);

export const JSONSchema4ArraySchema = JSONSchema4TypeNameSchema.array();

export const JSONSchema4VersionSchema = z.string();

export const JSONSchema4TypeSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  JSONSchema4ObjectSchema,
  JSONSchema4ArraySchema,
  z.null(),
]);

export const JSONSchema4BaseSchema = z.object({
  id: z.string().optional(),
  $ref: z.string().optional(),
  $schema: JSONSchema4VersionSchema.optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  default: JSONSchema4TypeSchema.optional(),
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
  required: z.union([z.boolean(), z.string().array()]).optional(),
  enum: JSONSchema4TypeSchema.array().optional(),
  type: z.union([JSONSchema4TypeNameSchema, JSONSchema4TypeNameSchema.array()]).optional(),
  extends: z.union([z.string(), z.string().array()]).optional(),
  format: z.string().optional(),
});

export type JSONSchema4 = z.infer<typeof JSONSchema4BaseSchema> & {
  items?: JSONSchema4 | JSONSchema4[] | undefined;
  additionalItems?: boolean | JSONSchema4 | undefined;
  additionalProperties?: boolean | JSONSchema4 | undefined;
  definitions?: {
    [k: string]: JSONSchema4;
  } | undefined;
  properties?: {
    [k: string]: JSONSchema4;
  } | undefined;
  patternProperties?: {
    [k: string]: JSONSchema4;
  } | undefined;
  dependencies?: {
    [k: string]: JSONSchema4 | string[];
  } | undefined;
  allOf?: JSONSchema4[] | undefined;
  anyOf?: JSONSchema4[] | undefined;
  oneOf?: JSONSchema4[] | undefined;
  not?: JSONSchema4 | undefined;
}

/**
 * @see https://zod.dev/?id=recursive-types
 */
export const JSONSchema4Schema: z.ZodType<JSONSchema4> = JSONSchema4BaseSchema.extend({
  items: z.lazy(() => z.union([JSONSchema4Schema, JSONSchema4Schema.array()]).optional()),
  additionalItems: z.lazy(() => z.union([z.boolean(), JSONSchema4Schema]).optional()),
  additionalProperties: z.lazy(() => z.union([z.boolean(), JSONSchema4Schema]).optional()),
  definitions: z.lazy(() => z.record(z.string(), JSONSchema4Schema).optional()),
  properties: z.lazy(() => z.record(z.string(), JSONSchema4Schema).optional()),
  patternProperties: z.lazy(() => z.record(z.string(), JSONSchema4Schema).optional()),
  dependencies: z.lazy(() => z.record(z.string(), z.union([JSONSchema4Schema, z.string().array()])).optional()),
  allOf: z.lazy(() => JSONSchema4Schema.array().optional()),
  anyOf: z.lazy(() => JSONSchema4Schema.array().optional()),
  oneOf: z.lazy(() => JSONSchema4Schema.array().optional()),
  not: z.lazy(() => JSONSchema4Schema.optional()),
});
