type TransactionType = 'DOCUMENT_SEND' | 'DOCUMENT_RECEIVE'

export interface Transaction {
  id: string
  type: TransactionType
  createdAt: Date
  receiverId: string
  senderId: string
  senderPublicKey: string
  encryptedMerkleTreeRoot: string
}
