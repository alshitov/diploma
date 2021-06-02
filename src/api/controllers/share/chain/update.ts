import { Response } from 'express'
import { chain } from '../../../../app'
import { CustomRequest, dumpChain } from '../../../../helpers'
import { Models } from '../../../../blockchain'

interface ChainUpdate {
  chain: Models.Chain
}

export async function chainUpdate (req: CustomRequest<ChainUpdate>, res: Response) {
  const newChain = req.body.chain
  console.log('----Received new chain', newChain)
  chain.update(newChain) // Unsecure - for test only
  dumpChain(chain)
  console.log('************************************************')
  res.sendStatus(200)
}
