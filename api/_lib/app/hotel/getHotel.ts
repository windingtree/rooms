import { readHotel, readHotelByOwnerId } from '../../../_lib/data/hotel'
import { IProfile, IHotel } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN

async function getHotel(requester: IProfile, hotelId: string): Promise<IHotel> {
  let hotel: IHotel

  if (requester.role === SUPER_ADMIN) {
    hotel = await readHotel(hotelId)
  } else {
    hotel = await readHotelByOwnerId(hotelId, requester.id)
  }

  return hotel
}

export {
  getHotel,
}
