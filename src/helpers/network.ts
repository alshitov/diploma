import { expectDefined } from "./expect-defined"
import axios from 'axios'

type Address = {
  host: string
  port: string
}

class Network {
  nodes: Address[]
  validators: Address[]

  constructor () {
    this.nodes = []
    this.validators = []
  }

  addNode (node: Address): void {
    this.nodes.push(node)
  }

  addValidator (validator: Address): void {
    this.validators.push(validator)
  }

  getNodes (): Address[] {
    return this.nodes
  }

  getValidators (): Address[] {
    return this.validators
  }

  exists (host: string, port: string): boolean {
    const nodeExists = this.nodes.filter(n => n.host === host && n.port === port).length !== 0
    if (nodeExists) {
      return true
    } else {
      const validatorExists = this.validators.filter(n => n.host === host && n.port === port).length !== 0
      return validatorExists
    }
  }
}

type PingResponse = {
  available: boolean
  validator?: boolean
}

export async function pingAddress (host: string, port: string): Promise<PingResponse> {
  const res = axios
    .post(`http://${host}:${port}/bc/ping`, { port: myPort })
    .then(res => {
      if (res.status === 200) {
        return {
          available: true,
          validator: res.data.validator as boolean
        }
      } else {
        return {
          available: false
        }
      }
    })
    .catch(_e => ({ available: false }))
  return await res

}

const myPort = expectDefined(process.env.PORT)

const ports = ['3000', '3001', '3002', '3003', '3004', '3005', '3010', '3011', '3012']

export function getNetwork (): Network {
  const network = new Network()
  const host = '127.0.0.1'
  const portsToAsk = ports.filter(p => p !== myPort)

  for (let port of portsToAsk) {
    const address: Address = { host, port }
    pingAddress(host, port)
      .then(data => {
        console.log(`Pinging ${host}:${port} -`, data)
        if (data.available) {
          data.validator ? network.addValidator(address) : network.addNode(address)
        }
      })
      .catch(_e => {})
  }
  return network
}

