import { NowRequest } from '@vercel/node'

import { validateOptionalString } from './helpers'
import { CError } from '../../_lib/tools'
import { CONSTANTS } from '../../_lib/infra/constants'
import { IPatchProfilePayload } from '../../_lib/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function patchProfilePayloadValidator(request: NowRequest): Promise<IPatchProfilePayload> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
  }

  const payload: IPatchProfilePayload = {}

  const ALLOWED_PROPS: Array<keyof IPatchProfilePayload> = [
    'name',
    'phone',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key as keyof IPatchProfilePayload)) {
      throw new CError(BAD_REQUEST, `Property '${key}' on 'profile' is not updatable.`)
    }
  }

  const name = request.body.name
  await validateOptionalString('name', name)
  if (typeof name !== 'undefined') payload.name = name

  const phone = request.body.phone
  await validateOptionalString('phone', phone)
  if (typeof phone !== 'undefined') payload.phone = phone

  return payload
}

export {
  patchProfilePayloadValidator,
}
