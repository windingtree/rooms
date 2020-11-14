import { NowRequest } from '@vercel/node'

import { CError } from '../tools'
import { IBaseProfile } from '../types'

async function profileDataValidatorCreate(request: NowRequest): Promise<IBaseProfile> {
  if (!request.body) {
    throw new CError(500, 'Must provide a valid body with request.')
  }

  const createProfileData: IBaseProfile = {
    email: '',
    oneTimePassword: '',
    sessionToken: '',
    role: '',
  }

  const ALLOWED_UPDATE_PROPS = [
    'email',
    'oneTimePassword',
    'sessionToken',
    'role',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_UPDATE_PROPS.includes(key)) {
      throw new CError(500, `Property '${key}' on 'profile' is not updatable.`)
    }
  }

  if (typeof request.body.email === 'string') {
    createProfileData.email = request.body.email
  } else {
    throw new CError(500, 'Property \'email\' must have a value of type \'string\'.')
  }

  if (typeof request.body.oneTimePassword === 'string') {
    createProfileData.oneTimePassword = request.body.oneTimePassword
  } else {
    throw new CError(500, 'Property \'oneTimePassword\' must have a value of type \'string\'.')
  }

  if (typeof request.body.sessionToken === 'string') {
    createProfileData.sessionToken = request.body.sessionToken
  } else {
    throw new CError(500, 'Property \'sessionToken\' must have a value of type \'string\'.')
  }

  if (typeof request.body.role === 'string') {
    createProfileData.role = request.body.role
  } else {
    throw new CError(500, 'Property \'role\' must have a value of type \'string\'.')
  }

  return createProfileData
}

export {
  profileDataValidatorCreate,
}
