import { Router } from 'express'
import { chainGet, chainUpdate } from '../controllers'

export const ChainRouter = Router()

ChainRouter.get('/', chainGet)
ChainRouter.post('/', chainUpdate)
