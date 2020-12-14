import { NowRequest } from '@vercel/node'
import { IncomingMessage } from 'http'
import * as net from 'net'

import { IRequestBody } from '../../_tests/_types'

function createRequestObject(body: IRequestBody): NowRequest {
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
