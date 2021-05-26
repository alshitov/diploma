import { objectToHex } from './utils'

export class Sign {
  private readonly sign: string
  private readonly validatorAddress: string
  private readonly createdAt: Date

  constructor (sign: string, validatorAddress: string) {
    this.sign = sign
    this.validatorAddress = validatorAddress
    this.createdAt = new Date()
  }

  toHexString (): string {
    return objectToHex({
      sign: this.sign,
      validatorAddress: this.validatorAddress,
      createdAt: this.createdAt
    })
  }
}
