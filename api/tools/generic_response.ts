import { NowRequest, NowResponse } from '@vercel/node'

function methodNotImplemented(request: NowRequest, response: NowResponse) {
  response.status(501).json({ err: `Method ${request.method} not implemented.` })
}

export {
  methodNotImplemented
}
