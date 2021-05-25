import { Validator } from './Validator'

export interface Sign {
  sign: string
  validator: Validator
  createdAt: Date
}
