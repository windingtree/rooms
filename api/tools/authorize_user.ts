import { NowRequest } from '@vercel/node'
import { MongoClient } from 'mongodb'

import { DB, decodeToken, CError } from './'
import { IDecodedAuthToken, IUserAuthDetails } from '../types'
import { ROOMS_DB_NAME } from '../constants'

async function authorizeUser(email: string, oneTimePassword: string, sessionToken: string): Promise<boolean> {
  const dbClient = await DB.getInstance().getDbClient()

  let ownerRecord
  try {
    const database = (dbClient as MongoClient).db(ROOMS_DB_NAME)
    const collection = database.collection('owners')

    const query = { email }

    const options = {
      projection: { _id: 0, email: 1, oneTimePassword: 1, sessionToken: 1 },
    }

    ownerRecord = await collection.findOne(query, options)
  } catch (err) {
    throw new CError(401, 'Could not authenticate user.')
  }

  if (
    (!ownerRecord) ||
    (ownerRecord.oneTimePassword !== oneTimePassword) ||
    (ownerRecord.sessionToken !== sessionToken)
  ) {
    throw new CError(401, 'Email or one time password are not valid.')
  }

  return true
}

async function getUserAuthDetails(request: NowRequest): Promise<IUserAuthDetails> {
  const decodedToken: IDecodedAuthToken = decodeToken(request)

  const email: string = decodedToken.email
  const oneTimePassword: string = decodedToken.oneTimePassword
  const sessionToken: string = decodedToken.sessionToken

  const userIsAuthorized: boolean = await authorizeUser(email, oneTimePassword, sessionToken)

  return {
    userIsAuthorized, email, oneTimePassword
  }
}

export {
  getUserAuthDetails,
  authorizeUser,
}
