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
  try {
    const document = fs.readFileSync(documentPath, 'utf-8')
    console.log(`----Sending document with id: ${documentId}`)
    res.status(200).json({ document })
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
    return
  }
}
