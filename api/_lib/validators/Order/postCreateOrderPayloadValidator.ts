import { NowRequest } from '@vercel/node'

import { CError } from '../../../_lib/tools'
import { validateRequiredString, validateOptionalString  } from '../_helpers'
import { IPostCreateOrderPayload, IPostCreateOrderPassenger } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function postCreateOrderPayloadValidator(request: NowRequest): Promise<IPostCreateOrderPayload> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
  }

  const payload: IPostCreateOrderPayload = {
    offerId: '',
    travellerName: '',
    travellerPhone: '',
    travellerEmail: '',
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

  if (request.body.passengers) {
    const passengers = Object.values(request.body.passengers)

    if (Array.isArray(passengers) && passengers.length !== 0) {
      const passenger: IPostCreateOrderPassenger = (passengers[0] as IPostCreateOrderPassenger)

      console.log(passenger)

      const lastName = (Array.isArray(passenger.lastnames) && typeof passenger.lastnames[0] === 'string') ? passenger.lastnames[0] : ''
      const firstName = (Array.isArray(passenger.firstnames) && typeof passenger.firstnames[0] === 'string') ? passenger.firstnames[0] : ''

      payload.travellerName = `${lastName} ${firstName}`.trim()

      const phone = (Array.isArray(passenger.contactInformation) && typeof passenger.contactInformation[0] === 'string') ? passenger.contactInformation[0] : ''
      payload.travellerPhone = phone.trim()

      const email = (Array.isArray(passenger.contactInformation) && typeof passenger.contactInformation[1] === 'string') ? passenger.contactInformation[1] : ''
      payload.travellerEmail = email.trim()
    }
  }

  console.log(payload)

  return payload
}

export {
  postCreateOrderPayloadValidator,
}
