import { Transaction } from './Transaction'
import { Sign } from './Sign'

export interface Block {
  selfHash: string
  previousBlockHash: string
  createdAt: Date
  validatorSigns: Sign[]
  transactions: Transaction[]
}
