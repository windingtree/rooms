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
      devConPrice: baseRoomType.devConPrice,
      amenities: baseRoomType.amenities,
      imageUrl: baseRoomType.imageUrl,
    }
  }

  toBaseEntity(baseRoomTypeDbData: IBaseRoomTypeDbData): IBaseRoomType {
    return {
      hotelId: this.fromObjectId(baseRoomTypeDbData.hotelId),
      type: baseRoomTypeDbData.type,
      description: baseRoomTypeDbData.description,
      quantity: baseRoomTypeDbData.quantity,
      price: baseRoomTypeDbData.price,
      devConPrice: baseRoomTypeDbData.devConPrice,
      amenities: baseRoomTypeDbData.amenities,
      imageUrl: baseRoomTypeDbData.imageUrl,
    }
  }

  fromPatchEntityPayload(patchRoomTypePayload: IPatchRoomTypePayload): IPatchRoomTypePayloadDbData {
    const availProps: Array<keyof IPatchRoomTypePayload> = [
      'hotelId',
      'type',
      'description',
      'quantity',
      'price',
      'devConPrice',
      'amenities',
      'imageUrl',
    ]

    return availProps.reduce((patchRoomTypePayloadDbData: IPatchRoomTypePayloadDbData, prop): IPatchRoomTypePayloadDbData => {
      if (!patchRoomTypePayload[prop]) {
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
        case 'devConPrice':
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

export {
  RoomTypeMongoDataMapper,
}
