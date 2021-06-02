import * as path from 'path'

const docsBase = path.resolve(__filename, '../../../../docs')
const dumpBase = path.resolve(__filename, '../../../../dump')

export function docPath (name: string): string {
  return path.resolve(docsBase, `${process.env.PORT}`, name)
}

export function dumpPath (dump: string): string {
  return path.resolve(dumpBase, `${process.env.PORT}`, dump)
}
