import { v4 as uuidv4 } from 'uuid'
import { ObjectID } from 'mongodb'

import { disableApiRequestsHere, DB, CError } from '../tools'
import { ROOMS_DB_NAME } from '../constants'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function updateOneTimePassword(id: string, sessionToken: string): Promise<string> {
  const dbClient = await DB.getInstance().getDbClient()

  const oneTimePassword = uuidv4()
  let result
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection('owners')

    const filter = { _id: new ObjectID(id) }
    const options = { upsert: false }
    const updateDoc = {
      $set: Object.assign({}, { oneTimePassword, sessionToken })
    }

    result = await collection.updateOne(filter, updateDoc, options)
  } catch (err) {
    throw new CError(500, 'An error occurred while updating an owner.')
  }

  if (!result || !result.matchedCount) {
    throw new CError(500, `Could not find an owner to update with ID '${id}'.`)
  }

  return oneTimePassword
}

async function getOneTimePassword(email: string, sessionToken: string): Promise<string> {
  const dbClient = await DB.getInstance().getDbClient()

  let oneTimePassword: string
  let ownerRecord
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection('owners')

    const query = { email }
    const options = {
      projection: { _id: 1, email: 1 },
    }

    ownerRecord = await collection.findOne(query, options)
  } catch (err) {
    throw new CError(500, 'Could not get an owner record.')
  }

  if (!ownerRecord) {
    oneTimePassword = uuidv4()

    const newOwner = { email, oneTimePassword, sessionToken }

    let result
    try {
      const database = dbClient.db(ROOMS_DB_NAME)
      const collection = database.collection('owners')

      result = await collection.insertOne(newOwner)
    } catch (err) {
      throw new CError(500, 'An error occurred while creating a new owner.')
    }

    if (!result) {
      throw new CError(500, 'An error occurred while creating a new owner.')
    }
  } else {
    oneTimePassword = await updateOneTimePassword(ownerRecord._id, sessionToken)
  }

  return oneTimePassword
}

export {
  getOneTimePassword,
}
