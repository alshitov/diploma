import { Response } from 'express'
import { CustomRequest } from '../../../../helpers'
import * as bc from '../../../../blockchain'
import { keypair } from '../../../../app'

interface KeyStore {
  pubK: bc.ElGamal.GeneralPubK
}

export async function keyStore (req: CustomRequest<KeyStore>, res: Response) {
  console.log('----Received keys', req.body.pubK)
  const { p, g } = req.body.pubK
  const x = bc.ElGamal.getRandomInt(1, p - 1)
  console.log('----Generated private key:', x)
  const y = bc.ElGamal.modpow(g, x, p)
  console.log('----Generated public key:', y)
  keypair.pub.general = req.body.pubK
  keypair.pub.y = y
  keypair.priv = x
  console.log('************************************************')
  res.status(200).send({ pubK: keypair.pub })
}
