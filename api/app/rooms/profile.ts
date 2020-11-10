import { DB, CError, disableApiRequestsHere } from '../../tools'
import { IProfileData, IProfileAuth, IExtendedProfile, IObjectHash, IProfileDataCollection } from '../../types'
import { ROOMS_DB_NAME } from '../../constants'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function createProfile(profileAuth: IProfileAuth): Promise<IProfileData> {
  const dbClient = await DB.getInstance().getDbClient()

  const profileData: IProfileData = {
    email: profileAuth.email,

    hotelName: '',
    hotelAddress: '',
    hotelLocation: { lat: 0, lng: 0 },
  }
  const extendedProfile: IExtendedProfile = Object.assign({}, profileAuth, profileData)

  let result
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection('owners')

    result = await collection.insertOne(extendedProfile)
  } catch (err) {
    throw new CError(500, 'An error occurred while creating a new owner.')
  }

  if (!result) {
    throw new CError(500, 'Could not create a new owner.')
  }

  return profileData
}

async function getProfile(email: string): Promise<IProfileData> {
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

  const profileData: IProfileData = {
    email: ownerRecord.email,
    hotelName: ownerRecord.hotelName,
    hotelAddress: ownerRecord.hotelAddress,
    hotelLocation: ownerRecord.hotelLocation,
  }

  return profileData
}

async function getProfileAuth(email: string): Promise<IProfileAuth> {
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
        oneTimePassword: 1,
        sessionToken: 1,
      },
    }

    ownerRecord = await collection.findOne(query, options)
  } catch (err) {
    throw new CError(500, 'Something went wrong while getting a profile.')
  }

  if (!ownerRecord) {
    throw new CError(404, 'User profile not found.')
  }

  const profileAuth: IProfileAuth = {
    email: ownerRecord.email,
    oneTimePassword: ownerRecord.oneTimePassword,
    sessionToken: ownerRecord.sessionToken,
  }

  return profileAuth
}

async function patchProfile(email: string, property: string, value: string): Promise<void> {
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

async function deleteProfile(email: string): Promise<void> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection('owners')

    const filter = { email }

    result = await collection.deleteOne(filter)
  } catch (err) {
    throw new CError(500, 'An error occurred while deleting a profile.')
  }

  if (!result || !result.deletedCount) {
    throw new CError(500, `Could not find a profile to delete with email '${email}'.`)
  }
}

async function getAllProfiles(): Promise<IProfileDataCollection> {
  const dbClient = await DB.getInstance().getDbClient()

  let profileCollection: IProfileDataCollection
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection('owners')

    const query = {}

    const options = {
      projection: {
        _id: 0,
        email: 1,
        hotelName: 1,
        hotelAddress: 1,
        hotelLocation: 1,
      },
    }

    const cursor = collection.find(query, options)

    if ((await cursor.count()) === 0) {
      return []
    }

    profileCollection = []
    await cursor.forEach((item) => {
      profileCollection.push({
        email: item.email,
        hotelName: item.hotelName,
        hotelAddress: item.hotelAddress,
        hotelLocation: item.hotelLocation,
      })
    })
  } catch (err) {
    throw new CError(500, 'Something went wrong while getting profiles.')
  }

  return profileCollection
}

export {
  createProfile,
  getProfile,
  getProfileAuth,
  patchProfile,
  deleteProfile,
  getAllProfiles,
}
