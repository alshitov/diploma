import { expectDefined } from './expect-defined'

export const address = (): string => `127.0.0.1:${expectDefined(process.env.PORT)}`
