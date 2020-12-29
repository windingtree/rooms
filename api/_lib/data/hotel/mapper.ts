import {
  BaseMongoDataMapper,
} from '../../../_lib/tools'
import {
  IBaseHotelDbData,
  IHotelDbData,
  IHotelCollectionDbData,
  IPatchHotelPayloadDbData,

  IBaseHotel,
  IHotel,
  IHotelCollection,
  IPatchHotelPayload,

  IHotelLocation,
} from '../../../_lib/types'

class MongoDataMapper extends BaseMongoDataMapper {
  fromBaseEntity(baseHotel: IBaseHotel): IBaseHotelDbData {
    return {
      ownerId: this.toObjectId(baseHotel.ownerId),
      name: baseHotel.name,
      description: baseHotel.description,
      address: baseHotel.address,
      location: {
        type: 'Point',
        coordinates: [
          (baseHotel.location as IHotelLocation).lat,
          (baseHotel.location as IHotelLocation).lng,
        ]
      },
      imageUrl: baseHotel.imageUrl,
      email: baseHotel.email,
    }
  }

  fromPatchEntityPayload(patchHotelPayload: IPatchHotelPayload): IPatchHotelPayloadDbData {
    const availProps: Array<keyof IPatchHotelPayload> = [
      'ownerId',
      'name',
      'description',
      'address',
      'location',
      'imageUrl',
      'email',
    ]

    return availProps.reduce((patchHotelPayloadDbData: IPatchHotelPayloadDbData, prop): IPatchHotelPayloadDbData => {
      if (!patchHotelPayload[prop]) {
        return patchHotelPayloadDbData
      }

      switch (prop) {
        case 'ownerId':
          patchHotelPayloadDbData[prop] = this.toObjectId((patchHotelPayload[prop] as string))
          break
        case 'location':
          patchHotelPayloadDbData[prop] = {
            type: 'Point',
            coordinates: [
              (patchHotelPayload[prop] as IHotelLocation).lat,
              (patchHotelPayload[prop] as IHotelLocation).lng,
            ]
          }
          break
        case 'name':
        case 'description':
        case 'address':
        case 'imageUrl':
        case 'email':
          patchHotelPayloadDbData[prop] = patchHotelPayload[prop]
          break
      }

      return patchHotelPayloadDbData
    }, {})
  }

  toEntity(hotelDbData: IHotelDbData): IHotel {
    return {
      id: this.fromObjectId(hotelDbData._id),
      ownerId: this.fromObjectId(hotelDbData.ownerId),
      name: hotelDbData.name,
      description: hotelDbData.description,
      address: hotelDbData.address,
      location: {
        lat: hotelDbData.location.coordinates[0],
        lng: hotelDbData.location.coordinates[1],
      },
      imageUrl: hotelDbData.imageUrl,
      email: hotelDbData.email,
    }
  }

  toEntityCollection(hotelCollectionDbData: IHotelCollectionDbData): IHotelCollection {
    return hotelCollectionDbData.map((hotelDbData: IHotelDbData): IHotel => {
      return this.toEntity(hotelDbData)
    })
  }
}

export {
  MongoDataMapper,
}
