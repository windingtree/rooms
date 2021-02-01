import { HotelRepo } from '../../data/hotel/HotelRepo'

import { CONSTANTS } from '../../common/constants'
import { IProfile, IHotelCollection } from '../../common/types'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const hotelRepo = new HotelRepo()

async function getAllHotels(requester: IProfile): Promise<IHotelCollection> {
  let hotelCollection: IHotelCollection

  if (requester.role === SUPER_ADMIN) {
    hotelCollection = await hotelRepo.readHotels()
  } else {
    hotelCollection = await hotelRepo.readHotelsByOwnerId(requester.id)
  }

  return hotelCollection
}

export { getAllHotels }
