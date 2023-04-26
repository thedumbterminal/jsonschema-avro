const idUtils = (module.exports = {})

const DEFAULT_NAMESPACE = 'nonamespace.int'

idUtils._toUrl = (id) => new URL(id, `http://${DEFAULT_NAMESPACE}/`)

idUtils._sanitizedSplitPath = (path) => {
  return path
    .replace(/^\//, '')
    .replace(/\./g, '_')
    .replace(/-/g, '_')
    .split(/\//)
}

idUtils.toNameSpace = (schema) => {
  const id = schema.$id || schema.id
  if (!id) {
    return
  }
  const url = idUtils._toUrl(id)
  let nameSpace = []
  if (url.host !== DEFAULT_NAMESPACE) {
    const reverseHost = url.host.replace(/-/g, '_').split(/\./).reverse()
    nameSpace = nameSpace.concat(reverseHost)
  }
  if (url.pathname) {
    const splitPath = idUtils._sanitizedSplitPath(url.pathname)
    nameSpace = nameSpace.concat(splitPath.slice(0, splitPath.length - 1))
  }
  return nameSpace.join('.')
}

idUtils.toName = (schema, fallback) => {
  const id = schema.$id || schema.id
  if (id) {
    const url = idUtils._toUrl(id)
    if (url.pathname) {
      return idUtils._sanitizedSplitPath(url.pathname).pop()
    }
  }
  return fallback
}
