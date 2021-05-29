import { Block } from './Block'
import { TransactionCreate } from './Transaction'

export class Chain {
  private readonly blocks: Block[]

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
    this.blocks.push(genesisBlock)
  }

  addBlock (block: Block) {
    this.blocks.push(block)
  }
}
