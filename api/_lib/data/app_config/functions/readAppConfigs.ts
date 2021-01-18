import { AppConfigRepo } from '../AppConfigRepo'
import { IAppConfigCollectionDbData, IAppConfigCollection } from '../../../common/types'

async function readAppConfigs(this: AppConfigRepo): Promise<IAppConfigCollection> {
  const result: IAppConfigCollectionDbData = []
  try {
    const collection = await this.getCollection()
    const query = {}
    const options = { projection: this.getProjection() }

    const cursor = collection.find(query, options)
    if ((await cursor.count()) === 0) {
      return []
    }
    await cursor.forEach((item) => {
      result.push(item)
    })
  } catch (err: unknown) {
    throw this.errorInternalEntityCollectionRead(err)
  }

  return this.mapper.toEntityCollection(result)
}

export { readAppConfigs }
