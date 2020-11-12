import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler } from '../tools'

const disableApiRequestsHere = async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, {})
}

export default disableApiRequestsHere

export {
  disableApiRequestsHere,
}
