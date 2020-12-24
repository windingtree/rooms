import { HotelRepo } from '../../../_lib/data/hotel/HotelRepo'
import { IProfile, IHotelCollection } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

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

export {
  getAllHotels,
}
