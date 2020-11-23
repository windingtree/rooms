import { profileCollectionMapper, readProfiles, readProfilesByOwnerId } from '../../../_lib/data/profile'
import { IProfile, IProfileCollection, IProfileDbRecordCollection } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN

async function getAllProfiles(requester: IProfile): Promise<IProfileCollection> {
  let profileDbRecordCollection: IProfileDbRecordCollection

  if (requester.role === SUPER_ADMIN) {
    profileDbRecordCollection = await readProfiles()
  } else {
    profileDbRecordCollection = await readProfilesByOwnerId(requester.id)
  }

  return profileCollectionMapper(profileDbRecordCollection)
}

export {
  getAllProfiles,
}
