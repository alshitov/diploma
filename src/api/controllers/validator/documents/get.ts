import { Request, Response } from 'express'
import * as fs from 'fs'
import { expectDefined, docPath } from '../../../../helpers'

export async function documentGet (req: Request, res: Response) {
  const { params } = req
  const documentId = expectDefined(params.id)
  const documentPath = docPath(documentId)
  if (!fs.existsSync(documentPath)) {
    res.sendStatus(404)
    return
  }
  res.sendFile(documentPath)
}
