export function sanitizedSplitPath(path: string): string[] {
  return path
    .replace(/^\//, '')
    .replace(/\./g, '_')
    .replace(/-/g, '_')
    .split(/\//);
}
