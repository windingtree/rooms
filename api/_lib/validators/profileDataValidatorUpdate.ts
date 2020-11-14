import { NowRequest } from '@vercel/node'

import { CError } from '../tools'
import { IUpdateProfileData } from '../types'

async function profileDataValidatorUpdate(request: NowRequest): Promise<IUpdateProfileData> {
  if (!request.body) {
    throw new CError(500, 'Must provide a valid body with request.')
  }

  const updateProfileData: IUpdateProfileData = {}

  const ALLOWED_PROPS = [
    'email',
    'oneTimePassword',
    'sessionToken',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key)) {
      throw new CError(500, `Property '${key}' on 'profile' is not updatable.`)
    }
  }

  if (typeof request.body.email === 'string') {
    updateProfileData.email = request.body.email
  } else if (typeof request.body.email !== 'undefined') {
    throw new CError(500, 'Property \'email\' must have a value of type \'string\'.')
  }

  if (typeof request.body.oneTimePassword === 'string') {
    updateProfileData.oneTimePassword = request.body.oneTimePassword
  } else if (typeof request.body.oneTimePassword !== 'undefined') {
    throw new CError(500, 'Property \'oneTimePassword\' must have a value of type \'string\'.')
  }

  if (typeof request.body.sessionToken === 'string') {
    updateProfileData.sessionToken = request.body.sessionToken
  } else if (typeof request.body.sessionToken !== 'undefined') {
    throw new CError(500, 'Property \'sessionToken\' must have a value of type \'string\'.')
  }

  return updateProfileData
}

export {
  profileDataValidatorUpdate,
}
