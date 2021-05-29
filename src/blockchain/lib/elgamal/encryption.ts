import { getRandomInt, modpow } from './utils'
import { Keypair, PubK } from './keygen'

type Cipher = {
  a: number
  b: number
}

export function encrypt (pubK: PubK, message: number): Cipher {
  const { y, g, p } = pubK
  const k = getRandomInt(1, p - 1)
  const a = modpow(g, k, p)
  const b = (modpow(y, k, p) * message) % p
  return { a, b }
}

export function decrypt (keypair: Keypair, cipher: Cipher): number {
  const { a, b } = cipher
  return (modpow(a, keypair.pub.p - 1 - keypair.priv, keypair.pub.p) * b) % keypair.pub.p
}
