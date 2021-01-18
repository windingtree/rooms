import { ProfileRepo } from '../ProfileRepo'
import { IPatchProfilePayloadDbData, IPatchProfilePayload } from '../../../common/types'

async function updateProfile(this: ProfileRepo, profileId: string, data: IPatchProfilePayload): Promise<void> {
  const dbData: IPatchProfilePayloadDbData = this.mapper.fromPatchEntityPayload(data)

  let result
  try {
    const collection = await this.getCollection()
    const filter = { _id: this.mapper.toObjectId(profileId) }
    const options = { upsert: false }
    const updateDoc = { $set: dbData }

    result = await collection.updateOne(filter, updateDoc, options)
  } catch (err: unknown) {
    throw this.errorInternalEntityUpdate(err)
  }

  if (!result || !result.matchedCount) {
    throw this.errorEntityNotFound()
  }
}

export { updateProfile }
