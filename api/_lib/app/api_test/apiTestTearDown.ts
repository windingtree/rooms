import { checkRequiredAppConfigProps } from './checkRequiredAppConfigProps'
import { readBookingsByHotelId, deleteBooking } from '../../../_lib/data/booking'
import { profileMapper, deleteProfile, readProfileByEmail } from '../../../_lib/data/profile'
import {
  readRoomTypesByHotelId,
  deleteRoomType,
} from '../././../../_lib/data/room_type'
import { CError } from '../../../_lib/tools'
import { AppConfig } from '../../../_lib/infra/config'
import {
  IRoomTypeCollection,
  IProfile,
  IProfileDbRecord,
  IBookingCollection,
} from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const FORBIDDEN = CONSTANTS.HTTP_STATUS.FORBIDDEN

async function apiTestTearDown(requester: IProfile): Promise<void> {
  const appConfig = await AppConfig.getInstance().getConfig()

  checkRequiredAppConfigProps(appConfig)

  if (appConfig.API_TEST_ENABLED !== 'enabled') {
    throw new CError(FORBIDDEN, 'API test support not enabled for this environment.')
  }

  const profileDbRecord: IProfileDbRecord = await readProfileByEmail(appConfig.API_TEST_EMAIL)
  const profile: IProfile = profileMapper(profileDbRecord)

  const bookingCollection: IBookingCollection = await readBookingsByHotelId(profile.hotelId)
  for (let c1 = 0; c1 < bookingCollection.length; c1 += 1) {
    await deleteBooking(bookingCollection[c1].id)
  }

  const roomTypeCollection: IRoomTypeCollection = await readRoomTypesByHotelId(profile.hotelId)
  for (let c1 = 0; c1 < roomTypeCollection.length; c1 += 1) {
    await deleteRoomType(roomTypeCollection[c1].id)
  }

  await deleteProfile(profile.id)
}

export {
  apiTestTearDown,
}
