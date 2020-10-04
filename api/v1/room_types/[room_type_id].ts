import { NowRequest, NowResponse } from '@vercel/node'
import { MongoClient, ObjectID } from 'mongodb'

import { decodeToken } from '../../tools/decode_token'
import { authorizeUser } from '../../tools/authorize_user'
import { IDecodedAuthToken } from '../../types/auth'
import { IRoomType } from '../../types/room_type'
import { MONGODB_URL } from '../../tools/constants'
import { methodNotImplemented } from '../../tools/generic_response'
import { isRoomTypeValid } from '../../validators/room_type'
import { DB } from '../../tools/db'

function getRoomTypeId(request: NowRequest): string|null {
  const {
    query: { room_type_id }
  } = request
  if (
    (!room_type_id ) ||
    (typeof room_type_id !== 'string') ||
    (room_type_id.length === 0)
  ) {
    return null
  }

  return room_type_id
}

async function updateRoomType(id: string, quantity: number, type: string, price: number): Promise<IRoomType> {
  const newRoomType: IRoomType = { id, quantity, type, price }

  const dbClient = await DB.getInstance().getDbClient()
  if (dbClient === null) {
    throw new Error('No connection to DB')
  }

  let result

  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('rooms')

    // create a filter for a document to update
    const filter = { _id: new ObjectID(id) }

    // this option instructs the method to NOT create a document
    // (if no documents match the filter)
    const options = { upsert: false }

    // create a document that sets the plot of the movie
    const updateDoc = {
      $set: { quantity, type, price }
    }

    result = await collection.updateOne(filter, updateDoc, options)
  } catch (err) {
    throw new Error(err)
  }

  if (result.matchedCount === 0) {
    throw new Error(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    )
  }

  return newRoomType
}

async function deleteRoomType(id: string): Promise<boolean> {
  const dbClient = await DB.getInstance().getDbClient()
  if (dbClient === null) {
    throw new Error('No connection to DB')
  }

  let result

  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('rooms')

    // create a filter for a document to update
    const filter = { _id: new ObjectID(id) }

    result = await collection.deleteOne(filter)
  } catch (err) {
    throw new Error(err)
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

      if (!isRoomTypeValid(request, response)) {
        return
      }

      const id: string|null = getRoomTypeId(request)
      if (id === null) {
        response.status(500).json({ err: 'room_type_id is not set' })
        return
      }

      const quantity: number = parseInt(request.body.quantity)
      const type: string = request.body.type
      const price: number = request.body.price

      updateRoomType((id as string), quantity, type, price)
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

      const id: string|null = getRoomTypeId(request)
      if (id === null) {
        response.status(500).json({ err: 'room_type_id is not set' })
        return
      }

      deleteRoomType((id as string))
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
  if (!request || typeof request.method !== 'string') {
    throw new Error('must provide request method')
  }

  const method = request.method.toUpperCase()

  switch (method) {
    case 'PUT':
      methodPut(request, response)
      break
    case 'DELETE':
      methodDelete(request, response)
      break
    default:
      methodNotImplemented(request, response)
      break
  }
}
