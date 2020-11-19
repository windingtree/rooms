import { readHotels, readHotelsByOwnerId } from '../../../_lib/data/hotel'
import { IProfile, IHotelCollection } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN

async function getAllHotels(requester: IProfile): Promise<IHotelCollection> {
  let hotels: IHotelCollection

  if (requester.role === SUPER_ADMIN) {
    hotels = await readHotels()
  } else {
    hotels = await readHotelsByOwnerId(requester.id)
  }

  return hotels
}

export {
  getAllHotels,
}
