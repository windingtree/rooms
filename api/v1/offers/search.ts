import { NowRequest, NowResponse } from '@vercel/node'
import { v4 as uuidv4 } from 'uuid'

// import { getAllRoomTypes } from '../../_lib/data'
import { readHotels } from '../../_lib/data/hotel'
import { verifyOrgJwt } from '../../_lib/data/marketplace'
import { genericApiMethodHandler, errorHandler, getOrgToken } from '../../_lib/tools'
import { /* IVerifiedOrgJwtResults, */ /* IRoomTypeCollection, */ IHotelCollection } from '../../_lib/types'

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let jwt: string
  try {
    jwt = getOrgToken(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  // let verifiedOrgJwtResults: IVerifiedOrgJwtResults
  try {
    // verifiedOrgJwtResults = await verifyOrgJwt(jwt)
    await verifyOrgJwt(jwt)
  } catch (err) {
    return errorHandler(response, err)
  }

  // let roomTypeCollection: IRoomTypeCollection
  // try {
  //   roomTypeCollection = await getAllRoomTypes()
  // } catch (err) {
  //   return errorHandler(response, err)
  // }

  let hotelCollection: IHotelCollection
  try {
    hotelCollection = await readHotels()
  } catch (err) {
    return errorHandler(response, err)
  }

  // const roomCollection = roomTypeCollection.map((roomType) => {
  //   const email = roomType.email
  //   const hotel = profileCollection.find((el) => {
  //     return el.email === email
  //   })

  //   if (!profile) {
  //     return null
  //   }

  //   return {
  //     id: uuidv4(),
  //     type: roomType.type,
  //     price: roomType.price,
  //     hotel: profile.hotelName,
  //     address: profile.hotelAddress,
  //   }
  // }).filter((el) => {
  //   return el !== null
  // })

  const offers = hotelCollection.map((hotel) => {
    return {
      id: uuidv4(),
      type: 'small',
      price: 20.99,
      hotel: hotel.name,
      address: hotel.address,
    }
  })

  response.status(200).json({ offers })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
