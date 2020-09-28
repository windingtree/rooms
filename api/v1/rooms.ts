import { NowRequest, NowResponse } from '@vercel/node'
import { MongoClient } from 'mongodb'

import { decodeToken } from '../tools/decode_token'
import { authorizeUser } from '../tools/authorize_user'
import { IDecodedAuthToken } from '../types/auth'
import { IRoom, IRoomCollection } from '../types/rooms'
import { MONGODB_URL } from '../tools/constants'
import { methodNotImplemented } from '../tools/generic_response'
import { isRoomValid } from '../validators/rooms'
import { DB } from '../tools/db'

async function getRooms(email: string): Promise<IRoomCollection> {
  let roomCollection: IRoomCollection = []

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
      sort: { roomNumber: 1 },
      projection: { _id: 1, email: 1, roomNumber: 1, roomType: 1, isEmpty: 1 }
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
        roomId: item._id,
        roomNumber: item.roomNumber,
        roomType: item.roomType,
        isEmpty: item.isEmpty
      })
    });

    console.timeEnd('db_rooms_data')
    /* -------------------------------------------------- */
  } catch (err) {
    throw new Error(err)
  }

  return roomCollection
}

async function createRoom(email: string, roomNumber: number, roomType: string, isEmpty: number): Promise<IRoom> {
  let newRoom: IRoom

  const dbClient = await DB.getInstance().getDbClient()
  if (dbClient === null) {
    throw new Error('No connection to DB')
  }

  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('rooms')

    const doc = { email, roomNumber, roomType, isEmpty }
    const result = await collection.insertOne(doc)

    newRoom = {
      roomId: result.insertedId,
      roomNumber,
      roomType,
      isEmpty
    }
  } catch (err) {
    throw new Error(err)
  }

  return newRoom
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

      getRooms(email)
        .then((roomCollection: IRoomCollection) => {
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

      if (!isRoomValid(request, response)) return

      const roomNumber: number = parseInt(request.body.roomNumber)
      const roomType: string = request.body.roomType
      const isEmpty: number = request.body.isEmpty

      createRoom(email, roomNumber, roomType, isEmpty)
        .then((room: IRoom) => {
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
  switch (request.method) {
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
