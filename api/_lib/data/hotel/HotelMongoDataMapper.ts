import {
  BaseMongoDataMapper,
} from '../../common/tools'
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
} from '../../common/types'

class HotelMongoDataMapper extends BaseMongoDataMapper {
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
      images: baseHotel.images,
      email: baseHotel.email,
    }
  }

  toBaseEntity(baseHotelDbData: IBaseHotelDbData): IBaseHotel {
    return {
      ownerId: this.fromObjectId(baseHotelDbData.ownerId),
      name: baseHotelDbData.name,
      description: baseHotelDbData.description,
      address: baseHotelDbData.address,
      location: {
        lat: baseHotelDbData.location.coordinates[0],
        lng: baseHotelDbData.location.coordinates[1],
      },
      images: (typeof baseHotelDbData.images !== 'undefined') ?
        baseHotelDbData.images.map((img) => img) :
        [],
      email: baseHotelDbData.email,
    }
  }

  fromPatchEntityPayload(patchHotelPayload: IPatchHotelPayload): IPatchHotelPayloadDbData {
    const availProps: Array<keyof IPatchHotelPayload> = [
      'ownerId',
      'location',
      'name',
      'description',
      'address',
      'email',
      'images',
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
        case 'email':
          patchHotelPayloadDbData[prop] = patchHotelPayload[prop]
          break
        case 'images':
          patchHotelPayloadDbData[prop] = (typeof patchHotelPayload[prop] !== 'undefined') ?
            (patchHotelPayload[prop] as Array<string>).map((img) => img) :
            []
          break
      }

      return patchHotelPayloadDbData
    }, {})
  }

  fromEntity(hotel: IHotel): IHotelDbData {
    return Object.assign({ _id: this.toObjectId(hotel.id) }, this.fromBaseEntity(hotel))
  }

  toEntity(hotelDbData: IHotelDbData): IHotel {
    return Object.assign({ id: this.fromObjectId(hotelDbData._id) }, this.toBaseEntity(hotelDbData))
  }

  fromEntityCollection(hotelCollection: IHotelCollection): IHotelCollectionDbData {
    return hotelCollection.map((hotel: IHotel): IHotelDbData => {
      return this.fromEntity(hotel)
    })
  }

  toEntityCollection(hotelCollectionDbData: IHotelCollectionDbData): IHotelCollection {
    return hotelCollectionDbData.map((hotelDbData: IHotelDbData): IHotel => {
      return this.toEntity(hotelDbData)
    })
  }
}

export { HotelMongoDataMapper }
