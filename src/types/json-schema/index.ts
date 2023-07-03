import { z } from 'zod'
import {
  JSONSchema4Schema,
  JSONSchema4TypeNameSchema,
  JSONSchema4TypeSchema,
} from './json-schema-v4.type'
import {
  JSONSchema6Schema,
  JSONSchema6TypeNameSchema,
} from './json-schema-v6.type'
import {
  JSONSchema7Schema,
  JSONSchema7TypeNameSchema,
} from './json-schema-v7.type'

/**
 * Validation for JSON schemas
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/json-schema/index.d.ts
 */

export const JSONSchemaSchema = z.union([
  JSONSchema4Schema,
  JSONSchema6Schema,
  JSONSchema7Schema,
])
export type JSONSchema = z.infer<typeof JSONSchemaSchema>

export const JSONSchemaArraySchema = JSONSchemaSchema.and(
  z.object({
    type: z.literal('array'),
    items: z
      .union([JSONSchemaSchema, JSONSchemaSchema.array(), z.boolean()])
      .optional(),
  })
)
export type JSONSchemaArray = z.infer<typeof JSONSchemaArraySchema>
export const isArray = (property: any): property is JSONSchemaArray => {
  const result = JSONSchemaArraySchema.safeParse(property)
  return result.success
}

export const JSONSchemaComplexSchema = JSONSchemaSchema.and(
  z.object({
    type: z.literal('object'),
  })
)
export type JSONSchemaComplex = z.infer<typeof JSONSchemaComplexSchema>
export const isComplex = (property: any): property is JSONSchemaComplex =>
  JSONSchemaComplexSchema.safeParse(property).success

export const JSONSchemaTypedSchema = JSONSchemaSchema.and(
  z.object({
    type: z.union([
      JSONSchema4TypeNameSchema,
      JSONSchema4TypeNameSchema.array(),
      JSONSchema6TypeNameSchema,
      JSONSchema6TypeNameSchema.array(),
      JSONSchema7TypeNameSchema,
      JSONSchema7TypeNameSchema.array(),
    ]),
  })
)
export type JSONSchemaTyped = z.infer<typeof JSONSchemaTypedSchema>
export const isJSONSchemaTyped = (property: any): property is JSONSchemaTyped =>
  JSONSchemaTypedSchema.safeParse(property).success

export const JSONSchemaEnumSchema = JSONSchemaSchema.and(
  z.object({
    enum: z.union([
      JSONSchema4TypeSchema.array(),
      JSONSchema6TypeNameSchema.array(),
      JSONSchema7TypeNameSchema.array(),
    ]),
  })
)
export type JSONSchemaEnum = z.infer<typeof JSONSchemaEnumSchema>
export const isJSONSchemaEnum = (property: any): property is JSONSchemaEnum =>
  JSONSchemaEnumSchema.safeParse(property).success
