// Json schema on the left, avro on the right
export const typeMapping: { [k: string]: string | undefined } = {
  string: 'string',
  null: 'null',
  boolean: 'boolean',
  integer: 'long',
  number: 'double',
};
