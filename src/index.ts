import { app } from './app'
import { expectDefined } from './helpers/index'

const HOST = '127.0.0.1'
const PORT = parseInt(expectDefined(process.env.PORT))

app.listen(PORT, HOST, (): void => {
  console.log(`*** Node is up at ${HOST}:${PORT} ***`)
})
