import { Response } from 'express'
import { Models, ElGamal, /* hexlify */ } from '../../../../blockchain'
import { CustomRequest } from '../../../../helpers'
import { keypair } from '../../../../app'
// import { sha256 } from 'js-sha256'

interface SignBlock {
  block: Models.Block
}

export async function signBlock (req: CustomRequest<SignBlock>, res: Response) {
  console.log('----Received block to sign')
  // const blockToSign = req.body.block
  // const mHash = sha256(hexlify.objectToHex(blockToSign))
  const mHash = '0x462' // test
  const sign = ElGamal.sign(parseInt(mHash, 16), keypair)
  console.log('Created block sign:', sign)
  console.log('************************************************')
  res.status(200).send({ sign: JSON.stringify(sign), key: keypair.pub.y })
  return
}
