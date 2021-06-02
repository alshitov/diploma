import { Models, ElGamal } from './blockchain'
import axios from 'axios'
// import { hexlify } from './blockchain'
// import { sha256 } from 'js-sha256'
// import fs from 'fs'

const myPort = 3000
const documentId = '91883ec2-6391-4768-ab10-a4fe1064ca5d';

(async function documentCreate () {
  const tx = new Models.tx.TransactionCreate(
    documentId,
    `127.0.0.1:${myPort}`,
    `127.0.0.1:${3001}`,
    `127.0.0.1:${3010}`,
    'LIMITED',
    [
      '127.0.0.1:3002',
      '127.0.0.1:3003'
      // '127.0.0.1:3004',
      // '127.0.0.1:3005'
    ]
  )
  const keys3001 = (await axios.get<{ keys: ElGamal.Keypair }>(`http://127.0.0.1:3001/bc/keys`)).data.keys
  const keys3002 = (await axios.get<{ keys: ElGamal.Keypair }>(`http://127.0.0.1:3002/bc/keys`)).data.keys

  // const documentText = fs.readFileSync('./test-doc.txt', 'utf-8')
  const documentText = 1111 // test
  const documentEncrypted = ElGamal.encrypt(keys3002.pub, documentText)
  // const message = {
  //   tx,
  //   cipher: documentEncrypted
  // }
  // const messageHash = sha256(hexlify.objectToHex(message))
  const messageHash = 12566434 // test
  const sign = ElGamal.sign(messageHash, keys3001)
  const body = {
    tx,
    cipher: documentEncrypted,
    sign,
    y: keys3001.pub.y
  }
  await axios.post(`http://127.0.0.1:3010/bc/documents/prepare/${documentId}`, body)
})();
