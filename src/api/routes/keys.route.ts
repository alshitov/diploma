import { Router } from 'express'
import { Share } from '../controllers'

/**
 * /keys
 *
 * GET /
 * send signing public key
 *
 * POST /
 * store public key
 */
export const keysRouter = Router()

keysRouter.get('/', Share.Keys.keyGet)
keysRouter.post('/', Share.Keys.keyStore)
