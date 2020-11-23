import {
  deleteHotel as deleteHotelDbFunc,
  deleteHotelByOwnerId as deleteHotelByOwnerIdDbFunc
} from '../../../_lib/data/hotel'
import { IProfile } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN

async function deleteHotel(requester: IProfile, hotelId: string): Promise<void> {
  if (requester.role === SUPER_ADMIN) {
    await deleteHotelDbFunc(hotelId)
  } else {
    await deleteHotelByOwnerIdDbFunc(hotelId, requester.id)
  }
}

export {
  deleteHotel,
}
