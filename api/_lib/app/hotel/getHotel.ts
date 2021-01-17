// data layer imports
import { HotelRepo } from '../../data/hotel/HotelRepo'

// common imports
import { CONSTANTS } from '../../common/constants'
import { IProfile, IHotel } from '../../common/types'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const hotelRepo = new HotelRepo()

async function getHotel(requester: IProfile, hotelId: string): Promise<IHotel> {
  let hotel: IHotel

  if (requester.role === SUPER_ADMIN) {
    hotel = await hotelRepo.readHotel(hotelId)
  } else {
    hotel = await hotelRepo.readHotelByOwnerId(hotelId, requester.id)
  }

  return hotel
}

export {
  getHotel,
}
