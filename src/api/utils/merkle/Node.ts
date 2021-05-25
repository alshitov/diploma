import { createHash } from 'crypto'

export interface Node {
  hash: string
  leftChild: Node | null
  rightChild: Node | null
  parent: Node | null
}

export function computeHash (data: string): string {
  const hashF = createHash('sha-256')
  hashF.update(data, 'utf-8')
  return hashF.digest().toString()
}
