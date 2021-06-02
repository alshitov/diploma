import { Request, Response } from 'express'
import { keypair } from '../../../../app'

export async function keyGet (_req: Request, res: Response) {
  if (keypair === undefined) {
    res.status(500).send('Keys not initialized')
    return
  }
  res.status(200).send({ keys: keypair }) // do not share private key!
}
