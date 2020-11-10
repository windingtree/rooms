import { NowRequest, NowResponse } from '@vercel/node'
import { v4 as uuidv4 } from 'uuid'

import { getAllRoomTypes, getAllProfiles } from '../../app/rooms'
import { verifyOrgJwt } from '../../app/marketplace'
import { genericApiMethodHandler, errorHandler, getOrgToken } from '../../tools'
import { IVerifiedOrgJwtResults, IRoomTypeCollection, IProfileDataCollection } from '../../types'

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

  let allProfiles: IProfileDataCollection
  try {
    allProfiles = await getAllProfiles()
  } catch (err) {
    return errorHandler(response, err)
  }

  const roomCollection = roomTypeCollection.map((roomType) => {
    const email = roomType.email
    const profile = allProfiles.find((el) => {
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
