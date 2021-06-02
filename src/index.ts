import { app } from './app'
import { expectDefined, isValidator } from './helpers'

const HOST = '127.0.0.1'
const PORT = parseInt(expectDefined(process.env.PORT))

app.listen(PORT, HOST, async () => {
  await console.log(`\n*** ${isValidator ? 'Validator' : 'Node'} is up at ${HOST}:${PORT} ***\n`)
})
