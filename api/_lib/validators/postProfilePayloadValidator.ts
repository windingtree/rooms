import { NowRequest } from '@vercel/node'

import { validateRequiredString, validateOptionalString } from './helpers'
import { CError } from '../tools'
import { IPostProfilePayload } from '../types'

async function postProfilePayloadValidator(request: NowRequest): Promise<IPostProfilePayload> {
  if (!request.body) {
    throw new CError(500, 'Must provide a valid body with request.')
  }

  const payload: IPostProfilePayload = {
    email: '',
    role: '',
  }

  const ALLOWED_PROPS: Array<keyof IPostProfilePayload> = [
    'email',
    'name',
    'phone',
    'role',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key as keyof IPostProfilePayload)) {
      throw new CError(500, `Property '${key}' on 'profile' is not settable.`)
    }
  }

  payload.email = await validateRequiredString('email', request.body.email)
  payload.role = await validateRequiredString('role', request.body.role)

  const name = await validateOptionalString('name', request.body.name)
  if (typeof name !== 'undefined') {
    payload.name = name
  }

  const phone = await validateOptionalString('phone', request.body.phone)
  if (typeof phone !== 'undefined') {
    payload.phone = phone
  }

  return payload
}

export {
  postProfilePayloadValidator,
}
