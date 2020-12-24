import { HotelRepo } from '../../../_lib/data/hotel/HotelRepo'
import { IProfile, IHotel } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

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
