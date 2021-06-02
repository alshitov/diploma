import { randomBytes } from 'crypto'
import { expectDefined } from '../../../helpers'

export function getRandomInt (min: number, max: number) {
  const minC = Math.ceil(min)
  const maxF = Math.floor(max)
  return Math.floor(Math.random() * (maxF - minC + 1)) + minC
}

export function modpow (base: number, pow: number, mod: number) {
  let res = 1
  base = base % mod
  while (pow > 0) {
    if (pow & 1) {
      res = (res * base) % mod
    }
    pow = pow >> 1
    base = (base * base) % mod
  }
  return res
}

function millerRabinTest(d: number, n: number): boolean {
    let a = 2 + Math.floor(Math.random() * (n - 2)) % (n - 4)
    let x = modpow(a, d, n)
    if (x == 1 || x == n - 1) {
      return true
    }
    while (d != n - 1) {
      x = (x * x) % n
      d *= 2
      if (x == 1) {
        return false
      }
      if (x == n - 1) {
        return true
      }
    }
    return false
}

function isPrime(n: number, k: number = 128): boolean {
  if (n <= 1 || n == 4) {
    return false
  }
  if (n <= 3) {
    return true
  }
  let d = n - 1
  while (d % 2 == 0) {
    d /= 2
  }
  for (let i = 0; i < k; i++) {
    if (!millerRabinTest(d, n)) {
      return false
    }
  }
  return true
}

function generatePrimeCandidate (bits: number = 1024): number {
  return randomBytes(bits / 8).readUInt32BE(0)
}

export function generatePrimeNumber (bits: number = 1024): number {
  let p = 4
  while (!isPrime(p, 128)) {
    p = generatePrimeCandidate(bits)
  }
  return p
}

export function findPrimitiveRoot (p: number): number {
  let fact = []
  const phi = p - 1
  let n = phi
  for (let i = 2; (i * i) < n; ++i) {
    if ((n % i) === 0) {
      fact.push(i)
      while ((n % i) === 0) {
        n /= i
      }
    }
  }
  if (n > 1) {
    fact.push(n)
  }
  for (let res = Math.floor(p * (1/2)); res >= 2; --res) {
    let ok = true
    for (let fi = 0; fi < fact.length && ok; ++fi) {
      ok = ok && (modpow(res, phi / expectDefined(fact[fi]), p) !== 1)
    }
    if (ok) {
      return res
    }
  }
  throw new Error('Primitive root not found')
}

export function gcd (a: number, b: number): number {
  while (a && b && a !== b) {
    if (a > b) {
      [a, b] = [a - b, b]
    } else {
      [a, b] = [a, b - a]
    }
  }
  return a || b
}

export function gcdex (a: number, b: number): { d: number, x: number, y: number } {
  let x: number, y: number
	if (a === 0) {
    x = 0
    y = 1
		return { d: b, x, y }
  }
  const { d, x: x1, y: y1 } = gcdex(b % a, a)
	x = y1 - Math.floor(b / a) * x1
	y = x1
	return { d, x, y }
}

export function invmod (a: number, m: number): number {
  const { d, x } = gcdex(a, m)
  if (d === 1) {
    return (x % m + m) % m
  } else {
    throw new Error('Inverse modulo error')
  }
}
