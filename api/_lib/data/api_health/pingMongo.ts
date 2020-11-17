import { CError } from '../../tools'
import { MongoDB } from '../../infra/mongo'

async function pingMongo(): Promise<void> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  try {
    await dbClient.db().admin().ping()
  } catch (err) {
    throw new CError(500, 'Could not complete ping() operation on the database.')
  }
}

export {
  pingMongo,
}
