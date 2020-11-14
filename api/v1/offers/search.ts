/*
import { NowRequest, NowResponse } from '@vercel/node'
import { v4 as uuidv4 } from 'uuid'

import { getAllRoomTypes, getAllProfiles } from '../../_lib/data'
import { verifyOrgJwt } from '../../_lib/data/marketplace'
import { genericApiMethodHandler, errorHandler, getOrgToken } from '../../_lib/tools'
import { IVerifiedOrgJwtResults, IRoomTypeCollection, IProfileCollection } from '../../_lib/types'

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

  let roomTypeCollection: IRoomTypeCollection
  try {
    roomTypeCollection = await getAllRoomTypes()
  } catch (err) {
    return errorHandler(response, err)
  }

  let profileCollection: IProfileCollection
  try {
    profileCollection = await getAllProfiles()
  } catch (err) {
    return errorHandler(response, err)
  }

  const roomCollection = roomTypeCollection.map((roomType) => {
    const email = roomType.email
    const profile = profileCollection.find((el) => {
      return el.email === email
    })

    if (!profile) {
      return null
    }

    return {
      id: uuidv4(),
      type: roomType.type,
      price: roomType.price,
      hotel: profile.hotelName,
      address: profile.hotelAddress,
    }
  }).filter((el) => {
    return el !== null
  })

  response.status(200).json({ offers: roomCollection, verifiedOrgJwtResults })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
*/
