import { v4 as uuidv4 } from 'uuid'

import { readProfileByEmail, createProfile, updateProfile } from '../../../../_lib/data/profile'
import { HotelRepo } from '../../../../_lib/data/hotel/HotelRepo'
import { CONSTANTS } from '../../../../_lib/infra/constants'
import { IProfile, IOneTimePasswordPayload } from '../../../../_lib/types'

const { OWNER } = CONSTANTS.PROFILE_ROLE

const hotelRepo = new HotelRepo()

async function getClientAppOneTimePassword(payload: IOneTimePasswordPayload): Promise<string> {
  const oneTimePassword: string = uuidv4()

  let profile: IProfile|null
  try {
    profile = await readProfileByEmail(payload.email)
  } catch (err) {
    // Maybe a profile for the given email does not exist? We will try to create a new one below.
    profile = null
  }

  if (profile === null) {
    const profileId: string = await createProfile({
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

    await updateProfile(profileId, { hotelId })
  } else {
    await updateProfile(profile.id, { oneTimePassword, sessionToken: payload.sessionToken })
  }

  return oneTimePassword
}

export {
  getClientAppOneTimePassword,
}
