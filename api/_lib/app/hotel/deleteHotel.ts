import { HotelRepo } from '../../../_lib/data/hotel/HotelRepo'
import { IProfile, IStatus } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const hotelRepo = new HotelRepo()

async function deleteHotel(requester: IProfile, hotelId: string): Promise<IStatus> {
  if (requester.role === SUPER_ADMIN) {
    await hotelRepo.deleteHotel(hotelId)
  } else {
    await hotelRepo.deleteHotelByOwnerId(hotelId, requester.id)
  }

  return { status: 'OK' }
}

export {
  deleteHotel,
}
