import { Request, Response } from 'express'
import { address, expectDefined } from '../../../../helpers'
import { chain, keypair } from '../../../../app'
import { Models, ElGamal } from '../../../../blockchain'
import axios from 'axios'

export async function documentGet (req: Request, res: Response) {
  const documentId = req.params.id
  if (documentId === undefined || documentId.replace(/ /g, '') === '') {
    res.status(400).send('id is mandatory field')
    return
  }
  const transactionCreate = chain.findTransaction(documentId, 'CREATE') as Models.tx.TransactionCreate
  const transactionReady = chain.findTransaction(documentId, 'READY') as Models.tx.TransactionReady
  const documentMap = transactionReady.documentMap
  const documentType = transactionCreate.documentType
  if (documentType === 'GENERAL') {
    console.log("---Document type is 'GENERAL'")
    console.log('Sending document map back')
    res.status(200).json({ documentType, documentMap })
    return
  } else {
    console.log("---Document type is 'LIMITED'")
    const validatorAddress = transactionCreate.validatorAddress
    if (address() === validatorAddress) {
      console.log('Collecting document chunks from nodes...')
      const chunks = []
      for (let i = 0; i < Object.keys(documentMap).length; i++) {
        const chunkAddresses = expectDefined(documentMap[i])
        let addressesIndex: number = 0
        let chunkReceived: boolean = false
        while (!chunkReceived) {
          if (addressesIndex === chunkAddresses.length -1) {
            console.log(`FAIL. Unable to receive chunk #${i}`)
            res.status(500)
            return
          }
          const nextAddress = expectDefined(chunkAddresses[addressesIndex++])
          console.log(`Trying to get chunk #${i} from ${nextAddress}...`)
          const answer = (await axios.get<{ document: string }>(`http://${nextAddress}/bc/documents/${documentId}-${i}`))
          if (answer.status === 200) {
            const data = answer.data.document
            console.log('OK. Received:', data)
            chunkReceived = true
            addressesIndex = 0
            chunks.push(data)
            break
          } else {
            console.log('Failed. Go to the next address')
          }
        }
      }
      const document = chunks.map(chunk => `${ElGamal.decrypt(keypair, (JSON.parse(chunk) as ElGamal.Cipher))}`).join('')
      console.log('----Sending document', document)
      res.status(200).send({ document })
      console.log('************************************************')
      return
    } else {
      console.log(`---Wrong validator requested - redirecting request to ${transactionCreate.validatorAddress}...`)
      console.log('************************************************')
      res.redirect(307, `http://${transactionCreate.validatorAddress}/bc/documents/${documentId}`)
      return
    }
  }
}
