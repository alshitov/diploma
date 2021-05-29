import { hexlify } from '../lib'

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
    return hexlify.objectToHex({
      sign: this.sign,
      validatorAddress: this.validatorAddress,
      createdAt: this.createdAt
    })
  }
}
