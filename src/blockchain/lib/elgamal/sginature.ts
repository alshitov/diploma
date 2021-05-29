import { getRandomInt, gcd, modpow, invmod } from './utils'
import { PubK, Keypair } from './keygen'

type Sign = {
  r: number
  s: number
}

function generateK (p: number): number {
  let k: number
  while (true) {
    k = getRandomInt(1, p - 1)
    if (gcd(k, p - 1) === 1) {
      break
    }
  }
  return k
}

export function sign (mHash: number, keypair: Keypair): Sign {
  const { g, p } = keypair.pub
  const k = generateK(p) // ?
  const r = modpow(g, k, p)
  const s = (invmod(k, p - 1) * (mHash - keypair.priv * r)) % (p - 1)
  return { r, s }
}

export function validateSign (mHash: number, pubK: PubK, sign: Sign): boolean {
  const { y, g, p } = pubK
  const { r, s } = sign
  if (r < 1 || r > (p - 1)) {
    return false
  }
  return modpow(y, r, p) % p * modpow(r, s, p) % p === modpow(g, mHash, p)
}
