import { Request, Response } from 'express'
import { docPath } from '../../../../helpers'
import * as fs from 'fs'

export async function documentStore (req: Request, res: Response) {
  const documentId = req.body.id
  if (documentId === undefined) {
    res.status(400).send('id is mandatory field')
    return
  }
  if (req.file?.buffer == null) {
    res.status(400).send('document is mandatory field')
    return
  }
  const documentPath = docPath(documentId)
  try {
    fs.writeFileSync(documentPath, req.file.buffer)
  } catch (e) {
    console.log(e)
    res.status(500).send('error while saving file')
    return
  }
  res.status(200).json({ id: documentId })
}
