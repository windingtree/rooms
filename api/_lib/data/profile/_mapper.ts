import {
  getObjectId,
  getObjectIdString,
} from '../../../_lib/tools'
import {
  IBaseProfileDbRecord,
  IProfileDbRecord,
  IProfileDbRecordCollection,
  IPatchProfilePayloadDbData,

  IBaseProfile,
  IProfile,
  IProfileCollection,
  IPatchProfilePayload,
} from '../../../_lib/types'

function baseProfileDbRecordMapper(baseProfile: IBaseProfile): IBaseProfileDbRecord {
  const baseProfileDbRecord: IBaseProfileDbRecord = {
    email: baseProfile.email,
    name: baseProfile.name,
    phone: baseProfile.phone,
    oneTimePassword: baseProfile.oneTimePassword,
    sessionToken: baseProfile.sessionToken,
    role: baseProfile.role,
    hotelId: getObjectId(baseProfile.hotelId),
  }

  return baseProfileDbRecord
}

function patchProfilePayloadDbDataMapper(patchProfilePayload: IPatchProfilePayload): IPatchProfilePayloadDbData {
  const patchProfilePayloadDbData: IPatchProfilePayloadDbData = {}
  let prop: keyof IPatchProfilePayload

  prop = 'email'
  if (typeof patchProfilePayload[prop] !== 'undefined') {
    patchProfilePayloadDbData[prop] = patchProfilePayload[prop]
  }

  prop = 'name'
  if (typeof patchProfilePayload[prop] !== 'undefined') {
    patchProfilePayloadDbData[prop] = patchProfilePayload[prop]
  }

  prop = 'phone'
  if (typeof patchProfilePayload[prop] !== 'undefined') {
    patchProfilePayloadDbData[prop] = patchProfilePayload[prop]
  }

  prop = 'oneTimePassword'
  if (typeof patchProfilePayload[prop] !== 'undefined') {
    patchProfilePayloadDbData[prop] = patchProfilePayload[prop]
  }

  prop = 'sessionToken'
  if (typeof patchProfilePayload[prop] !== 'undefined') {
    patchProfilePayloadDbData[prop] = patchProfilePayload[prop]
  }

  prop = 'role'
  if (typeof patchProfilePayload[prop] !== 'undefined') {
    patchProfilePayloadDbData[prop] = patchProfilePayload[prop]
  }

  prop = 'hotelId'
  if (typeof patchProfilePayload[prop] !== 'undefined') {
    patchProfilePayloadDbData[prop] = getObjectId(patchProfilePayload[prop])
  }

  return patchProfilePayloadDbData
}

function profileMapper(profileDbRecord: IProfileDbRecord): IProfile {
  const profile: IProfile = {
    id: getObjectIdString(profileDbRecord._id),
    email: profileDbRecord.email,
    name: profileDbRecord.name,
    phone: profileDbRecord.phone,
    oneTimePassword: profileDbRecord.oneTimePassword,
    sessionToken: profileDbRecord.sessionToken,
    role: profileDbRecord.role,
    hotelId: getObjectIdString(profileDbRecord.hotelId),
  }

  return profile
}

function profileCollectionMapper(profileDbRecordCollection: IProfileDbRecordCollection): IProfileCollection {
  const profiles: IProfileCollection = []
  profileDbRecordCollection.forEach((profileDbRecord) => {
    profiles.push(profileMapper(profileDbRecord))
  })

  return profiles
}

export {
  baseProfileDbRecordMapper,
  patchProfilePayloadDbDataMapper,
  profileMapper,
  profileCollectionMapper,
}
