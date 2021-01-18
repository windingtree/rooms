import { HotelRepo } from '../../data/hotel/HotelRepo'

import { CONSTANTS } from '../../common/constants'
import { IProfile, IStatus } from '../../common/types'

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

export { deleteHotel }
