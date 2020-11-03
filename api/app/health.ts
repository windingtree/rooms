import { disableApiRequestsHere, DB, CError } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function pingDatabase(): Promise<void> {
  const dbClient = await DB.getInstance().getDbClient()

  try {
    await dbClient.db().admin().ping()
  } catch (err) {
    throw new CError(500, 'Could not complete ping() operation on the database.')
  }
}

export {
  pingDatabase,
}
