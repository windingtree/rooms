import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler } from '../tools'
import { WT_VERIFICATION_CODE } from '../constants'

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  response.status(200).send(WT_VERIFICATION_CODE)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
