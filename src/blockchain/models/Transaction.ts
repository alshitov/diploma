import { v4 as uuid } from 'uuid'
import { hexlify } from '../lib'

export type TransactionType = 'CREATE' | 'EDIT' | 'READY' | 'REQUEST'

class TransactionBase {
  readonly id: string
  readonly documentId: string
  readonly senderAddress: string
  readonly receiverAddress: string
  readonly type: TransactionType
  readonly createdAt: Date

  constructor (
    documentId: string,
    senderAddress: string,
    receiverAddress: string,
    type: TransactionType
  ) {
    this.id = uuid()
    this.documentId = documentId
    this.senderAddress = senderAddress
    this.receiverAddress = receiverAddress
    this.type = type
    this.createdAt = new Date()
  }

  toHexString (): string {
    return hexlify.objectToHex({
      id: this.id,
      documentId: this.documentId,
      senderAddress: this.senderAddress,
      receiverAddress: this.receiverAddress,
      type: this.type,
      createdAt: this.createdAt
    })
  }
}

export class TransactionCreate extends TransactionBase {
  readonly validatorAddress: string
  readonly documentType: 'GENERAL' | 'LIMITED'
  readonly strategy: Array<string>

  constructor (
    documentId: string,
    senderAddress: string,
    receiverAddress: string,
    validatorAddress: string,
    documentType: 'GENERAL' | 'LIMITED',
    strategy: Array<string>
  ) {
    super(documentId, senderAddress, receiverAddress, 'CREATE')
    this.validatorAddress = validatorAddress
    this.documentType = documentType
    this.strategy = strategy
  }

  toHexString (): string {
    return hexlify.objectToHex({
      id: this.id,
      documentId: this.documentId,
      senderAddress: this.senderAddress,
      receiverAddress: this.receiverAddress,
      type: this.type,
      createdAt: this.createdAt,
      validatorAddress: this.validatorAddress,
      documentType: this.documentType,
      strategy: this.strategy
    })
  }
}

export class TransactionEdit extends TransactionBase {
  constructor (
    documentId: string,
    senderAddress: string,
    receiverAddress: string
  ) {
    super(documentId, senderAddress, receiverAddress, 'EDIT')
  }
}

type DocumentMap = {
  [index: number]: string[]
}

export class TransactionReady extends TransactionBase {
  documentMap: DocumentMap

  constructor (
    documentId: string,
    senderAddress: string,
    receiverAddress: string,
    documentMap: DocumentMap = {}
  ) {
    super(documentId, senderAddress, receiverAddress, 'READY')
    this.documentMap = documentMap
  }

  toHexString (): string {
    return hexlify.objectToHex({
      id: this.id,
      documentId: this.documentId,
      senderAddress: this.senderAddress,
      receiverAddress: this.receiverAddress,
      type: this.type,
      createdAt: this.createdAt,
      documentMap: this.documentMap
    })
  }
}

export class TransactionRequest extends TransactionBase {
  constructor (
    documentId: string,
    senderAddress: string,
    receiverAddress: string
  ) {
    super(documentId, senderAddress, receiverAddress, 'REQUEST')
  }
}

export type Transaction = TransactionCreate | TransactionEdit | TransactionReady | TransactionRequest
