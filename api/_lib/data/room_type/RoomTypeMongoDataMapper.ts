import {
  BaseMongoDataMapper,
} from '../../common/tools'
import {
  IBaseRoomTypeDbData,
  IRoomTypeDbData,
  IRoomTypeCollectionDbData,
  IPatchRoomTypePayloadDbData,

  IRoomTypeBeds,
  IRoomTypeImages,
  IBaseRoomType,
  IRoomType,
  IRoomTypeCollection,
  IPatchRoomTypePayload,
} from '../../common/types'

class RoomTypeMongoDataMapper extends BaseMongoDataMapper {
  fromBaseEntity(baseRoomType: IBaseRoomType): IBaseRoomTypeDbData {
    return {
      hotelId: this.toObjectId(baseRoomType.hotelId),
      type: baseRoomType.type,
      description: baseRoomType.description,
      quantity: baseRoomType.quantity,
      price: baseRoomType.price,
      currency: baseRoomType.currency,
      devConPrice: baseRoomType.devConPrice,
      amenities: baseRoomType.amenities,
      guestsNumber: baseRoomType.guestsNumber,
      childFriendly: baseRoomType.childFriendly,
      petFriendly: baseRoomType.petFriendly,
      beds: baseRoomType.beds,
      images: baseRoomType.images,
    }
  }

  toBaseEntity(baseRoomTypeDbData: IBaseRoomTypeDbData): IBaseRoomType {
    return {
      hotelId: this.fromObjectId(baseRoomTypeDbData.hotelId),
      type: baseRoomTypeDbData.type,
      description: baseRoomTypeDbData.description,
      quantity: baseRoomTypeDbData.quantity,
      price: baseRoomTypeDbData.price,
      currency: baseRoomTypeDbData.currency,
      devConPrice: baseRoomTypeDbData.devConPrice,
      amenities: baseRoomTypeDbData.amenities,
      guestsNumber: baseRoomTypeDbData.guestsNumber,
      childFriendly: baseRoomTypeDbData.childFriendly,
      petFriendly: baseRoomTypeDbData.petFriendly,
      beds: baseRoomTypeDbData.beds,
      images: baseRoomTypeDbData.images,
    }
  }

  fromPatchEntityPayload(patchRoomTypePayload: IPatchRoomTypePayload): IPatchRoomTypePayloadDbData {
    const availProps: Array<keyof IPatchRoomTypePayload> = [
      'hotelId',
      'type',
      'description',
      'quantity',
      'price',
      'currency',
      'devConPrice',
      'amenities',
      'guestsNumber',
      'childFriendly',
      'petFriendly',
      'beds',
      'images'
    ]

    return availProps.reduce((patchRoomTypePayloadDbData: IPatchRoomTypePayloadDbData, prop): IPatchRoomTypePayloadDbData => {
      if (patchRoomTypePayload[prop] === undefined) {
        return patchRoomTypePayloadDbData
      }

      switch (prop) {
        case 'hotelId':
          patchRoomTypePayloadDbData[prop] = this.toObjectId((patchRoomTypePayload[prop] as string))
          break
        case 'type':
        case 'description':
        case 'currency':
        case 'amenities':
          patchRoomTypePayloadDbData[prop] = (patchRoomTypePayload[prop] as string)
          break
        case 'quantity':
        case 'price':
        case 'devConPrice':
        case 'guestsNumber':
          patchRoomTypePayloadDbData[prop] = (patchRoomTypePayload[prop] as number)
          break
        case 'childFriendly':
        case 'petFriendly':
          patchRoomTypePayloadDbData[prop] = (patchRoomTypePayload[prop] as boolean)
          break
        case 'beds':
          patchRoomTypePayloadDbData[prop] = (patchRoomTypePayload[prop] as IRoomTypeBeds)
          break
        case 'images':
          patchRoomTypePayloadDbData[prop] = (patchRoomTypePayload[prop] as IRoomTypeImages)
          break
      }

      return patchRoomTypePayloadDbData
    }, {})
  }

  fromEntity(profile: IRoomType): IRoomTypeDbData {
    return Object.assign({ _id: this.toObjectId(profile.id) }, this.fromBaseEntity(profile))
  }

  toEntity(profileDbData: IRoomTypeDbData): IRoomType {
    return Object.assign({ id: this.fromObjectId(profileDbData._id) }, this.toBaseEntity(profileDbData))
  }

  fromEntityCollection(profileCollection: IRoomTypeCollection): IRoomTypeCollectionDbData {
    return profileCollection.map((profile: IRoomType): IRoomTypeDbData => {
      return this.fromEntity(profile)
    })
  }

  toEntityCollection(profileCollectionDbData: IRoomTypeCollectionDbData): IRoomTypeCollection {
    return profileCollectionDbData.map((profileDbData: IRoomTypeDbData): IRoomType => {
      return this.toEntity(profileDbData)
    })
  }
}

export { RoomTypeMongoDataMapper }
