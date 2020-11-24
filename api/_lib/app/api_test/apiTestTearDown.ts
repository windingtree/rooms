import { checkRequiredAppConfigProps } from './checkRequiredAppConfigProps'
import { getBookings, deleteBooking } from '../../data/rooms_legacy'
import { profileMapper, deleteProfile, readProfileByEmail } from '../../../_lib/data/profile'
import {
  roomTypeCollectionMapper,
  readRoomTypes as readRoomTypesDbFunc,
  deleteRoomType as deleteRoomTypeDbFunc
} from '../././../../_lib/data/room_type'
import { CError } from '../../../_lib/tools'
import { AppConfig } from '../../../_lib/infra/config'
import {
  IBookingCollection,
  IRoomTypeDbRecordCollection,
  IRoomTypeCollection,
  IProfile,
  IProfileDbRecord
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

  const bookings: IBookingCollection = await getBookings(requester.email)
  for (let c1 = 0; c1 < bookings.length; c1 += 1) {
    await deleteBooking(bookings[c1].id)
  }

  const roomTypeDbRecordCollection: IRoomTypeDbRecordCollection = await readRoomTypesDbFunc()
  const roomTypeCollection: IRoomTypeCollection = roomTypeCollectionMapper(roomTypeDbRecordCollection)
  for (let c1 = 0; c1 < roomTypeCollection.length; c1 += 1) {
    await deleteRoomTypeDbFunc(roomTypeCollection[c1].id)
  }

  await deleteProfile(profile.id)
}

export {
  apiTestTearDown,
}
