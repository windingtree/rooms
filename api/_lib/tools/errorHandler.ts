import { NowResponse } from '@vercel/node'

import { CError } from '../../_lib/tools'
import { CONSTANTS } from '../../_lib/infra/constants'

const { HTTP_STATUS, HTTP_STATUS_CODES } = CONSTANTS
const { INTERNAL_SERVER_ERROR } = HTTP_STATUS

function stdErr(err: unknown): void {
  console.log('-------')
  console.error(err)
  console.log('-------')
}

function errorHandler(response: NowResponse, error: unknown): void {
  let errorCode: number
  let errorMessage: string
  let originalError: unknown|null = null

  if (error instanceof CError) {
    errorCode = HTTP_STATUS_CODES[error.statusCode]
    errorMessage = error.msg
    originalError = error.originalError
  } else {
    errorCode = HTTP_STATUS_CODES[INTERNAL_SERVER_ERROR]
    errorMessage = 'Unhandled error occurred.'
  }

  stdErr(error)
  if (originalError !== null) {
    stdErr(originalError)
  }

  response.status(errorCode).json({ err: errorMessage })
}

export {
  errorHandler,
}
