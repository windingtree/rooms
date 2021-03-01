import {
  BaseMongoDataMapper,
} from '../../common/tools'
import {
  IBaseRoomTypeDbData,
  IRoomTypeDbData,
  IRoomTypeCollectionDbData,
  IPatchRoomTypePayloadDbData,

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
      imageUrl: baseRoomType.imageUrl,
      guestsNumber: baseRoomType.guestsNumber,
      childFriendly: baseRoomType.childFriendly,
      petFriendly: baseRoomType.petFriendly,
      beds: baseRoomType.beds,
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
      imageUrl: baseRoomTypeDbData.imageUrl,
      guestsNumber: baseRoomTypeDbData.guestsNumber,
      childFriendly: baseRoomTypeDbData.childFriendly,
      petFriendly: baseRoomTypeDbData.petFriendly,
      beds: baseRoomTypeDbData.beds,
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
      'imageUrl',
      'guestsNumber',
      'childFriendly',
      'petFriendly',
      'beds'
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
        case 'amenities':
        case 'imageUrl':
          patchRoomTypePayloadDbData[prop] = patchRoomTypePayload[prop]
          break
        case 'quantity':
        case 'price':
        case 'currency':
        case 'devConPrice':
        case 'guestsNumber':
        case 'childFriendly':
        case 'petFriendly':
        case 'beds':
          patchRoomTypePayloadDbData[prop] = patchRoomTypePayload[prop]
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
