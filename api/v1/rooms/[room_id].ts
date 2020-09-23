import { NowRequest, NowResponse } from '@vercel/node'
import { MongoClient, ObjectID } from 'mongodb'

import { decodeToken } from '../../tools/decode_token'
import { authorizeUser } from '../../tools/authorize_user'
import { IDecodedAuthToken } from '../../types/auth'
import { IRoom } from '../../types/rooms'
import { MONGODB_URL } from '../../tools/constants'
import { methodNotImplemented } from '../../tools/generic_response'
import { isRoomValid } from '../../validators/rooms'

function getRoomId(request: NowRequest): string|null {
  const {
    query: { room_id }
  } = request
  if (
    (!room_id ) ||
    (typeof room_id !== 'string') ||
    (room_id.length === 0)
  ) {
    return null
  }

  return room_id
}

async function updateRoom(roomId: string, roomNumber: number, roomType: string): Promise<IRoom> {
  const newRoom: IRoom = { roomId, roomNumber, roomType }

  const dbClient = new MongoClient(MONGODB_URL, { useUnifiedTopology: true })

  let result

  try {
    await dbClient.connect()

    const database = dbClient.db('rooms-staging')
    const collection = database.collection('rooms')

    // create a filter for a document to update
    const filter = { _id: new ObjectID(roomId) }

    // this option instructs the method to NOT create a document
    // (if no documents match the filter)
    const options = { upsert: false }

    // create a document that sets the plot of the movie
    const updateDoc = {
      $set: { roomNumber, roomType }
    }

    result = await collection.updateOne(filter, updateDoc, options)
  } finally {
    await dbClient.close()
  }

  if (result.matchedCount === 0) {
    throw new Error(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    )
  }

  return newRoom
}

async function deleteRoom(roomId: string): Promise<boolean> {
  const dbClient = new MongoClient(MONGODB_URL, { useUnifiedTopology: true })

  let result

  try {
    await dbClient.connect()

    const database = dbClient.db('rooms-staging')
    const collection = database.collection('rooms')

    // create a filter for a document to update
    const filter = { _id: new ObjectID(roomId) }

    result = await collection.deleteOne(filter)
  } finally {
    await dbClient.close()
  }

  if (result && result.deletedCount) {
    return true
  }

  return false
}

function methodPut(request: NowRequest, response: NowResponse) {
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

      if (!isRoomValid(request, response)) {
        return
      }

      const roomId: string|null = getRoomId(request)
      if (roomId === null) {
        response.status(500).json({ err: 'room_id is not set' })
        return
      }

      const roomNumber: number = parseInt(request.body.roomNumber)
      const roomType: string = request.body.roomType

      updateRoom((roomId as string), roomNumber, roomType)
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

function methodDelete(request: NowRequest, response: NowResponse) {
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

      const roomId: string|null = getRoomId(request)
      if (roomId === null) {
        response.status(500).json({ err: 'room_id is not set' })
        return
      }

      deleteRoom((roomId as string))
        .then((isDeleted: boolean) => {
          if (isDeleted) {
            response.status(200).json({ deleted: 1 })
          } else {
            response.status(404).json({ deleted: 0 })
          }
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
    case 'PUT':
      methodPut(request, response)
      break;
    case 'DELETE':
      methodDelete(request, response)
      break;
    default:
      methodNotImplemented(request, response)
      break;
  }
}
