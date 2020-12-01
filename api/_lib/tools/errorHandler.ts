import { NowResponse } from '@vercel/node'

import { CError } from '../tools'
import { CONSTANTS } from '../../_lib/infra/constants'

const { HTTP_STATUS, HTTP_STATUS_CODES } = CONSTANTS
const { INTERNAL_SERVER_ERROR } = HTTP_STATUS

function errorHandler(response: NowResponse, error: unknown): void {
  if (error instanceof CError) {
    const err: CError = (error as CError)

    const errorCode = HTTP_STATUS_CODES[err.status]
    const errorMessage = err.msg

    response.status(errorCode).json({ err: errorMessage })
  } else {
    response
      .status(HTTP_STATUS_CODES[INTERNAL_SERVER_ERROR])
      .json({ err: 'Unhandled error occurred.' })
  }
}

export {
  errorHandler,
}
