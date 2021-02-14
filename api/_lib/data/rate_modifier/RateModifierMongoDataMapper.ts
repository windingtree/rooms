import {
  BaseMongoDataMapper,
} from '../../common/tools'
import {
  IBaseRateModifierDbData,
  IRateModifierDbData,
  IRateModifierCollectionDbData,
  IPatchRateModifierPayloadDbData,

  IBaseRateModifier,
  IRateModifier,
  IRateModifierCollection,
  IPatchRateModifierPayload,
} from '../../common/types'

class RateModifierMongoDataMapper extends BaseMongoDataMapper {
  fromBaseEntity(baseRoomType: IBaseRateModifier): IBaseRateModifierDbData {
    return {
      hotelId: this.toObjectId(baseRoomType.hotelId),
      type: baseRoomType.type,
      description: baseRoomType.description,
      enabled:baseRoomType.enabled
    }
  }

  toBaseEntity(baseRoomTypeDbData: IBaseRateModifierDbData): IBaseRateModifier {
    return {
      hotelId: this.fromObjectId(baseRoomTypeDbData.hotelId),
      type: baseRoomTypeDbData.type,
      description: baseRoomTypeDbData.description,
      enabled:baseRoomTypeDbData.enabled
    }
  }

  fromPatchEntityPayload(patchRoomTypePayload: IPatchRateModifierPayload): IPatchRateModifierPayloadDbData {
    const availProps: Array<keyof IPatchRateModifierPayload> = [
      'hotelId',
      'type',
      'description',
      'enabled'
    ]

    return availProps.reduce((patchRoomTypePayloadDbData: IPatchRateModifierPayloadDbData, prop): IPatchRateModifierPayloadDbData => {
      if (!(prop in patchRoomTypePayload)) {
        return patchRoomTypePayloadDbData
      }

      switch (prop) {
        case 'hotelId':
          patchRoomTypePayloadDbData[prop] = this.toObjectId((patchRoomTypePayload[prop] as string))
          break
        case 'enabled':
          patchRoomTypePayloadDbData[prop] = (patchRoomTypePayload[prop] as boolean)
          break
        default:
          patchRoomTypePayloadDbData[prop] = patchRoomTypePayload[prop] as string
      }

      return patchRoomTypePayloadDbData
    }, {})
  }

  fromEntity(profile: IRateModifier): IRateModifierDbData {
    return Object.assign({ _id: this.toObjectId(profile.id) }, this.fromBaseEntity(profile))
  }

  toEntity(profileDbData: IRateModifierDbData): IRateModifier {
    return Object.assign({ id: this.fromObjectId(profileDbData._id) }, this.toBaseEntity(profileDbData))
  }

  fromEntityCollection(profileCollection: IRateModifierCollection): IRateModifierCollectionDbData {
    return profileCollection.map((profile: IRateModifier): IRateModifierDbData => {
      return this.fromEntity(profile)
    })
  }

  toEntityCollection(profileCollectionDbData: IRateModifierCollectionDbData): IRateModifierCollection {
    return profileCollectionDbData.map((profileDbData: IRateModifierDbData): IRateModifier => {
      return this.toEntity(profileDbData)
    })
  }
}

export { RateModifierMongoDataMapper }
