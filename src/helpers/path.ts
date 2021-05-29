import * as path from 'path'

const docsBase = path.resolve(__filename, '../../../docs')

export function docPath (name: string): string {
  return path.resolve(docsBase, `${process.env.PORT}`, name)
}
