import { ObjectID } from 'mongodb'

import { DB, CError, disableApiRequestsHere } from '../../tools'
import { IRoomType, IBaseRoomType, IRoomTypeCollection } from '../../types'
import { ROOMS_DB_NAME } from '../../constants'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function createRoomType(email: string, newRoomType: IBaseRoomType): Promise<IRoomType> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection('room-types')

    const doc = Object.assign({ email }, newRoomType)
    result = await collection.insertOne(doc)
  } catch (err) {
    throw new CError(500, 'An error occurred while creating a new room type.')
  }

  if (!result) {
    throw new CError(500, 'Could not create a new room type.')
  }

  return Object.assign({ id: result.insertedId, email }, newRoomType)
}

async function getRoomType(id: string): Promise<IRoomType> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
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
    email: result.email,
    quantity: result.quantity,
    type: result.type,
    price: result.price,
    amenities: result.amenities,
  }
}

async function updateRoomType(id: string, email: string, roomType: IBaseRoomType): Promise<IRoomType> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
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

  return Object.assign({ id, email }, roomType)
}

async function deleteRoomType(id: string): Promise<void> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
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

async function getRoomTypes(email: string): Promise<IRoomTypeCollection> {
  const dbClient = await DB.getInstance().getDbClient()

  let roomTypeCollection: IRoomTypeCollection
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
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
        email: item.email,
        quantity: item.quantity,
        type: item.type,
        price: item.price,
        amenities: item.amenities,
      })
    })
  } catch (err) {
    throw new CError(500, 'An error occurred while getting room types.')
  }

  return roomTypeCollection
}

async function getAllRoomTypes(): Promise<IRoomTypeCollection> {
  const dbClient = await DB.getInstance().getDbClient()

  let roomTypeCollection: IRoomTypeCollection
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection('room-types')

    const query = {}

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
        email: item.email,
        quantity: item.quantity,
        type: item.type,
        price: item.price,
        amenities: item.amenities,
      })
    })
  } catch (err) {
    throw new CError(500, 'An error occurred while getting room types.')
  }

  return roomTypeCollection
}

export {
  createRoomType,
  getRoomType,
  updateRoomType,
  deleteRoomType,
  getRoomTypes,
  getAllRoomTypes,
}
