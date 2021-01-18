import { HotelRepo } from '../../data/hotel/HotelRepo'

import { CONSTANTS } from '../../common/constants'
import { IProfile, IHotel, IPatchHotelPayload } from '../../common/types'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const hotelRepo = new HotelRepo()

async function updateHotel(requester: IProfile, hotelId: string, data: IPatchHotelPayload): Promise<IHotel> {
  let hotel: IHotel

  if (requester.role === SUPER_ADMIN) {
    await hotelRepo.updateHotel(hotelId, data)
    hotel = await hotelRepo.readHotel(hotelId)
  } else {
    await hotelRepo.updateHotelByOwnerId(hotelId, requester.id, data)
    hotel = await hotelRepo.readHotelByOwnerId(hotelId, requester.id)
  }

  return hotel
}

export { updateHotel }
