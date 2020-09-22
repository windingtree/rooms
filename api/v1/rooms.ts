import { NowRequest, NowResponse } from '@vercel/node'
import { MongoClient } from 'mongodb'

import { decodeToken } from '../tools/decode_token'
import { authorizeUser } from '../tools/authorize_user'
import { IDecodedAuthToken } from '../types/auth'
import { IRoomCollection } from '../types/rooms'

const mongodb_url = process.env.MONGODB_URL || 'mongodb://localhost:27017/test'

async function dbLogic(dbClient: MongoClient, ownerEmail: string): Promise<IRoomCollection|null> {
  let roomCollection: IRoomCollection

  try {
    await dbClient.connect()

    const database = dbClient.db('rooms-staging')
    const collection = database.collection('rooms')

    const query = { email: ownerEmail }

    const options = {
      // sort matched documents in descending order by rating
      sort: { roomNumber: 1 },
      // Include only the `_id`, `roomNumber` and `roomType` fields in the returned document
      projection: { email: 0, _id: 1, roomNumber: 1, roomType: 1 },
    }

    const cursor = collection.find(query, options);

    // if no documents were found, simply return
    if ((await cursor.count()) === 0) {
      return null
    }

    roomCollection = []
    await cursor.forEach((room) => {
      roomCollection.push(room)
    });
  } finally {
    await dbClient.close()
  }

  return roomCollection
}

export default (request: NowRequest, response: NowResponse) => {
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

      const dbClient = new MongoClient(mongodb_url, {
        useUnifiedTopology: true
      })

      dbLogic(dbClient, email)
        .then((roomCollection: IRoomCollection|null) => {
          response.status(200).json({
            token: 'OK',
            email,
            oneTimePassword,
            rooms: roomCollection
          })
        })
        .catch((err: Error) => {
          response.status(500).json({ err })
        })
    })
    .catch((err: Error) => {
      response.status(500).json({ err })
    })
}
