import { v4 as uuidv4 } from 'uuid'

import { ProfileRepo } from '../../../data/profile/ProfileRepo'
import { HotelRepo } from '../../../data/hotel/HotelRepo'

import { CONSTANTS } from '../../../common/constants'
import { IProfile, IOneTimePasswordPayload } from '../../../common/types'

const { OWNER } = CONSTANTS.PROFILE_ROLE

const hotelRepo = new HotelRepo()
const profileRepo = new ProfileRepo()

async function getClientAppOneTimePassword(payload: IOneTimePasswordPayload): Promise<string> {
  const oneTimePassword: string = uuidv4()

  let profile: IProfile|null
  try {
    profile = await profileRepo.readProfileByEmail(payload.email)
  } catch (err) {
    // Maybe a profile for the given email does not exist? We will try to create a new one below.
    profile = null
  }

  if (profile === null) {
    const profileId: string = await profileRepo.createProfile({
      email: payload.email,
      name: '',
      phone: '',
      oneTimePassword,
      sessionToken: payload.sessionToken,
      role: OWNER,
      hotelId: '',
    })

    const hotelId: string = await hotelRepo.createHotel({
      ownerId: profileId,
      name: '',
      description: '',
      address: '',
      location: { lat: 0, lng: 0 },
      imageUrl: '',
      email: '',
    })

    await profileRepo.updateProfile(profileId, { hotelId })
  } else {
    await profileRepo.updateProfile(profile.id, { oneTimePassword, sessionToken: payload.sessionToken })
  }

  return oneTimePassword
}

export { getClientAppOneTimePassword }
