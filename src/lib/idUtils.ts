import { JSONSchema } from '../types/json-schema'
import { getSchemaId } from './getSchemaId'

export const DEFAULT_NAMESPACE = 'nonamespace.int'

function sanitizedSplitPath(path: string): string[] {
  return path
    .replace(/^\//, '')
    .replace(/\./g, '_')
    .replace(/-/g, '_')
    .split(/\//)
}

export function idToUrl(id: string): URL {
  return new URL(id, `http://${DEFAULT_NAMESPACE}/`)
}

export function idToNameSpace(schema: JSONSchema): string | undefined {
  const id = getSchemaId(schema)
  if (id === undefined) {
    return undefined
  }
  const url = idToUrl(id)
  let nameSpace = new Array<string>()
  if (url.host !== DEFAULT_NAMESPACE) {
    const reverseHost = url.host.replace(/-/g, '_').split(/\./).reverse()
    nameSpace = nameSpace.concat(reverseHost)
  }
  if (url.pathname.length > 0) {
    const splitPath = sanitizedSplitPath(url.pathname)
    nameSpace = nameSpace.concat(splitPath.slice(0, splitPath.length - 1))
  }
  return nameSpace.join('.')
}

export function idToName(schema: JSONSchema, fallback: string): string {
  const id = getSchemaId(schema)
  if (id) {
    const url = idToUrl(id)
    if (url.pathname) {
      return sanitizedSplitPath(url.pathname).pop() || fallback
    }
  }
  return fallback
}
