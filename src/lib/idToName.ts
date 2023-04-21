import { JSONSchema } from '../types/json-schema';
import { getSchemaId } from './getSchemaId';
import { idToUrl } from './idToUrl';
import { sanitizedSplitPath } from './sanitizedSplitPath';

export function idToName(schema: JSONSchema, fallback: string): string {
  const id = getSchemaId(schema);
  if (id) {
    const url = idToUrl(id);
    if (url.pathname) {
      return sanitizedSplitPath(url.pathname).pop() ?? '';
    }
  }
  return fallback;
}
