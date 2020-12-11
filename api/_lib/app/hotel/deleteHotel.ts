import {
  deleteHotel as deleteHotelDbFunc,
  deleteHotelByOwnerId as deleteHotelByOwnerIdDbFunc
} from '../../../_lib/data/hotel'
import { IProfile, IStatus } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

async function deleteHotel(requester: IProfile, hotelId: string): Promise<IStatus> {
  if (requester.role === SUPER_ADMIN) {
    await deleteHotelDbFunc(hotelId)
  } else {
    await deleteHotelByOwnerIdDbFunc(hotelId, requester.id)
  }

  return { status: 'OK' }
}

export {
  deleteHotel,
}
