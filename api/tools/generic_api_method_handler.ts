import { NowRequest, NowResponse } from '@vercel/node'

import { errorHandler, CError } from './'
import { IMethodHandlerHash, TMethodFunc } from '../types'

async function methodNotImplemented(request: NowRequest, response: NowResponse): Promise<void> {
  return errorHandler(response, new CError(501, `Method ${request.method} not implemented.`))
}

async function genericApiMethodHandler(
  request: NowRequest, response: NowResponse,
  availMethodHandlers: IMethodHandlerHash
): Promise<void> {
  if (!request || typeof request.method !== 'string') {
    return errorHandler(response, new CError(500, 'Must provide request method.'))
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
  methodNotImplemented,
  genericApiMethodHandler,
}
