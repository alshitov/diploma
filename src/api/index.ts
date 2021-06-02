import express, { Response } from 'express'
import * as bodyParser from 'body-parser'
import {
  chainRouter,
  documentsRouter,
  signRouter,
  keysRouter
} from './routes'
import { CustomRequest, isValidator } from '../helpers'
import { getNetwork, pingAddress } from '../helpers'
import { keypair, chain } from '../app'

const urlencodedParser = bodyParser.urlencoded({ extended: true })
const jsonParser = bodyParser.json()

export const api = express()

interface Ping {
  port: string
}

export const network = getNetwork()

const ping = (req: CustomRequest<Ping>, res: Response) => {
  const host = req.hostname
  const port = req.body.port
  console.log(`Ping request received from: ${host}:${port}`)
  if (!network.exists(host, port)) {
    console.log(`Pinging ${host}:${port} back...`)
    pingAddress(host, port)
      .then(data => {
        if (data.available) {
          const address = { host, port }
          data.validator ? network.addValidator(address) : network.addNode(address)
        }
      })
      .catch(_e => {})
  }
  res.status(200).send({ validator: isValidator })
}

api
  .use(urlencodedParser)
  .use(jsonParser)
  .post('/ping', ping)
  .get('/show-network', (_req, res) => {
    console.log(network)
    res.sendStatus(200)
  })
  .get('/show-key', (_req, res) => {
    console.log(keypair)
    res.sendStatus(200)
  })
  .get('/show-chain', (_req, res) => {
    console.log(chain)
    res.sendStatus(200)
  })
  .use('/chain', chainRouter)
  .use('/documents', documentsRouter)
  .use('/sign', signRouter)
  .use('/keys', keysRouter)
