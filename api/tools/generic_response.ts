import { NowRequest, NowResponse } from '@vercel/node'

async function methodNotImplemented(request: NowRequest, response: NowResponse): Promise<void> {
  response.status(501).json({ err: `Method ${request.method} not implemented.` })
}

export {
  methodNotImplemented
}
