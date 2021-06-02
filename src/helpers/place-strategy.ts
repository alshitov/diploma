type PlaceStrategy = {
  [i: number]: string[]
}

export function chunkSubstr (s: string, n: number) {
  const sLength = s.length
  const maxChunkSize = Math.ceil(sLength / n)
  const result = []
  let i = 0, j = 0
  let chunk = ''
  while (i < sLength) {
    do {
      chunk += s[i]
      i++
      j++
    } while (j < maxChunkSize && i < sLength)
    result.push(chunk)
    j = 0
    chunk = ''
  }
  return result
}

function getRandom (array: string[], n: number) {
  const result = new Array(n)
  let len = array.length
  const taken = new Array(len)
  if (n > len)
      throw new RangeError('getRandom: more elements taken than available')
  while (n--) {
      var x = Math.floor(Math.random() * len)
      result[n] = array[x in taken ? taken[x] : x]
      taken[x] = --len in taken ? taken[len] : len
  }
  return result
}

export function placeStrategy (chunksNum: number, addresses: string[]): PlaceStrategy {
  const chunks = Array.from(Array(chunksNum).keys())
  const strategy: PlaceStrategy = {}
  chunks.reduce((acc: PlaceStrategy, i: number): PlaceStrategy => {
    acc[i] = getRandom(addresses, addresses.length)
    return acc
  }, strategy)
  return strategy
}
