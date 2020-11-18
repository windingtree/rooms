import { NowRequest, NowResponse } from '@vercel/node'

import { errorHandler, CError } from '../tools'
import { IMethodHandlerHash } from '../types'

async function genericApiMethodHandler(
  request: NowRequest, response: NowResponse,
  availMethodHandlers: IMethodHandlerHash
): Promise<void> {
  if (!request || typeof request.method !== 'string') {
    return errorHandler(response, new CError(500, 'Must provide request method.'))
  }

  const method: string = request.method.toUpperCase()

  const ALLOWED_METHODS: Array<keyof IMethodHandlerHash> = [
    'GET',
    'HEAD',
    'POST',
    'PUT',
    'DELETE',
    'CONNECT',
    'OPTIONS',
    'TRACE',
    'PATCH',
  ]

  if (!ALLOWED_METHODS.includes(method as keyof IMethodHandlerHash)) {
    return errorHandler(response, new CError(500, `Method '${method}' is not allowed.`))
  }

  const methodHandler: keyof IMethodHandlerHash = method as keyof IMethodHandlerHash
  if (typeof availMethodHandlers[methodHandler] !== 'function') {
    return errorHandler(response, new CError(501, `Method '${method}' is not implemented.`))
  }

  const methodFunc = availMethodHandlers[methodHandler]
  if (typeof methodFunc === 'undefined') {
    return errorHandler(response, new CError(500, `Method handler for '${method}' is not defined.`))
  }

  await methodFunc(request, response)
}

export {
  genericApiMethodHandler,
}
