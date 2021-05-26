import { Transaction } from './Transaction'
import { Sign } from './Sign'
import { stringToHex, MerkleTree } from './utils'
import { sha256 } from 'js-sha256'

export class Block {
  readonly version: string
  readonly previousHash: string
  readonly txs: Transaction[]
  readonly signs: Sign[]
  readonly createdAt: Date

  private hash: string | undefined

  constructor (previousHash: string) {
    this.version = '0.0.1'
    this.txs = []
    this.signs = []
    this.createdAt = new Date()
    this.previousHash = previousHash
  }

  addTransaction (tx: Transaction): void {
    this.txs.push(tx)
  }

  addSign (sign: Sign): void {
    this.signs.push(sign)
  }

  getHash (): string {
    if (this.hash) {
      return this.hash
    } else {
      const result = this.calculateHash()
      return result
    }
  }

  private calculateHash (): string {
    const txsTreeRoot = new MerkleTree(this.txs.map(t => t.toHexString())).getRoot()
    const signsTreeRoot = new MerkleTree(this.signs.map(s => s.toHexString())).getRoot()
    const result = sha256(
      stringToHex(this.version) +
      this.previousHash +
      txsTreeRoot +
      signsTreeRoot +
      stringToHex(this.createdAt.toISOString())
    )
    this.hash = result
    return result
  }
}
