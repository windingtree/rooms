import { NowRequest, NowResponse } from '@vercel/node'

import {
  errorHandler,
  CError,
  checkRequiredEnvProps,
  checkRequiredAppConfigProps,
  onExitCleanUp,
  isFunction
} from '../../_lib/tools'
import { CONSTANTS } from '../../_lib/infra/constants'
import { IMethodHandlerHash, TMethodFunc } from '../../_lib/types'

const { HTTP_STATUS_CODES } = CONSTANTS
const { BAD_REQUEST, FORBIDDEN, NOT_IMPLEMENTED, INTERNAL_SERVER_ERROR, OK }  = CONSTANTS.HTTP_STATUS

async function getMethodFunc(request: NowRequest, availMethodHandlers: IMethodHandlerHash): Promise<TMethodFunc> {
  if (!request || typeof request.method !== 'string') {
    throw new CError(BAD_REQUEST, 'Must provide request method.')
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
    throw new CError(FORBIDDEN, `Method '${method}' is not allowed.`)
  }

  const methodHandler = method as keyof IMethodHandlerHash
  if (!isFunction(availMethodHandlers[methodHandler])) {
    throw new CError(NOT_IMPLEMENTED, `Method '${method}' is not implemented.`)
  }

  const methodFunc = availMethodHandlers[methodHandler]
  if (typeof methodFunc === 'undefined') {
    throw new CError(INTERNAL_SERVER_ERROR, `Method handler for '${method}' is not defined.`)
  }

  return methodFunc
}

async function genericApiMethodHandler(
  request: NowRequest, response: NowResponse,
  availMethodHandlers: IMethodHandlerHash,
  skipSanityChecks = false
): Promise<void> {
  let result
  try {
    const methodFunc = await getMethodFunc(request, availMethodHandlers)

    if (skipSanityChecks === false) {
      await checkRequiredEnvProps()
      await checkRequiredAppConfigProps()
    }

    result = await methodFunc(request, response)

    await onExitCleanUp()
  } catch (err) {
    try {
      await onExitCleanUp()
    } catch (err) {
      // Do nothing. We are already in a try/catch block.
    }

    return errorHandler(response, err)
  }

  if (typeof result === 'string') {
    response.status(HTTP_STATUS_CODES[OK]).send(result)
  } else {
    response.status(HTTP_STATUS_CODES[OK]).json(result)
  }
}

export {
  genericApiMethodHandler,
}
