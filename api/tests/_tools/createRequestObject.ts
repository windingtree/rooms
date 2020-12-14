import { NowRequest } from '@vercel/node'
import { IncomingMessage } from 'http'
import * as net from 'net'

function createRequestObject(body: { [key: string]: string|number|null|undefined }): NowRequest {
  const socket = new net.Socket()
  const incomingMessage = new IncomingMessage(socket)

  const request = Object.assign({}, incomingMessage, {
    query: {},
    cookies: {},
    body,
  })

  return request
}

export {
  createRequestObject,
}
