export function expectDefined<T> (val: T): NonNullable<T> {
  if (val == null) {
    throw Error(`Expected value to be defined, but received ${String(val)}`)
  }
  return val as NonNullable<T>
}
