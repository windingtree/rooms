import { NowRequest } from '@vercel/node'

import { validateRequiredString, validateOptionalString } from './helpers'
import { CError } from '../../_lib/tools'
import { CONSTANTS } from '../../_lib/infra/constants'
import { IPostProfilePayload } from '../../_lib/types'

const { OBSERVER } = CONSTANTS.PROFILE_ROLE
const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function postProfilePayloadValidator(request: NowRequest): Promise<IPostProfilePayload> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
  }

  const payload: IPostProfilePayload = {
    email: '',
    role: OBSERVER,
  }

  const ALLOWED_PROPS: Array<keyof IPostProfilePayload> = [
    'email',
    'name',
    'phone',
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
  payload.role = role

  const name = request.body.name
  await validateOptionalString('name', name)
  payload.name = name

  const phone = request.body.phone
  await validateOptionalString('phone', phone)
  payload.phone = phone

  return payload
}

export {
  postProfilePayloadValidator,
}
