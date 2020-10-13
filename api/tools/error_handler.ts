import { NowResponse } from '@vercel/node'
import { CError } from './'

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
