import { CError } from '../../../_lib/tools'
import { MongoDB } from '../../../_lib/infra/mongo'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { BAD_GATEWAY } = CONSTANTS.HTTP_STATUS

async function pingMongo(): Promise<void> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  try {
    await dbClient.db().admin().ping()
  } catch (err) {
    throw new CError(BAD_GATEWAY, 'Could not complete ping() operation on the MongoDB.')
  }
}

export {
  pingMongo,
}
