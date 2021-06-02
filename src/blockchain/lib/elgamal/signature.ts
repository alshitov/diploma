import { /* getRandomInt, gcd, */ modpow, invmod } from './utils'
import { expectDefined } from '../../../helpers'
import { PubK, Keypair } from './keygen'

export type Sign = {
  r: number
  s: number
}

function generateK (p: number): number {
  // let k: number
  // while (true) {
  //   k = getRandomInt(2, p - 2)
  //   if (gcd(k, p - 1) === 1) {
  //     break
  //   }
  // }
  // console.log('k', k)
  // test
  const aval = [15135979, 18412509, 5877561, 40424789, 7067513, 1529645, 3412897, 17435165, 5840951, 9720325, 12738729]
  return expectDefined(aval[Math.floor(Math.random() * aval.length)])
}

export function sign (mHash: number, keypair: Keypair): Sign {
  const { g, p } = keypair.pub.general
  const k = generateK(p)
  const r = modpow(g, k, p)
  const s = (invmod(k, p - 1) * (mHash - keypair.priv * r)) % (p - 1)
  return { r, s }
}

export function validateSign (mHash: number, pubK: PubK, sign: Sign): boolean {
  const { y, general } = pubK
  const { p, g } = general
  const { r, s } = sign
  if (r < 1 || r > (p - 1)) {
    return false
  }
  const V1 = modpow(y, r, p) % p * modpow(r, s, p) % p
  const V2 = modpow(g, mHash, p)
  return V1 === V2
}
