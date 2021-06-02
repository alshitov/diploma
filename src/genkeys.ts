import { ElGamal } from './blockchain'
import axios from 'axios'

const pubK = ElGamal.generatePublicKey()
console.log(pubK)

const host = '127.0.0.1'

for (let port of ['3001', '3002', '3003', '3004', '3005', '3010', '3011', '3012']) {
  axios.post(`http://${host}:${port}/bc/keys`, { pubK: { p: 21453737, g: 4631 } })
    .then(res => console.log('Response from', `${host}:${port} -`, res.data))
    .catch(_e => {})
}
