import { IHotelDbRecord, IHotel, IHotelDbRecordCollection, IHotelCollection } from '../../../_lib/types'

function hotelMapper(hotelDbRecord: IHotelDbRecord): IHotel {
  const hotel: IHotel = {
    id: hotelDbRecord._id,
    ownerId: hotelDbRecord.ownerId,
    name: hotelDbRecord.name,
    address: hotelDbRecord.address,
    location: hotelDbRecord.location,
  }

  return hotel
}

function hotelCollectionMapper(hotelDbRecordCollection: IHotelDbRecordCollection): IHotelCollection {
  const hotels: IHotelCollection = []
  hotelDbRecordCollection.forEach((hotelDbRecord) => {
    hotels.push(hotelMapper(hotelDbRecord))
  })

  return hotels
}

export {
  hotelMapper,
  hotelCollectionMapper,
}
