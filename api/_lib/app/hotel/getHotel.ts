import { hotelMapper, readHotel, readHotelByOwnerId } from '../../../_lib/data/hotel'
import { IProfile, IHotel, IHotelDbRecord } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN

async function getHotel(requester: IProfile, hotelId: string): Promise<IHotel> {
  let hotelDbRecord: IHotelDbRecord

  if (requester.role === SUPER_ADMIN) {
    hotelDbRecord = await readHotel(hotelId)
  } else {
    hotelDbRecord = await readHotelByOwnerId(hotelId, requester.id)
  }

  return hotelMapper(hotelDbRecord)
}

export {
  getHotel,
}
