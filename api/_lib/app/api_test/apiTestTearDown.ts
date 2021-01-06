import {
  readBookingsByHotelId as readBookingsByHotelIdDbFunc,
  deleteBooking as deleteBookingDbFunc,
} from '../../../_lib/data/booking'
import { ProfileRepo } from '../../../_lib/data/profile/ProfileRepo'
import {
  readRoomTypesByHotelId,
  deleteRoomType,
} from '../././../../_lib/data/room_type'
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

    const roomTypeCollection: IRoomTypeCollection = await readRoomTypesByHotelId(requester.hotelId)
    for (let c1 = 0; c1 < roomTypeCollection.length; c1 += 1) {
      await deleteRoomType(roomTypeCollection[c1].id)
    }
  }

  await profileRepo.deleteProfile(requester.id)

  return { status: 'OK' }
}

export {
  apiTestTearDown,
}
