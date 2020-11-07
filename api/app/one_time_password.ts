import { v4 as uuidv4 } from 'uuid'

import { getProfileAuth, createProfile, patchProfile } from '../app'
import { disableApiRequestsHere } from '../tools'
import { IProfileAuth } from '../types'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function getOneTimePassword(email: string, sessionToken: string): Promise<string> {
  const oneTimePassword: string = uuidv4()

  let profileAuth: IProfileAuth|null
  try {
    profileAuth = await getProfileAuth(email)
  } catch (err) {
    // Maybe a profile for the given email does not exist? We will try to create a new one below.
    profileAuth = null
  }

  if (profileAuth === null) {
    await createProfile({ email, oneTimePassword, sessionToken })
  } else {
    await patchProfile(email, 'oneTimePassword', oneTimePassword)
    await patchProfile(email, 'sessionToken', sessionToken)
  }

  return oneTimePassword
}

export {
  getOneTimePassword,
}
