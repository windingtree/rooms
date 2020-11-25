import { v4 as uuidv4 } from 'uuid'

import { profileMapper, readProfileByEmail, createProfile, updateProfile } from '../../../../_lib/data/profile'
import { createHotel } from '../../../../_lib/data/hotel'
import { CONSTANTS } from '../../../../_lib/infra/constants'
import { IProfile, IProfileDbRecord, IOneTimePasswordPayload } from '../../../../_lib/types'

const { OWNER } = CONSTANTS.PROFILE_ROLE

async function getClientAppOneTimePassword(payload: IOneTimePasswordPayload): Promise<string> {
  const oneTimePassword: string = uuidv4()

  let profile: IProfile|null
  try {
    const profileDbRecord: IProfileDbRecord = await readProfileByEmail(payload.email)
    profile = profileMapper(profileDbRecord)
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

    const hotelId: string = await createHotel({
      ownerId: profileId,
      name: '',
      address: '',
      location: { lat: 0, lng: 0 },
    })

    updateProfile(profileId, { hotelId })
  } else {
    await updateProfile(profile.id, { oneTimePassword, sessionToken: payload.sessionToken })
  }

  return oneTimePassword
}

export {
  getClientAppOneTimePassword,
}
