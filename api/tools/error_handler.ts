import { NowResponse } from '@vercel/node'

import { CError, disableApiRequestsHere } from './'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

function errorHandler(response: NowResponse, error: unknown): void {
  if (error instanceof CError) {
    const err: CError = (error as CError)
    response.status(err.code).json({ err: err.msg })

    return
  } else {
    response.status(500).json({ err: 'Unhandled error occurred.' })

    return
  }
}

export {
  errorHandler,
}
