import {
  BaseMongoDataMapper,
} from '../../common/tools'
import {
  IBaseProfileDbData,
  IProfileDbData,
  IProfileCollectionDbData,
  IPatchProfilePayloadDbData,

  IBaseProfile,
  IProfile,
  IProfileCollection,
  IPatchProfilePayload,
} from '../../common/types'

class ProfileMongoDataMapper extends BaseMongoDataMapper {
  fromBaseEntity(baseProfile: IBaseProfile): IBaseProfileDbData {
    return {
      email: baseProfile.email,
      name: baseProfile.name,
      phone: baseProfile.phone,
      oneTimePassword: baseProfile.oneTimePassword,
      sessionToken: baseProfile.sessionToken,
      role: baseProfile.role,
      hotelId: this.toObjectId(baseProfile.hotelId),
    }
  }

  toBaseEntity(baseProfileDbData: IBaseProfileDbData): IBaseProfile {
    return {
      email: baseProfileDbData.email,
      name: baseProfileDbData.name,
      phone: baseProfileDbData.phone,
      oneTimePassword: baseProfileDbData.oneTimePassword,
      sessionToken: baseProfileDbData.sessionToken,
      role: baseProfileDbData.role,
      hotelId: this.fromObjectId(baseProfileDbData.hotelId),
    }
  }

  fromPatchEntityPayload(patchProfilePayload: IPatchProfilePayload): IPatchProfilePayloadDbData {
    const availProps: Array<keyof IPatchProfilePayload> = [
      'email',
      'name',
      'phone',
      'oneTimePassword',
      'sessionToken',
      'role',
      'hotelId',
    ]

    return availProps.reduce((patchProfilePayloadDbData: IPatchProfilePayloadDbData, prop): IPatchProfilePayloadDbData => {
      if (!patchProfilePayload[prop]) {
        return patchProfilePayloadDbData
      }

      switch (prop) {
        case 'email':
        case 'name':
        case 'phone':
        case 'oneTimePassword':
        case 'sessionToken':
          patchProfilePayloadDbData[prop] = patchProfilePayload[prop]
          break
        case 'role':
          patchProfilePayloadDbData[prop] = patchProfilePayload[prop]
          break
        case 'hotelId':
          patchProfilePayloadDbData[prop] = this.toObjectId((patchProfilePayload[prop] as string))
          break
      }

      return patchProfilePayloadDbData
    }, {})
  }

  fromEntity(profile: IProfile): IProfileDbData {
    return Object.assign({ _id: this.toObjectId(profile.id) }, this.fromBaseEntity(profile))
  }

  toEntity(profileDbData: IProfileDbData): IProfile {
    return Object.assign({ id: this.fromObjectId(profileDbData._id) }, this.toBaseEntity(profileDbData))
  }

  fromEntityCollection(profileCollection: IProfileCollection): IProfileCollectionDbData {
    return profileCollection.map((profile: IProfile): IProfileDbData => {
      return this.fromEntity(profile)
    })
  }

  toEntityCollection(profileCollectionDbData: IProfileCollectionDbData): IProfileCollection {
    return profileCollectionDbData.map((profileDbData: IProfileDbData): IProfile => {
      return this.toEntity(profileDbData)
    })
  }
}

export { ProfileMongoDataMapper }
