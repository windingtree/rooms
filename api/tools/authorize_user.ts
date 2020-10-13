import { NowRequest } from '@vercel/node'
import { MongoClient } from 'mongodb'

import { DB, decodeToken } from './'
import { IDecodedAuthToken, IUserAuthDetails } from '../types'

async function authorizeUser(email: string, oneTimePassword: string, sessionToken: string): Promise<boolean> {
  const dbClient = await DB.getInstance().getDbClient()
  if (dbClient === null) {
    throw 'Could not connect to the database.'
  }

  let userIsAuthorized: boolean
  try {
    const database = (dbClient as MongoClient).db('rooms-staging')
    const collection = database.collection('owners')

    const query = { email }

    const options = {
      projection: { _id: 0, email: 1, oneTimePassword: 1, sessionToken: 1 },
    }

    const ownerRecord = await collection.findOne(query, options)

    if (
      (ownerRecord) &&
      (ownerRecord.oneTimePassword === oneTimePassword) &&
      (ownerRecord.sessionToken === sessionToken)
    ) {
      userIsAuthorized = true
    } else {
      userIsAuthorized = false
    }
  } catch (err) {
    throw 'Could not authenticate user.'
  }

  return userIsAuthorized
}

async function getUserAuthDetails(request: NowRequest): Promise<IUserAuthDetails> {
  let decodedToken: IDecodedAuthToken
  try {
    decodedToken = decodeToken(request)
  } catch (err) {
    throw err
  }

  const email: string = decodedToken.email
  const oneTimePassword: string = decodedToken.oneTimePassword
  const sessionToken: string = decodedToken.sessionToken

  let userIsAuthorized: boolean
  try {
    userIsAuthorized = await authorizeUser(email, oneTimePassword, sessionToken)
  } catch (err) {
    throw err
  }

  if (userIsAuthorized !== true) {
    throw 'Email or one time password are not valid.'
  }

  return {
    userIsAuthorized, email, oneTimePassword
  }
}

export {
  getUserAuthDetails,
  authorizeUser,
}
