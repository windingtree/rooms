import { hotelCollectionMapper, readHotels, readHotelsByOwnerId } from '../../../_lib/data/hotel'
import { IProfile, IHotelCollection, IHotelDbRecordCollection } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN

async function getAllHotels(requester: IProfile): Promise<IHotelCollection> {
  let hotelDbRecordCollection: IHotelDbRecordCollection

  if (requester.role === SUPER_ADMIN) {
    hotelDbRecordCollection = await readHotels()
  } else {
    hotelDbRecordCollection = await readHotelsByOwnerId(requester.id)
  }

  return hotelCollectionMapper(hotelDbRecordCollection)
}

export {
  getAllHotels,
}
