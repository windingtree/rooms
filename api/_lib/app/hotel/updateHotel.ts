import { HotelRepo } from '../../../_lib/data/hotel/HotelRepo'
import { IProfile, IHotel, IPatchHotelPayload } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

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

export {
  updateHotel,
}
