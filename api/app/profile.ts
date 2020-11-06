import { DB, CError, disableApiRequestsHere } from '../tools'
import { IProfile, IObjectHash } from '../types'
import { ROOMS_DB_NAME } from '../constants'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function getProfile(email: string): Promise<IProfile> {
  const dbClient = await DB.getInstance().getDbClient()

  let ownerRecord
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection('owners')

    const query = { email }

    const options = {
      projection: {
        _id: 0,
        email: 1,
        hotelName: 1,
        hotelAddress: 1,
        hotelLocation: 1,
      },
    }

    ownerRecord = await collection.findOne(query, options)
  } catch (err) {
    throw new CError(500, 'Something went wrong while getting a profile.')
  }

  if (!ownerRecord) {
    throw new CError(404, 'User profile not found.')
  }

  const profile: IProfile = {
    email: ownerRecord.email,
    hotelName: ownerRecord.hotelName,
    hotelAddress: ownerRecord.hotelAddress,
    hotelLocation: ownerRecord.hotelLocation,
  }

  return profile
}

async function updateProfile(email: string, property: string, value: string): Promise<void> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection('owners')

    const filter = { email }
    const options = { upsert: false }

    const updatedContent: IObjectHash = {}
    updatedContent[property] = value

    const updateDoc = {
      $set: updatedContent
    }

    result = await collection.updateOne(filter, updateDoc, options)
  } catch (err) {
    throw new CError(500, 'An error occurred while updating a profile.')
  }

  if (!result || !result.matchedCount) {
    throw new CError(500, `Could not find a profile to update with email '${email}'.`)
  }
}

export {
  getProfile,
  updateProfile,
}
