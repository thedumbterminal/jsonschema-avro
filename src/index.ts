import { schema as avsc } from 'avsc';
import { JSONSchema } from './types/json-schema';
import { idToNameSpace } from './lib/idToNamespace';
import { idToName } from './lib/idToName';
import { convertProperties } from './lib/convertProperties';

function convert(jsonSchema?: JSONSchema): avsc.RecordType {
  if (!jsonSchema) {
    throw new Error('No schema given');
  }
  let fields: avsc.RecordType['fields'] = [];
  if (jsonSchema.properties !== undefined) {
    fields = convertProperties(jsonSchema);
  }
  const record: avsc.RecordType = {
    name: idToName(jsonSchema, 'main'),
    type: 'record',
    doc: jsonSchema.description,
    fields,
  };
  const nameSpace = idToNameSpace(jsonSchema);
  if (nameSpace && nameSpace.length > 0) {
    record.namespace = nameSpace;
  }
  return record;
}

export default convert;
