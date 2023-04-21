import { JSONSchema } from '../types/json-schema';
import { getSchemaId } from './getSchemaId';
import { idToUrl } from './idToUrl';
import { DEFAULT_NAMESPACE } from './config';
import { sanitizedSplitPath } from './sanitizedSplitPath';

export function idToNameSpace(schema: JSONSchema): string | undefined {
  const id = getSchemaId(schema);
  if (id === undefined) {
    return undefined;
  }
  const url = idToUrl(id);
  let nameSpace = new Array<string>();
  if (url.host !== DEFAULT_NAMESPACE) {
    const reverseHost = url.host.replace(/-/g, '_').split(/\./).reverse();
    nameSpace = nameSpace.concat(reverseHost);
  }
  if (url.pathname.length > 0) {
    const splitPath = sanitizedSplitPath(url.pathname);
    nameSpace = nameSpace.concat(splitPath.slice(0, splitPath.length - 1));
  }
  return nameSpace.join('.');
}
