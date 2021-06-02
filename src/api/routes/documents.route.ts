import { Router } from 'express'
import { Validator, Node, Share } from '../controllers'
import { isValidator } from '../../helpers'

/**
 * /documents
 *
 * GET /:id
 * -> if validator: assemble document or send document pieces map
 * -> if node: send document chunk
 *
 * POST /:id
 * store docuement chunk
 *
 * POST /prepare/:id
 * -> if validator: redirect document to the next org with all blockchain manip
 * -> if node: do one's work on document and send back
 */
export const documentsRouter = Router()

documentsRouter.get('/:id', isValidator ? Validator.Documents.documentGet : Share.Documents.documentGet)
documentsRouter.post('/:id', Share.Documents.documentStore)
documentsRouter.post('/prepare/:id', isValidator
  ? Validator.Documents.documentPrepare
  : Node.Documents.documentPrepare
)
