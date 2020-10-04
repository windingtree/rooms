import { NowRequest, NowResponse } from '@vercel/node'

import { methodNotImplemented } from '../tools/generic_response'

function methodGet(request: NowRequest, response: NowResponse) {
  response.status(200).send('OK')
}

export default (request: NowRequest, response: NowResponse) => {
  if (!request || typeof request.method !== 'string') {
    throw new Error('must provide request method')
  }

  const method = request.method.toUpperCase()

  switch (method) {
    case 'GET':
      methodGet(request, response)
      break
    default:
      methodNotImplemented(request, response)
      break
  }
}
