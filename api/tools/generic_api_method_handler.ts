import { NowRequest, NowResponse } from '@vercel/node'

import { IMethodHandlerHash, TMethodFunc } from '../types/api'
import { methodNotImplemented } from './generic_response'

async function genericApiMethodHandler(
  request: NowRequest, response: NowResponse,
  availMethodHandlers: IMethodHandlerHash
): Promise<void> {
  if (!request || typeof request.method !== 'string') {
    response.status(500).json({ err: 'Must provide request method.' })
    return
  }

  const method = request.method.toUpperCase()

  if (typeof availMethodHandlers[method] === 'function') {
    const methodFunc = (availMethodHandlers[method] as TMethodFunc)
    await methodFunc(request, response)
  } else {
    await methodNotImplemented(request, response)
  }
}

export {
  genericApiMethodHandler
}
