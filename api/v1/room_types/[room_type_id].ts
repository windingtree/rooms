import { NowRequest, NowResponse } from '@vercel/node'
import { ObjectID } from 'mongodb'

import { getUserAuthDetails, DB, genericApiMethodHandler, getQueryParamValue, CError, errorHandler } from '../../tools'
import { checkRoomType } from '../../validators'
import { IUserAuthDetails, IBaseRoomType, IRoomType } from '../../types'

async function updateRoomType(id: string, email: string, roomType: IBaseRoomType): Promise<IRoomType> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('room-types')

    const filter = { _id: new ObjectID(id) }
    const options = { upsert: false }
    const updateDoc = {
      $set: Object.assign({ email }, roomType)
    }

    result = await collection.updateOne(filter, updateDoc, options)
  } catch (err) {
    throw new CError(500, 'An error occurred while updating a room type.')
  }

  if (!result || !result.matchedCount) {
    throw new CError(500, `Could not find a room type to update with ID '${id}'.`)
  }

  return Object.assign({ id }, roomType)
}

async function deleteRoomType(id: string): Promise<void> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('room-types')

    const filter = { _id: new ObjectID(id) }

    result = await collection.deleteOne(filter)
  } catch (err) {
    throw new CError(500, 'An error occurred while deleting a room type.')
  }

  if (!result || !result.deletedCount) {
    throw new CError(500, `Could not find a room type to delete with ID '${id}'.`)
  }
}

async function getRoomType(id: string): Promise<IRoomType> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('room-types')

    const query = { _id: new ObjectID(id) }
    const options = {
      projection: { _id: 1, email: 1, quantity: 1, type: 1, price: 1, amenities: 1 }
    }

    result = await collection.findOne(query, options)
  } catch (err) {
    throw new CError(500, 'An error occurred while getting a room type.')
  }

  if (result === null) {
    throw new CError(500, `Could not find a room type with ID '${id}'.`)
  }

  return {
    id: result._id,
    quantity: result.quantity,
    type: result.type,
    price: result.price,
    amenities: result.amenities,
  }
}

async function PUT(request: NowRequest, response: NowResponse): Promise<void> {
  let userAuthDetails: IUserAuthDetails
  try {
    userAuthDetails = await getUserAuthDetails(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let id: string
  try {
    id = getQueryParamValue(request, 'room_type_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    checkRoomType(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  const email: string = userAuthDetails.email

  const type: string = request.body.type
  const quantity: number = parseInt(request.body.quantity)
  const price: number = parseFloat(request.body.price)
  const amenities: string = request.body.amenities

  let roomType: IRoomType
  try {
    roomType = await updateRoomType(id, email, { type, quantity, price, amenities })
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(roomType)
}

async function GET(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await getUserAuthDetails(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let id: string
  try {
    id = getQueryParamValue(request, 'room_type_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  let roomType: IRoomType
  try {
    roomType = await getRoomType(id)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json(roomType)
}

async function DELETE(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    await getUserAuthDetails(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  let id: string
  try {
    id = getQueryParamValue(request, 'room_type_id')
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await deleteRoomType(id)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ id, deleted: true })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { GET, PUT, DELETE })
}
