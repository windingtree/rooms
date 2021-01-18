import { NowRequest, NowResponse } from '@vercel/node'

import { errorHandler, onExitCleanUp } from '../interface'

import { AppConfig } from '../app/config'

import { CONSTANTS } from '../common/constants'
import { checkRequiredEnvProps } from '../common/env'
import { CError, isFunction } from '../common/tools'
import { IMethodHandlerHash, TMethodFunc } from '../common/types'

const { HTTP_STATUS_CODE } = CONSTANTS
const { BAD_REQUEST, FORBIDDEN, NOT_IMPLEMENTED, INTERNAL_SERVER_ERROR, OK }  = CONSTANTS.HTTP_STATUS

function reportRequestTime(startTime: [number, number]): void {
  const endTime: [number, number] = process.hrtime(startTime)
  const timeInMs: number = (endTime[0] * 1000000000 + endTime[1]) / 1000000

  console.log(`\n--- request processed in ${timeInMs}ms ---\n`)
}

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
  const startTime: [number, number] = process.hrtime()

  let result
  try {
    const methodFunc = await getMethodFunc(request, availMethodHandlers)

    if (skipSanityChecks === false) {
      await checkRequiredEnvProps()

      await AppConfig.getInstance().getConfig()
      await AppConfig.getInstance().validate()
    }

    result = await methodFunc(request, response)

    await onExitCleanUp()
  } catch (err) {
    try {
      await onExitCleanUp()
    } catch (_err) {
      // Do nothing. We are already in a try/catch block.
    }

    errorHandler(response, err)

    reportRequestTime(startTime)
    return
  }

  if (typeof result === 'string') {
    response.status(HTTP_STATUS_CODE[OK]).send(result)
  } else {
    response.status(HTTP_STATUS_CODE[OK]).json(result)
  }

  reportRequestTime(startTime)
}

export { genericApiMethodHandler }
