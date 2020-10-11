import { NowRequest, NowResponse } from '@vercel/node'

import { getUserAuthDetails, genericApiMethodHandler, DB } from '../tools'
import { checkRoomType } from '../validators'
import { IUserAuthDetails, IBaseRoomType, IRoomType, IRoomTypeCollection } from '../types'

async function getRoomTypes(email: string): Promise<IRoomTypeCollection> {
  const dbClient = await DB.getInstance().getDbClient()
  if (dbClient === null) {
    throw 'Could not connect to the database.'
  }

  let roomTypeCollection: IRoomTypeCollection
  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('room-types')

    const query = { email }

    const options = {
      sort: { createdAt: 1 },
      projection: { _id: 1, email: 1, quantity: 1, type: 1, price: 1, amenities: 1 }
    }

    const cursor = collection.find(query, options)

    if ((await cursor.count()) === 0) {
      return []
    }

    roomTypeCollection = []
    await cursor.forEach((item) => {
      roomTypeCollection.push({
        id: item._id,
        quantity: item.quantity,
        type: item.type,
        price: item.price,
        amenities: item.amenities,
      })
    })
  } catch (err) {
    throw 'An error occurred while getting room types.'
  }

  return roomTypeCollection
}

async function createRoomType(email: string, newRoomType: IBaseRoomType): Promise<IRoomType> {
  const dbClient = await DB.getInstance().getDbClient()
  if (dbClient === null) {
    throw 'Could not connect to the database.'
  }

  let roomType: IRoomType
  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('room-types')

    const doc = Object.assign({ email }, newRoomType)
    const result = await collection.insertOne(doc)

    if (!result) {
      throw 'An error occurred while creating a new room type.'
    }

    roomType = Object.assign({ id: result.insertedId }, newRoomType)
  } catch (err) {
    throw 'An error occurred while creating a new room type.'
  }

  return roomType
}

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  let userAuthDetails: IUserAuthDetails
  try {
    userAuthDetails = await getUserAuthDetails(request)
  } catch (err) {
    response.status(500).json({ err })
    return
  }

  let roomCollection: IRoomTypeCollection
  try {
    roomCollection = await getRoomTypes(userAuthDetails.email)
  } catch (err) {
    response.status(500).json({ err })
    return
  }

  response.status(200).json(roomCollection)
}

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  let userAuthDetails: IUserAuthDetails
  try {
    userAuthDetails = await getUserAuthDetails(request)
  } catch (err) {
    response.status(500).json({ err })
    return
  }

  try {
    checkRoomType(request)
  } catch (err) {
    response.status(500).json({ err })
    return
  }

  const type: string = request.body.type
  const quantity: number = parseInt(request.body.quantity)
  const price: number = parseFloat(request.body.price)
  const amenities: string = request.body.amenities

  let roomType: IRoomType
  try {
    roomType = await createRoomType(userAuthDetails.email, { type, quantity, price, amenities })
  } catch (err) {
    response.status(500).json({ err })
    return
  }

  response.status(200).json(roomType)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, POST })
}
