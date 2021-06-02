import { Response } from 'express'
import { CustomRequest, dumpChain } from '../../../../helpers'
import { Models } from '../../../../blockchain'
import { chain } from '../../../../app'

interface TxReceive {
  tx: Models.Transaction
}

export async function txReceive (req: CustomRequest<TxReceive>, res: Response) {
  const tx = req.body.tx
  console.log('----Received new transaction', tx)
  switch (tx.type) {
    case 'CREATE':
      const txCreate = tx as Models.tx.TransactionCreate
      chain.getCurrentBlock().addTransaction(new Models.tx.TransactionCreate(
        txCreate.documentId,
        txCreate.senderAddress,
        txCreate.receiverAddress,
        txCreate.validatorAddress,
        txCreate.documentType,
        txCreate.strategy
      ))
      break
    case 'EDIT':
      const txEdit = tx as Models.tx.TransactionEdit
      chain.getCurrentBlock().addTransaction(new Models.tx.TransactionEdit(
        txEdit.documentId,
        txEdit.senderAddress,
        txEdit.receiverAddress
      ))
      break
    case 'READY':
      const txReady = tx as Models.tx.TransactionReady
      chain.getCurrentBlock().addTransaction(new Models.tx.TransactionReady(
        txReady.documentId,
        txReady.senderAddress,
        txReady.receiverAddress,
        txReady.documentMap
      ))
      break
  }
  dumpChain(chain)
  console.log('************************************************')
  res.sendStatus(200)
}
