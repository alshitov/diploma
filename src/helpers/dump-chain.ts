import { dumpPath } from './path'
import { Models } from '../blockchain'
import fs from 'fs'

export function dumpChain (chain: Models.Chain): void {
  try {
    console.log('Dump chain...')
    fs.writeFileSync(dumpPath('chain.json'), JSON.stringify({
      blocks: chain.getBlocks(),
      currentBlock: chain.getCurrentBlock()
    }))
  } catch (e) {
    console.log(e)
  }
}
