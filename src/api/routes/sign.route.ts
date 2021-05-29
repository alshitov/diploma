import { Router } from 'express'
import { Validator } from '../controllers'
import { isValidator, forbidden } from '../../helpers'

/**
 * /sign
 *
 * POST /
 * -> if validator: sign block
 * -> if node: send 403
 *
 */
export const signRouter = Router()

console.log(isValidator)

signRouter.post('/', isValidator
  ? Validator.Sign.signBlock
  : forbidden
)
