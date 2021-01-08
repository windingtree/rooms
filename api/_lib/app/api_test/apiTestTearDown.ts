import {
  readBookingsByHotelId as readBookingsByHotelIdDbFunc,
  deleteBooking as deleteBookingDbFunc,
} from '../../../_lib/data/booking'
import { ProfileRepo } from '../../../_lib/data/profile/ProfileRepo'
import { RoomTypeRepo } from '../../../_lib/data/room_type/RoomTypeRepo'
import { CError } from '../../../_lib/tools'
import { AppConfig } from '../../../_lib/infra/config'
import {
  IRoomTypeCollection,
  IProfile,
  IBookingCollection,
  IStatus,
} from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { FORBIDDEN } = CONSTANTS.HTTP_STATUS

const profileRepo = new ProfileRepo()
const roomTypeRepo = new RoomTypeRepo()

async function apiTestTearDown(requester: IProfile): Promise<IStatus> {
  const appConfig = await AppConfig.getInstance().getConfig()

  if (appConfig.API_TEST_ENABLED !== 'enabled') {
    throw new CError(FORBIDDEN, 'API test support not enabled for this environment.')
  }

  if (typeof requester.hotelId === 'string' && requester.hotelId.length > 0) {
    const bookingCollection: IBookingCollection = await readBookingsByHotelIdDbFunc(requester.hotelId)
    for (let c1 = 0; c1 < bookingCollection.length; c1 += 1) {
      await deleteBookingDbFunc(bookingCollection[c1].id)
    }

    const roomTypeCollection: IRoomTypeCollection = await roomTypeRepo.readRoomTypesByHotelId(requester.hotelId)
    for (let c1 = 0; c1 < roomTypeCollection.length; c1 += 1) {
      await roomTypeRepo.deleteRoomType(roomTypeCollection[c1].id)
    }
  }

  await profileRepo.deleteProfile(requester.id)

  return { status: 'OK' }
}

export {
  apiTestTearDown,
}
