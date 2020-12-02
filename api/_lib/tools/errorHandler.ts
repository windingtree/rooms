import { NowResponse } from '@vercel/node'

import { CError } from '../../_lib/tools'
import { CONSTANTS } from '../../_lib/infra/constants'

const { HTTP_STATUS, HTTP_STATUS_CODES } = CONSTANTS
const { INTERNAL_SERVER_ERROR } = HTTP_STATUS

function errorHandler(response: NowResponse, error: unknown): void {
  let errorCode: number
  let errorMessage: string

  if (error instanceof CError) {
    errorCode = HTTP_STATUS_CODES[error.status]
    errorMessage = error.msg
  } else {
    errorCode = HTTP_STATUS_CODES[INTERNAL_SERVER_ERROR]
    errorMessage = 'Unhandled error occurred.'
  }

  response.status(errorCode).json({ err: errorMessage })
}

export {
  errorHandler,
}
