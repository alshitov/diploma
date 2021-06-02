import { hexlify } from '../lib'
import { Sign as ElGamalSign } from '../lib/elgamal/signature'

export class Sign {
  private readonly sign: ElGamalSign | string
  private readonly validatorAddress: string
  private readonly createdAt: Date

  constructor (sign: ElGamalSign | string, validatorAddress: string) {
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
