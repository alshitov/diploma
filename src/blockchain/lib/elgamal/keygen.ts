import { generatePrimeNumber, findPrimitiveRoot, modpow, getRandomInt } from './utils'

export type PubK = {
  y: number
  g: number
  p: number
}

export type Keypair = {
  pub: PubK
  priv: number
}

export function generateKeys (): Keypair {
  const p = generatePrimeNumber()
  const g = findPrimitiveRoot(p)
  const x = getRandomInt(1, p - 1)
  const y = modpow(g, x, p)

  return {
    pub: { y, g, p },
    priv: x
  }
}
