import { Response } from 'express'
import { Models } from '../../../../blockchain'
import { CustomRequest, expectDefined, placeStrategy, chunkSubstr, dumpChain } from '../../../../helpers'
import { ElGamal } from '../../../../blockchain'
import { /* keypair, */ chain, keypair } from '../../../../app'
import axios from 'axios'
import { network } from '../../../../api'

interface DocumentPrepare {
  tx: Models.Transaction
  cipher: ElGamal.Cipher
  sign: ElGamal.Sign
  y: number
}

export async function documentPrepare (req: CustomRequest<DocumentPrepare>, res: Response) {
  const documentId = req.params.id
  if (documentId === undefined || documentId.replace(/ /g, '') === '') {
    res.status(400).send('id is mandatory field')
    return
  }
  const { tx, cipher, sign, y }  = req.body
  // const message = {
  //   tx,
  //   cipher
  // }
  // const messageHash = sha256(hexlify.objectToHex(message))
  // const signValid = ElGamal.validateSign(
  //   messageHash,
  //   { y, general: keypair.pub.general },
  //   sign
  // )
  const signValid = true // test
  console.log('----Validating message sign', signValid)
  if (!signValid) {
    res.status(500).send('Sign is not valid')
    return
  }
  if (tx.type === 'CREATE' || tx.type === 'EDIT') {

    console.log('----Sending tx to everyone in network')
    for (let { host, port } of [...network.nodes, ...network.validators]) {
      console.log('Sending to', `${host}:${port}`)
      axios.post(`http://${host}:${port}/bc/chain/tx`, { tx }).catch(_e => {})
    }
    console.log('----Tx sent over network')
  }
  switch (tx.type) {
    case 'CREATE': {
      console.log("----Received tx 'CREATE' - will redirect to the next unit...")
      const transactionCreate = tx as Models.tx.TransactionCreate
      console.log("----Adding tx 'CREATE' to current block")
      chain.getCurrentBlock().addTransaction(new Models.tx.TransactionCreate(
        transactionCreate.documentId,
        transactionCreate.senderAddress,
        transactionCreate.receiverAddress,
        transactionCreate.validatorAddress,
        transactionCreate.documentType,
        transactionCreate.strategy
      ))
      const unitIndex = transactionCreate.strategy.indexOf(tx.senderAddress)
      const nextUnit = expectDefined(transactionCreate.strategy[unitIndex + 1])
      const [nextUnitHost, nextUnitPort] = nextUnit.split(':')
      console.log('Redirecting message to', `${nextUnitHost}:${nextUnitPort}`)
      axios.post(`http://${nextUnitHost}:${nextUnitPort}/bc/documents/prepare/${documentId}`, { tx, cipher, sign, y }).catch(_e => {})
      break
    }
    case 'EDIT': {
      console.log("----Received tx 'EDIT' - will redirect to the next unit...")
      const transactionEdit = tx as Models.tx.TransactionEdit
      console.log("----Adding tx 'EDIT' to current block")
      chain.getCurrentBlock().addTransaction(new Models.tx.TransactionEdit(
        transactionEdit.documentId,
        transactionEdit.senderAddress,
        transactionEdit.receiverAddress
      ))
      const transactionCreate = chain.findTransaction(documentId, 'CREATE') as Models.tx.TransactionCreate
      const unitIndex = transactionCreate.strategy.indexOf(tx.senderAddress)
      const nextUnit = expectDefined(transactionCreate.strategy[unitIndex + 1])
      const [nextUnitHost, nextUnitPort] = nextUnit.split(':')
      console.log('Redirecting message to', `${nextUnitHost}:${nextUnitPort}`)
      axios.post(`http://${nextUnitHost}:${nextUnitPort}/bc/documents/prepare/${documentId}`, { tx, cipher, sign, y }).catch(_e => {})
      break
    }
    case 'READY': {
      console.log("----Received tx 'READY' - will store document chunks in the network...")
      const transactionCreate = chain.findTransaction(documentId, 'CREATE') as Models.tx.TransactionCreate
      const documentDecrypted = ElGamal.decrypt(keypair, cipher)
      console.log('----Document decrypted:', documentDecrypted)
      const willEncrypt = transactionCreate.documentType === 'LIMITED'
      console.log(`----Document type is ${transactionCreate.documentType}: will encrypt - ${willEncrypt}`)
      const chunksNum = 2
      const chunks = chunkSubstr(`${documentDecrypted}`, chunksNum)
      const strategy = placeStrategy(chunksNum, network.nodes.map(n => `${n.host}:${n.port}`))
      for (let i = 0; i < chunksNum; i++) {
        const chunk = chunks[i]
        const chunkToStore = willEncrypt
          ? JSON.stringify(ElGamal.encrypt(keypair.pub, parseInt(expectDefined(chunk))))
          : chunk
        const targetAddresses = expectDefined(strategy[i])
        for (let address of targetAddresses) {
          console.log(`Sending ${chunkToStore} to ${address}`)
          axios.post(`http://${address}/bc/documents/${documentId}`, { document: chunkToStore, index: i }).catch(_e => {})
        }
      }
      console.log('----Document chunks sent over network')
      const txUpdated = new Models.tx.TransactionReady(
        tx.documentId,
        tx.senderAddress,
        tx.receiverAddress,
        strategy
      )
      console.log('----Sending updated tx to everyone in network')
      for (let { host, port } of [...network.nodes, ...network.validators]) {
        console.log('Sending to', `${host}:${port}`)
        axios.post(`http://${host}:${port}/bc/chain/tx`, { tx: txUpdated }).catch(_e => {})
      }
      console.log('----Tx sent over network')
      console.log("----Adding updated tx 'READY' to current block")
      chain.getCurrentBlock().addTransaction(txUpdated)
      break
    }
    case 'REQUEST': {
      res.status(400).send('Please request /documents/get/:id')
      break
    }
  }
  dumpChain(chain)
  console.log('************************************************')
  res.sendStatus(200)
}
