import { getRandomInt, modpow } from './utils'
import { Keypair, PubK } from './keygen'

export type Cipher = {
  a: number
  b: number
}

export function encrypt (pubK: PubK, message: number): Cipher {
  const { y, general: { p, g } } = pubK
  const k = getRandomInt(1, p - 1)
  const a = modpow(g, k, p)
  const b = (modpow(y, k, p) * message) % p
  return { a, b }
}

export function decrypt (keypair: Keypair, cipher: Cipher): number {
  const { a, b } = cipher
  const { general: { p } } = keypair.pub
  return (modpow(a, p - 1 - keypair.priv, p) * b) % p
}
