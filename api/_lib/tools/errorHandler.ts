import { NowResponse } from '@vercel/node'

import { CError } from '../tools'
import { CONSTANTS } from '../../_lib/infra/constants'

const { HTTP_STATUS_CODES } = CONSTANTS

function errorHandler(response: NowResponse, error: unknown): void {
  if (error instanceof CError) {
    const err: CError = (error as CError)
    response.status(HTTP_STATUS_CODES[err.code]).json({ err: err.msg })
  } else {
    response.status(500).json({ err: 'Unhandled error occurred.' })
  }
}

export {
  errorHandler,
}
