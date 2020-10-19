import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler } from './'

const disableApiRequestsHere = async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, {})
}

export default disableApiRequestsHere

export {
  disableApiRequestsHere,
}
