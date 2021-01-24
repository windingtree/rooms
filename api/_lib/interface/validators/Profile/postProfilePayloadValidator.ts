import { NowRequest } from '@vercel/node'

import {
  validateOptionalString,
  validateRequiredString,
  validateRequiredRole,
} from '../../../interface/validators/_helpers'

import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'
import { IPostProfilePayload } from '../../../common/types'

const { OWNER } = CONSTANTS.PROFILE_ROLE
const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function postProfilePayloadValidator(request: NowRequest): Promise<IPostProfilePayload> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
  }

  const payload: IPostProfilePayload = {
    email: '',
    role: OWNER,
  }

  const ALLOWED_PROPS: Array<keyof IPostProfilePayload> = [
    'email',
    'name',
    'phone',
    'oneTimePassword',
    'sessionToken',
    'role',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key as keyof IPostProfilePayload)) {
      throw new CError(BAD_REQUEST, `Property '${key}' on 'profile' is not settable.`)
    }
  }

  const email = request.body.email
  await validateRequiredString('email', email)
  payload.email = email

  const role = request.body.role
  await validateRequiredString('role', role)
  await validateRequiredRole('role', role)
  payload.role = role

  const name = request.body.name
  await validateOptionalString('name', name)
  if (typeof name !== 'undefined') payload.name = name

  const phone = request.body.phone
  await validateOptionalString('phone', phone)
  if (typeof phone !== 'undefined') payload.phone = phone

  const oneTimePassword = request.body.oneTimePassword
  await validateOptionalString('oneTimePassword', oneTimePassword)
  if (typeof oneTimePassword !== 'undefined') payload.oneTimePassword = oneTimePassword

  const sessionToken = request.body.sessionToken
  await validateOptionalString('sessionToken', sessionToken)
  if (typeof sessionToken !== 'undefined') payload.sessionToken = sessionToken

  return payload
}

export { postProfilePayloadValidator }
