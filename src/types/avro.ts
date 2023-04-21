import { schema as avsc, Type } from 'avsc';

export type AvroSchemaField = avsc.RecordType['fields'][number]
export type AvroTypeOrSchema = Type | avsc.AvroSchema // same as Schema from avsc, not exposed
