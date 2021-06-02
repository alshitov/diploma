import { Router } from 'express'
import { Validator, Share } from '../controllers'
import { isValidator, forbidden  } from '../../helpers'

/**
 * /chain
 *
 * GET /:id
 * -> if validator: send current blockchain
 * -> if node: send 403
 *
 * POST /:id
 * update current blockchain
 *
 * POST /tx
 * receive new transaction
 */
export const chainRouter = Router()

chainRouter.get('/', isValidator
  ? Validator.Chain.chainGet
  : forbidden
)
chainRouter.post('/', Share.Chain.chainUpdate)
chainRouter.post('/tx', Share.Chain.txReceive)
