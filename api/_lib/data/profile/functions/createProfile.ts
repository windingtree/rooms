import { ProfileRepo } from '../ProfileRepo'
import { IBaseProfileDbData, IBaseProfile } from '../../../../_lib/types'

async function createProfile(this: ProfileRepo, data: IBaseProfile): Promise<string> {
  const dbData: IBaseProfileDbData = this.mapper.fromBaseEntity(data)

  let result
  try {
    const collection = await this.getCollection()

    result = await collection.insertOne(dbData)
  } catch (err: unknown) {
    throw this.errorInternalEntityCreate(err)
  }

  if (!result.insertedId) {
    throw this.errorInternalEntityCreate()
  }

  return this.mapper.fromObjectId(result.insertedId)
}

export {
  createProfile,
}
