import { MerkleNode } from './Node'
import { sha256 } from 'js-sha256'
import { expectDefined } from '../../../helpers'

type AuditTrail = Array<{ hash: string | undefined, isRight: boolean }>

export class MerkleTree {
  private readonly nodes: Array<MerkleNode>
  private root: string

  constructor (txs: Array<string>) {
    this.nodes = txs.map(tx => new MerkleNode(sha256(tx)))
    this.root = this.calculateRoot(this.nodes)
  }

  getRoot = (): string => this.root

  getAuditTrail (tx: string) {
    const txHash = sha256(tx)
    for (let node of this.nodes) {
      if (node.getHash() === txHash) {
        return this.generateAuditTrail(node)
      }
    }
    throw new Error(`${tx} not in block`)
  }

  verifyAuditTrail (hash: string, trail: AuditTrail): boolean {
    let currentProof: string = hash
    const auditNodes = trail.slice(0, -1)
    for (let { hash: anHash, isRight } of auditNodes) {
      currentProof = sha256(isRight ? currentProof + anHash : anHash + currentProof)
    }
    return currentProof === trail[trail.length - 1]?.hash
  }

  private calculateRoot (nodes: MerkleNode[]): string {
    const nodesCount = nodes.length
    if (nodesCount === 1) {
      return expectDefined(nodes[0]).getHash()
    } else {
      const parents = []
      let i = 0
      while (i < nodesCount) {
        const left = expectDefined(nodes[i])
        const right = (i + 1) < nodesCount ? expectDefined(nodes[i + 1]) : left
        const parent = new MerkleNode(sha256(left.getHash() + right.getHash()))
        parent.setLeftChild(left)
        parent.setrightChild(right)
        parents.push(parent)
        left.setParent(parent)
        right.setParent(parent)
        i += 2
      }
      return this.calculateRoot(parents)
    }
  }

  private generateAuditTrail (node: MerkleNode, trail: AuditTrail = []): AuditTrail {
    if (node.getHash() === this.root) {
      trail.push({ hash: node.getHash(), isRight: false })
      return trail
    } else {
      if (node.getParent()?.getLeftChild()?.getHash() === node.getHash()) {
        trail.push({
          hash: node.getParent()?.getRightChild()?.getHash(),
          isRight: true
        })
      } else {
        trail.push({
          hash: node.getParent()?.getLeftChild()?.getHash(),
          isRight: false
        })
      }
      const nodeParent = node.getParent()
      if (nodeParent === undefined) {
        throw new Error()
      }
      return this.generateAuditTrail(nodeParent, trail)
    }
  }
}
