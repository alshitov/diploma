import { expectDefined } from './expect-defined'

console.log(expectDefined(process.env.PORT))

export const isValidator = ['3010', '3011', '3012'].includes(expectDefined(process.env.PORT))
