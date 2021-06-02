import { generatePrimeNumber, /* findPrimitiveRoot */ } from './utils'

export type GeneralPubK = {
  g: number
  p: number
}

export type PubK = {
  general: GeneralPubK
  y: number
}

export type Keypair = {
  pub: PubK
  priv: number
}

export function generatePublicKey (): GeneralPubK {
  const p = generatePrimeNumber()
  const g = Math.floor(Math.sqrt(p))
  return { p, g }
}
