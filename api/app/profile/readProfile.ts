import { ObjectID } from 'mongodb'

import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { disableApiRequestsHere, DB, CError } from '../../tools'
import { IProfile } from '../../types'
import { ROOMS_DB_NAME } from '../../constants'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function readProfile(id: string): Promise<IProfile> {
  const dbClient = await DB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    const query = { _id: new ObjectID(id) }

    const options = {
      projection: {
        _id: 1,
        email: 1,
        oneTimePassword: 1,
        sessionToken: 1,
        role: 1,
      },
    }

    result = await collection.findOne(query, options)
  } catch (err) {
    throw new CError(500, `An error occurred while retrieving a '${ENTITY_NAME}'.`)
  }

  if (!result) {
    throw new CError(404, `A '${ENTITY_NAME}' was not found.`)
  }

  const profile: IProfile = {
    id: result._id,
    email: result.email,
    oneTimePassword: result.oneTimePassword,
    sessionToken: result.sessionToken,
    role: result.role,
  }

  return profile
}

export {
  readProfile,
}
