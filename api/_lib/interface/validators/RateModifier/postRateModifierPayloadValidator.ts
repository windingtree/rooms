import { NowRequest } from '@vercel/node'

import {
  validateOptionalString,
  validateRequiredString,
} from '../_helpers'

import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'
import { IPostRateModifierPayload } from '../../../common/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function postRateModifierPayloadValidator(request: NowRequest): Promise<IPostRateModifierPayload> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
  }

  const payload: IPostRateModifierPayload = {
    hotelId: '',
  }

  const ALLOWED_PROPS: Array<keyof IPostRateModifierPayload> = [
    'hotelId',
    'type',
    'description',
    'enabled',
    'priority',
    'criteriaType',
    'priceModifierType',
    'priceModifierAmount',
    'combinable',
    'condition',
    'rooms'
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key as keyof IPostRateModifierPayload)) {
      throw new CError(BAD_REQUEST, `Property '${key}' on 'rateModifier' is not settable.`)
    }
  }

  const hotelId = request.body.hotelId
  await validateRequiredString('hotelId', hotelId)
  payload.hotelId = hotelId

  const type = request.body.type
  await validateOptionalString('type', type)
  if (typeof type !== 'undefined') payload.type = type

  const description = request.body.description
  await validateOptionalString('description', description)
  if (typeof description !== 'undefined') payload.description = description

  payload.enabled = !!request.body.enabled

  return payload
}

export { postRateModifierPayloadValidator }
