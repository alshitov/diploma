import axios from 'axios'

(async function documentGet () {
  const documentId = '91883ec2-6391-4768-ab10-a4fe1064ca5d'
  const res = await axios.get<{ document: string }>(`http://127.0.0.1:3010/bc/documents/${documentId}`)
  console.log(res)
}) ();
