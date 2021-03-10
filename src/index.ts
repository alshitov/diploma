import { app } from './app'

const HOST = '127.0.0.1'
const PORT = 3000

app.listen(PORT, HOST, (): void => {
  console.log(`*** Node is up at ${HOST}:${PORT} ***`)
})
