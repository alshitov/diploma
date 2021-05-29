export function stringToHex (s: string): string {
  return s.split('').map(c => c.charCodeAt(0).toString(16)).join('')
}

export function objectToHex (o: object): string {
  return stringToHex(JSON.stringify(o))
}
