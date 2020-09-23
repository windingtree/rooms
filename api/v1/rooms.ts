import { NowRequest, NowResponse } from '@vercel/node'
import { MongoClient } from 'mongodb'

import { decodeToken } from '../tools/decode_token'
import { authorizeUser } from '../tools/authorize_user'
import { IDecodedAuthToken } from '../types/auth'
import { IRoom, IRoomCollection } from '../types/rooms'
import { MONGODB_URL } from '../tools/constants'
import { methodNotImplemented } from '../tools/generic_response';
import { isRoomValid } from '../validators/rooms'
import { getDbClient } from '../tools/db';

async function getRooms(email: string): Promise<IRoomCollection> {
  let roomCollection: IRoomCollection = []

  const dbClient = await getDbClient()
  if (dbClient === null) {
    throw new Error('No connection to DB')
  }

  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('rooms')

    const query = { email }

    const options = {
      sort: { roomNumber: 1 },
      projection: { _id: 1, email: 1, roomNumber: 1, roomType: 1 }
    }

    const cursor = collection.find(query, options);

    if ((await cursor.count()) === 0) {
      return []
    }

    await cursor.forEach((room) => {
      roomCollection.push(room)
    });
  } catch (err) {
    throw new Error(err)
  }

  return roomCollection
}

async function createRoom(email: string, roomNumber: number, roomType: string): Promise<IRoom> {
  let newRoom: IRoom = {
    roomId: '',
    roomNumber: 0,
    roomType: ''
  }

  const dbClient = await getDbClient()
  if (dbClient === null) {
    throw new Error('No connection to DB')
  }

  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('rooms')

    const doc = { email, roomNumber, roomType };
    const result = await collection.insertOne(doc);

    newRoom.roomId = result.insertedId
    newRoom.roomNumber = roomNumber
    newRoom.roomType = roomType
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

      createRoom(email, roomNumber, roomType)
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
      break;
    case 'POST':
      methodPost(request, response)
      break;
    default:
      methodNotImplemented(request, response)
      break;
  }
}
