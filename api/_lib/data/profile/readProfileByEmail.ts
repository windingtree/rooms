import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { CError } from '../../tools'
import { IProfile } from '../../types'
import { MongoDB } from '../../infra/mongo'
import { ENV } from '../../infra/env'

async function readProfileByEmail(email: string): Promise<IProfile> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  let result
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)

    const query = { email }

    const options = {
      projection: {
        _id: 1,
        email: 1,
        name: 1,
        phone: 1,
        oneTimePassword: 1,
        sessionToken: 1,
        role: 1,
        hotelId: 1,
      },
    }

    result = await collection.findOne(query, options)
  } catch (err) {
    throw new CError(500, `An error occurred while retrieving a '${ENTITY_NAME}'.`)
  }

  if (!result) {
    console.log('B')
    throw new CError(404, `A '${ENTITY_NAME}' was not found.`)
  }

  const profile: IProfile = {
    id: result._id,
    email: result.email,
    name: result.name,
    phone: result.phone,
    oneTimePassword: result.oneTimePassword,
    sessionToken: result.sessionToken,
    role: result.role,
    hotelId: result.hotelId,
  }

  return profile
}

export {
  readProfileByEmail,
}
