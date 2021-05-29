import { Router } from 'express'
import { Validator, Node, Share } from '../controllers'
import multer from 'multer'
import { isValidator, forbidden } from '../../helpers'

const upload = multer()

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
 * POST /:redirect/:id
 * -> if validator: redirect document to the next org with all blockchain manip
 * -> if node: send 403
 */
export const documentsRouter = Router()

documentsRouter.get('/:id', isValidator ? Validator.Documents.documentGet : Node.Documents.documentGet)
documentsRouter.post('/:id', upload.single('document'), Share.Documents.documentStore)
documentsRouter.post('/redirect/:id', isValidator
  ? Validator.Documents.redirectDocument
  : forbidden
)
