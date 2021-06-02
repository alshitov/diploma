import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { api } from './api'
import * as bc from './blockchain'
import * as fs from 'fs'
import { dumpPath } from './helpers'

export const app = express()

app
  .use(cors())
  .use(helmet())
  .use('/bc', api)

export let chain: bc.Models.Chain
const chainDumpPath = dumpPath('chain.json')
if (!fs.existsSync(chainDumpPath)) {
  chain = new bc.Models.Chain()
} else {
  try {
    chain = bc.Models.chain.loadChainFromFile(chainDumpPath)
  } catch (e) {
    console.log(e)
    chain = new bc.Models.Chain()
  }
}

export let keypair: bc.ElGamal.Keypair = {
  pub: {
    general: {
      p: 0,
      g: 0
    },
    y: 0
  },
  priv: 0
}
