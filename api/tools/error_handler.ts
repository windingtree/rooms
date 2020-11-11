import { NowResponse } from '@vercel/node'

import { CError, disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

function errorHandler(response: NowResponse, error: unknown): void {
  if (error instanceof CError) {
    const err: CError = (error as CError)
    response.status(err.code).json({ err: err.msg })
  } else {
    response.status(500).json({ err: 'Unhandled error occurred.' })
  }
}

export {
  errorHandler,
}
