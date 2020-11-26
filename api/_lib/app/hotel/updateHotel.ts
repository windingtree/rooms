import {
  updateHotel as updateHotelDbFunc,
  updateHotelByOwnerId as updateHotelByOwnerIdDbFunc,
  readHotel,
  readHotelByOwnerId
} from '../../../_lib/data/hotel'
import { IProfile, IHotel, IPatchHotelPayload } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN

async function updateHotel(requester: IProfile, hotelId: string, data: IPatchHotelPayload): Promise<IHotel> {
  let hotel: IHotel

  if (requester.role === SUPER_ADMIN) {
    await updateHotelDbFunc(hotelId, data)
    hotel = await readHotel(hotelId)
  } else {
    await updateHotelByOwnerIdDbFunc(hotelId, requester.id, data)
    hotel = await readHotelByOwnerId(hotelId, requester.id)
  }

  return hotel
}

export {
  updateHotel,
}
