import { Collection } from 'mongodb'

import { MongoDB } from '../../infra/mongo'
import { ENV } from '../../common/env'
import { BaseDataRepo } from '../../common/tools'
import { TProfileDbDataFields, IProfileDbDataProjection, IProfileDbData } from '../../common/types'

import {
  createProfile,
  readProfile,
  readProfileByEmail,
  readProfiles,
  updateProfile,
  deleteProfile,
} from './functions'

import { ProfileMongoDataMapper } from './ProfileMongoDataMapper'

class ProfileRepo extends BaseDataRepo {
  protected mapper = new ProfileMongoDataMapper()

  public createProfile = createProfile
  public readProfile = readProfile
  public readProfileByEmail = readProfileByEmail
  public readProfiles = readProfiles
  public updateProfile = updateProfile
  public deleteProfile = deleteProfile

  constructor() {
    super()

    this.ENTITY_NAME = 'profile'
    this.COLLECTION_NAME = 'profiles'
  }

  protected getProjection(): IProfileDbDataProjection {
    const allowedFields: Array<TProfileDbDataFields> = [
      '_id',
      'email',
      'name',
      'phone',
      'oneTimePassword',
      'sessionToken',
      'role',
      'hotelId',
    ]

    return allowedFields.reduce((projection: IProfileDbDataProjection, field) => {
      projection[field] = 1

      return projection
    }, {})
  }

  protected async getCollection(): Promise<Collection<IProfileDbData>> {
    const dbClient = await MongoDB.getInstance().getDbClient()
    const database = dbClient.db(ENV.ROOMS_DB_NAME)

    return database.collection(this.COLLECTION_NAME)
  }
}

export {
  ProfileRepo,
}
