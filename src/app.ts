import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { api } from './api'

export const app = express()

app
  .use(cors())
  .use(helmet())
  .use('/api/v1', api)
