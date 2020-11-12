import { getBookings, deleteBooking, getRoomTypes, deleteRoomType, createProfile, deleteProfile } from '../../data'
import { CError } from '../../tools'
import { AppConfig } from '../../infra/config'
import { IBookingCollection, IRoomTypeCollection, IProfile, IBaseProfile } from '../../types'
import { CONSTANTS } from '../../infra/constants'

async function apiTestReset(): Promise<IProfile> {
  const appConfig = await AppConfig.getInstance().getConfig()

  if (typeof appConfig.API_TEST_EMAIL !== 'string' || appConfig.API_TEST_EMAIL === '') {
    throw new CError(500, 'appConfig.API_TEST_EMAIL config variable is not set.')
  }
  const email: string = appConfig.API_TEST_EMAIL
  let c1: number

  const bookings: IBookingCollection = await getBookings(email)
  for (c1 = 0; c1 < bookings.length; c1 += 1) {
    await deleteBooking(bookings[c1].id)
  }

  const roomTypes: IRoomTypeCollection = await getRoomTypes(email)
  for (c1 = 0; c1 < roomTypes.length; c1 += 1) {
    await deleteRoomType(roomTypes[c1].id)
  }

  try {
    await deleteProfile(email)
  } catch (err) {
    // Do nothing.
    // We need to make sure the test profile doesn't exist.
    // We are going to create a new test profile from scratch.
    // See below.
  }

  if (typeof appConfig.API_TEST_ONE_TIME_PASSWORD !== 'string' || appConfig.API_TEST_ONE_TIME_PASSWORD === '') {
    throw new CError(500, 'appConfig.API_TEST_ONE_TIME_PASSWORD config variable is not set.')
  }
  if (typeof appConfig.API_TEST_SESSION_TOKEN !== 'string' || appConfig.API_TEST_SESSION_TOKEN === '') {
    throw new CError(500, 'appConfig.API_TEST_SESSION_TOKEN config variable is not set.')
  }

  const oneTimePassword: string = appConfig.API_TEST_ONE_TIME_PASSWORD
  const sessionToken: string = appConfig.API_TEST_SESSION_TOKEN

  const profilePostData: IBaseProfile = {
    email,
    name: '',
    phone: '',
    oneTimePassword,
    sessionToken,
    role: CONSTANTS.PROFILE_ROLE.SUPER_ADMIN,
    hotelId: '',
  }

  const profile: IProfile = await createProfile(profilePostData)

  return profile
}

export {
  apiTestReset,
}
