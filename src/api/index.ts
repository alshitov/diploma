import express from 'express'
import * as bodyParser from 'body-parser'

const urlencodedParser = bodyParser.urlencoded({ extended: true })
const jsonParser = bodyParser.json()

export const api = express()

api
  .use(urlencodedParser)
  .use(jsonParser)
