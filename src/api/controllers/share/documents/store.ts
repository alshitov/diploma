import { Response } from 'express'
import { docPath } from '../../../../helpers'
import * as fs from 'fs'
import { CustomRequest } from '../../../../helpers'

interface DocumentStore {
  document: string
  index: number
}

export async function documentStore (req: CustomRequest<DocumentStore>, res: Response) {
  console.log('----Received', req.body.document, 'to store')
  const documentId = req.params.id
  if (documentId === undefined || documentId.replace(/ /g, '') === '') {
    res.status(400).send('id is mandatory field')
    return
  }
  const { document, index } = req.body
  const documentPath = docPath(`${documentId}-${index}`)
  try {
    fs.writeFileSync(documentPath, document)
  } catch (e) {
    console.log(e)
    res.status(500).send('error while saving file')
    return
  }
  console.log('************************************************')
  res.status(200).json({ id: documentId })
}
