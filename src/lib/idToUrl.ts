import { DEFAULT_NAMESPACE } from './config';

export function idToUrl(id: string): URL {
  return new URL(id, `http://${DEFAULT_NAMESPACE}/`);
}
