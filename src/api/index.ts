import express from 'express'
import * as bodyParser from 'body-parser'
import {
  chainRouter,
  documentsRouter,
  signRouter
} from './routes'

const urlencodedParser = bodyParser.urlencoded({ extended: true })
const jsonParser = bodyParser.json()

export const api = express()

api
  .use(urlencodedParser)
  .use(jsonParser)
  .use('/chain', chainRouter)
  .use('/documents', documentsRouter)
  .use('/sign', signRouter)
