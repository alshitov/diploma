import { Block } from './Block'
import { TransactionCreate, TransactionType, Transaction } from './Transaction'
import * as fs from 'fs'
import { expectDefined } from '../../helpers'
import { Sign } from './Sign'

export class Chain {
  blocks: Block[]
  currentBlock: Block

  constructor () {
    this.blocks = []
    const genesisBlock = new Block('This is my genesis block')
    genesisBlock.addTransaction(new TransactionCreate(
      'Genesis document id',
      'Genesis sender address',
      'Genesis receiver address',
      'Genesis validator address',
      'GENERAL',
      ['Some', 'Genesis', 'Strategy']
    ))
    genesisBlock.addSign(new Sign('Genesis block sign', '0.0.0.0:0'))
    this.currentBlock = new Block(genesisBlock.getHash())
    this.blocks.push(genesisBlock)
  }

  addBlock (block: Block) {
    this.blocks.push(block)
  }

  getBlocks (): Block[] {
    return this.blocks
  }

  length (): number {
    return this.blocks.length
  }

  setCurrentBlock (block: Block)  {
    // For test only
    this.currentBlock = block
  }

  getCurrentBlock (): Block {
    return this.currentBlock
  }

  findTransaction (documentId: string, type: TransactionType): Transaction {
    const txFilter = (t: Transaction) => t.documentId === documentId && t.type === type
    const foundInCurrentBlock = this.currentBlock.txs.filter(txFilter)
    if (foundInCurrentBlock.length !== 0) {
      return expectDefined(foundInCurrentBlock[0])
    } else {
      for (let block of this.blocks) {
        const foundInBlock = block.txs.filter(txFilter)
        if (foundInBlock) {
          return expectDefined(foundInBlock[0])
        }
      }
    }
    throw new Error('Transaction with given document id and type not found')
  }

  update (newChain: Chain): void {
    this.blocks = [...newChain.blocks]
    this.currentBlock = newChain.currentBlock
  }
}

export function loadChainFromFile (fp: string): Chain {
  let chain = new Chain()
  const dump = JSON.parse(fs.readFileSync(fp).toString('utf-8'))
  const dumpedBlocks = dump.blocks as Block[]
  dumpedBlocks.map(b => b.previousHash !== 'This is my genesis block' ? chain.addBlock(b): () => {})
  const dumpedCurrentBlock = dump.currentBlock as Block
  chain.setCurrentBlock(new Block(
    dumpedCurrentBlock.previousHash,
    dumpedCurrentBlock.txs,
    dumpedCurrentBlock.signs,
    dumpedCurrentBlock.createdAt
  ))
  return chain
}
