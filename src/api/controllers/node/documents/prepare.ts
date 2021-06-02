import { Response } from 'express'
import { CustomRequest, address, expectDefined } from '../../../../helpers'
import { Models, ElGamal } from '../../../../blockchain'
import { keypair, chain } from '../../../../app'
import axios from 'axios'
// import { hexlify } from '../../../../blockchain'
// import { sha256 } from 'js-sha256'

interface DocumentPrepare {
  tx: Models.Transaction
  cipher: ElGamal.Cipher
  sign: ElGamal.Sign
  y: number
}

function handle (destPubKey: ElGamal.PubK, document: /*string*/number, newTx: Models.Transaction): DocumentPrepare {
  const documentEncrypted = ElGamal.encrypt(destPubKey, document)
  // const message = {
  //   tx: transactionReady,
  //   cipher: documentEncrypted
  // }
  // const messageHash = sha256(hexlify.objectToHex(message))
  const messageHash = 322 // test
  const sign = ElGamal.sign(messageHash, keypair)
  return {
    tx: newTx,
    cipher: documentEncrypted,
    sign,
    y: keypair.pub.y
  }
}

export async function documentPrepare (req: CustomRequest<DocumentPrepare>, res: Response) {
  const documentId = req.params.id
  if (documentId === undefined || documentId.replace(/ /g, '') === '') {
    res.status(400).send('id is mandatory field')
    return
  }
  // const { tx, cipher, sign, y }  = req.body
  const { tx, cipher }  = req.body
  // const message = {
  //   tx: transactionReady,
  //   cipher: documentEncrypted
  // }
  // const messageHash = sha256(hexlify.objectToHex(message))
  // const signValid = ElGamal.validateSign(
  //   messageHash,
  //   { y, general: keypair.pub.general },
  //   sign
  // )
  const signValid = true // test
  console.log('----Validating message sign...', signValid)
  if (!signValid) {
    res.status(500).send('Sign is not valid')
    return
  }
  const document = ElGamal.decrypt(keypair, cipher)
  console.log('----Decrypted document:', document)
  const updatedDocument = document + parseInt(expectDefined(process.env.PORT)) // test
  console.log('----Updated document', updatedDocument)

  const myAddress = address()

  let transactionCreate: Models.tx.TransactionCreate
  let myIndex: number

  switch (tx.type) {
    case 'CREATE':
      transactionCreate = tx as Models.tx.TransactionCreate
      myIndex = transactionCreate.strategy.indexOf(myAddress)

      if (myIndex === transactionCreate.strategy.length - 1) {
        console.log("----Sending new transaction 'READY' to validator")
        axios.post(
          `http://${transactionCreate.validatorAddress}/bc/documents/prepare/${documentId}`,
          handle(
            (await axios.get<{ keys: ElGamal.Keypair }>(`http://${transactionCreate.validatorAddress}/bc/keys`)).data.keys.pub,
            updatedDocument,
            new Models.tx.TransactionReady(
              documentId,
              myAddress,
              transactionCreate.validatorAddress
            )
          )
        )
      } else {
        const nextUnit = expectDefined(transactionCreate.strategy[myIndex + 1])
        const [nextUnitHost, nextUnitPort] = nextUnit.split(':')
        const nextUnitAddress = `${nextUnitHost}:${nextUnitPort}`
        console.log(nextUnitAddress)
        console.log("----Sending new transaction 'EDIT' to validator")
        axios.post(
          `http://${transactionCreate.validatorAddress}/bc/documents/prepare/${documentId}`,
          handle(
            (await axios.get<{ keys: ElGamal.Keypair }>(`http://${nextUnitAddress}/bc/keys`)).data.keys.pub,
            updatedDocument,
            new Models.tx.TransactionEdit(
              documentId,
              myAddress,
              nextUnitAddress
            )
          )
        )
      }
      break
    case 'EDIT':
      const transactionEdit =  tx as Models.tx.TransactionEdit
      transactionCreate = chain.findTransaction(transactionEdit.documentId, 'CREATE') as Models.tx.TransactionCreate
      myIndex = transactionCreate.strategy.indexOf(myAddress)

      if (myIndex === transactionCreate.strategy.length - 1) {
        const validatorKeys = (await axios.get<{ keys: ElGamal.Keypair }>(`http://${transactionCreate.validatorAddress}/bc/keys`)).data.keys
        console.log("----Sending new transaction 'READY' to validator")
        axios.post(
          `http://${transactionCreate.validatorAddress}/bc/documents/prepare/${documentId}`,
          handle(
            validatorKeys.pub,
            updatedDocument,
            new Models.tx.TransactionReady(
              documentId,
              myAddress,
              transactionCreate.validatorAddress
            )
          )
        )
      } else {
        const nextUnit = expectDefined(transactionCreate.strategy[myIndex + 1])
        const [nextUnitHost, nextUnitPort] = nextUnit.split(':')
        const nextUnitAddress = `${nextUnitHost}:${nextUnitPort}`
        console.log(nextUnitAddress)
        console.log("----Sending new transaction 'EDIT' to validator")
        axios.post(
          `http://${transactionCreate.validatorAddress}/bc/documents/prepare/${documentId}`,
          handle(
            (await axios.get<{ keys: ElGamal.Keypair }>(`http://${nextUnitAddress}/bc/keys`)).data.keys.pub,
            updatedDocument,
            new Models.tx.TransactionEdit(
              documentId,
              myAddress,
              nextUnitAddress
            )
          )
        )
      }
      break
    default: {
      res.status(500).send('Received unknown transaction type')
      return
    }
  }
  console.log('************************************************')
  res.sendStatus(200)
}
