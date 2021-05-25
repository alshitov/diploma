import { Node } from './Node'

export interface Tree {
  nodes: Node[]
  root: Node
}

type AuditTrail {

}

const CHUNK_SIZE = 128 // bytes

export function makeTree (data: string): Tree {
  const content = Buffer.from(data)
  let chunks: string[] = []
  for (let pos = 0; pos < content.length; pos += CHUNK_SIZE) {
    const next = content.slice(pos, pos + CHUNK_SIZE)
    next.to


  }
}

export function getRoot (tree: Tree): Node {

}

export function getAuditTrail (chunkHash: string): AuditTrail {

}

export function generateAuditTrail (): AuditTrail {

}

export function verifyAuditTrail (trail: AuditTrail): string {

}
