import { NowRequest, NowResponse } from '@vercel/node'
import { MongoClient } from 'mongodb'

import { decodeToken } from '../tools/decode_token'
import { authorizeUser } from '../tools/authorize_user'
import { IDecodedAuthToken } from '../types/auth'
import { IRoomType, IRoomTypeCollection } from '../types/room_type'
import { MONGODB_URL } from '../tools/constants'
import { methodNotImplemented } from '../tools/generic_response'
import { isRoomTypeValid } from '../validators/room_type'
import { DB } from '../tools/db'

async function getRoomTypes(email: string): Promise<IRoomTypeCollection> {
  let roomCollection: IRoomTypeCollection = []

  const dbClient = await DB.getInstance().getDbClient()
  if (dbClient === null) {
    throw new Error('No connection to DB')
  }

  try {
    /* -------------------------------------------------- */
    console.log('getting rooms collection ...')
    console.time('db_rooms_collection')

    const database = dbClient.db('rooms-staging')
    const collection = database.collection('rooms')

    console.timeEnd('db_rooms_collection')
    /* -------------------------------------------------- */

    const query = { email }

    const options = {
      sort: { createdAt: 1 },
      projection: { _id: 1, email: 1, quantity: 1, type: 1, price: 1 }
    }

    /* -------------------------------------------------- */
    console.log('getting rooms data ...')
    console.time('db_rooms_data')

    const cursor = collection.find(query, options)

    if ((await cursor.count()) === 0) {
      return []
    }

    await cursor.forEach((item) => {
      roomCollection.push({
        id: item._id,
        quantity: item.quantity,
        type: item.type,
        price: item.price
      })
    })

    console.timeEnd('db_rooms_data')
    /* -------------------------------------------------- */
  } catch (err) {
    throw new Error(err)
  }

  return roomCollection
}

async function createRoomType(email: string, quantity: number, type: string, price: number): Promise<IRoomType> {
  let newRoomType: IRoomType

  const dbClient = await DB.getInstance().getDbClient()
  if (dbClient === null) {
    throw new Error('No connection to DB')
  }

  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('rooms')

    const doc = { email, quantity, type, price }
    const result = await collection.insertOne(doc)

    newRoomType = {
      id: result.insertedId,
      quantity,
      type,
      price
    }
  } catch (err) {
    throw new Error(err)
  }

  return newRoomType
}

function methodGet(request: NowRequest, response: NowResponse) {
  let decodedToken: IDecodedAuthToken|null = decodeToken(request, response)

  if (decodedToken === null) return

  const email: string = (decodedToken as IDecodedAuthToken).email
  const oneTimePassword: string = (decodedToken as IDecodedAuthToken).oneTimePassword

  authorizeUser(email, oneTimePassword)
    .then((userIsAuthorized: boolean) => {
      if (!userIsAuthorized) {
        response.status(401).json({ err: 'email or password do not match' })
        return
      }

      getRoomTypes(email)
        .then((roomCollection: IRoomTypeCollection) => {
          response.status(200).json(roomCollection)
        })
        .catch((err: Error) => {
          response.status(500).json({ err })
        })
    })
    .catch((err: Error) => {
      response.status(500).json({ err })
    })
}

function methodPost(request: NowRequest, response: NowResponse) {
  let decodedToken: IDecodedAuthToken|null = decodeToken(request, response)

  if (decodedToken === null) return

  const email: string = (decodedToken as IDecodedAuthToken).email
  const oneTimePassword: string = (decodedToken as IDecodedAuthToken).oneTimePassword

  authorizeUser(email, oneTimePassword)
    .then((userIsAuthorized: boolean) => {
      if (!userIsAuthorized) {
        response.status(401).json({ err: 'email or password do not match' })
        return
      }

      if (!isRoomTypeValid(request, response)) return

      const quantity: number = parseInt(request.body.quantity)
      const type: string = request.body.type
      const price: number = request.body.price

      createRoomType(email, quantity, type, price)
        .then((room: IRoomType) => {
          response.status(200).json(room)
        })
        .catch((err: Error) => {
          response.status(500).json({ err })
        })
    })
    .catch((err: Error) => {
      response.status(500).json({ err })
    })
}

export default (request: NowRequest, response: NowResponse) => {
  if (!request || typeof request.method !== 'string') {
    throw new Error('must provide request method')
  }

  const method = request.method.toUpperCase()

  switch (method) {
    case 'GET':
      methodGet(request, response)
      break
    case 'POST':
      methodPost(request, response)
      break
    default:
      methodNotImplemented(request, response)
      break
  }
}
