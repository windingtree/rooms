import { readHotels, readHotelsByOwnerId } from '../../../_lib/data/hotel'
import { IProfile, IHotelCollection } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN

async function getAllHotels(requester: IProfile): Promise<IHotelCollection> {
  let hotelCollection: IHotelCollection

  if (requester.role === SUPER_ADMIN) {
    hotelCollection = await readHotels()
  } else {
    hotelCollection = await readHotelsByOwnerId(requester.id)
  }

  return hotelCollection
}

export {
  getAllHotels,
}
