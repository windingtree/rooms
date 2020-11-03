import { DB, CError, disableApiRequestsHere } from '../tools'
import { ROOMS_DB_NAME } from '../constants'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function checkIfUserAuthenticated(email: string, oneTimePassword: string, sessionToken: string): Promise<boolean> {
  const dbClient = await DB.getInstance().getDbClient()

  let ownerRecord
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection('owners')

    const query = { email }

    const options = {
      projection: { _id: 0, email: 1, oneTimePassword: 1, sessionToken: 1 },
    }

    ownerRecord = await collection.findOne(query, options)
  } catch (err) {
    throw new CError(500, 'Something went wrong while authenticating user.')
  }

  if (!ownerRecord) {
    throw new CError(401, 'Provided email address did not match any user.')
  }

  if (ownerRecord.oneTimePassword !== oneTimePassword) {
    throw new CError(401, 'One time password is not valid.')
  }

  if (ownerRecord.sessionToken !== sessionToken) {
    throw new CError(401, 'Session token is not valid.')
  }

  return true
}

export {
  checkIfUserAuthenticated,
}
