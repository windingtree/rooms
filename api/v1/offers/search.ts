import { NowRequest, NowResponse } from '@vercel/node'

import { getAllRoomTypes } from '../../app/rooms'
import { verifyOrgJwt } from '../../app/marketplace'
import { genericApiMethodHandler, errorHandler, getOrgToken } from '../../tools'
import { IVerifiedOrgJwtResults, IRoomTypeCollection } from '../../types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let jwt: string
  try {
    jwt = getOrgToken(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let verifiedOrgJwtResults: IVerifiedOrgJwtResults
  try {
    verifiedOrgJwtResults = await verifyOrgJwt(jwt)
  } catch (err) {
    return errorHandler(response, err)
  }

  let roomCollection: IRoomTypeCollection
  try {
    roomCollection = await getAllRoomTypes()
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ roomCollection, verifiedOrgJwtResults })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
