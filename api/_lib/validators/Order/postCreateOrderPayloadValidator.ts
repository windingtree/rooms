import { NowRequest } from '@vercel/node'

import { CError, isObject } from '../../../_lib/tools'
import { validateRequiredString  } from '../_helpers'
import { IPostCreateOrderPayload, IPostCreateOrderPassenger } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function postCreateOrderPayloadValidator(request: NowRequest): Promise<IPostCreateOrderPayload> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
  }

  const payload: IPostCreateOrderPayload = {
    offerId: '',
    guaranteeId: '',
    travellerName: '',
    travellerPhone: '',
    travellerEmail: '',
    passengers: {},
  }

  const ALLOWED_PROPS: Array<string> = [
    'offerId',
    'guaranteeId',
    'passengers',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key)) {
      throw new CError(BAD_REQUEST, `Property '${key}' on 'order' is not settable.`)
    }
  }

  const offerId = request.body.offerId
  await validateRequiredString('offerId', offerId)
  payload.offerId = offerId

  const guaranteeId = request.body.guaranteeId
  await validateRequiredString('guaranteeId', guaranteeId)
  payload.guaranteeId = guaranteeId

  if (isObject(request.body.passengers)) {
    const passengers = Object.values(request.body.passengers)

    if (Array.isArray(passengers) && passengers.length > 0) {
      payload.passengers = request.body.passengers

      const passenger: IPostCreateOrderPassenger = (passengers[0] as IPostCreateOrderPassenger)

      let lastName = ''
      if (Array.isArray(passenger.lastnames) && typeof passenger.lastnames[0] === 'string') {
        lastName = passenger.lastnames[0]
      }
      let firstName = ''
      if (Array.isArray(passenger.firstnames) && typeof passenger.firstnames[0] === 'string') {
        firstName = passenger.firstnames[0]
      }
      payload.travellerName = `${lastName} ${firstName}`.trim()

      let phone = ''
      if (Array.isArray(passenger.contactInformation) && typeof passenger.contactInformation[0] === 'string') {
        phone = passenger.contactInformation[0]
      }
      payload.travellerPhone = phone.trim()

      let email = ''
      if (Array.isArray(passenger.contactInformation) && typeof passenger.contactInformation[1] === 'string') {
        email = passenger.contactInformation[1]
      }
      payload.travellerEmail = email.trim()
    }
  } else {
    throw new CError(BAD_REQUEST, `Property 'passengers' should be an object.`)
  }

  return payload
}

export {
  postCreateOrderPayloadValidator,
}
