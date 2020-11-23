import {
  hotelMapper,
  updateHotel as updateHotelDbFunc,
  updateHotelByOwnerId as updateHotelByOwnerIdDbFunc,
  readHotel,
  readHotelByOwnerId
} from '../../../_lib/data/hotel'
import { IProfile, IHotel, IPatchHotelPayload, IHotelDbRecord } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const SUPER_ADMIN = CONSTANTS.PROFILE_ROLE.SUPER_ADMIN

async function updateHotel(requester: IProfile, hotelId: string, data: IPatchHotelPayload): Promise<IHotel> {
  let hotelDbRecord: IHotelDbRecord

  if (requester.role === SUPER_ADMIN) {
    await updateHotelDbFunc(hotelId, data)
    hotelDbRecord = await readHotel(hotelId)
  } else {
    await updateHotelByOwnerIdDbFunc(hotelId, requester.id, data)
    hotelDbRecord = await readHotelByOwnerId(hotelId, requester.id)
  }

  return hotelMapper(hotelDbRecord)
}

export {
  updateHotel,
}
