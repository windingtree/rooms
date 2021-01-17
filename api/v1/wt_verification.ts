// node/npm imports
import { NowRequest, NowResponse } from '@vercel/node'

// interface layer imports
import { genericApiMethodHandler } from '../_lib/interface'

// application layer imports
import { wtVerification } from '../_lib/app/auth/orgid'

async function GET(): Promise<string> {
  return await wtVerification()
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET })
}
