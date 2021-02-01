import { ProfileRepo } from '../ProfileRepo'
import { IProfileDbData, IProfile } from '../../../common/types'

async function readProfileByEmail(this: ProfileRepo, email: string): Promise<IProfile> {
  let result: IProfileDbData|null
  try {
    const collection = await this.getCollection()
    const query = { email }
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

export { readProfileByEmail }
