import { ProfileRepo } from '../ProfileRepo'
import { IProfileDbData, IProfile } from '../../../common/types'

async function readProfile(this: ProfileRepo, profileId: string): Promise<IProfile> {
  let result: IProfileDbData|null
  try {
    const collection = await this.getCollection()
    const query = { _id: this.mapper.toObjectId(profileId) }
    const options = { projection: this.getProjection() }

    result = await collection.findOne(query, options)
  } catch (err: unknown) {
    throw this.errorInternalEntityRead(err)
  }

  if (!result) {
    throw this.errorEntityNotFound()
  }

  return this.mapper.toEntity(result)
}

export {
  readProfile,
}
