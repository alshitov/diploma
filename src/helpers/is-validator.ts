import { expectDefined } from './expect-defined'

export const isValidator = ['3010', '3011', '3012'].includes(expectDefined(process.env.PORT))
