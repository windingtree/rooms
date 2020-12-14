import { v4 as uuidv4 } from 'uuid'

import { getPaymentInfo } from '../../../_lib/data/simard'
import { readOfferByOfferId, deleteOfferByOfferId } from '../../../_lib/data/offer'
import { createBooking } from '../../../_lib/data/booking'
import { AppConfig } from '../../../_lib/infra/config'
import { emailNewBooking, CError } from '../../../_lib/tools'
import { IPostCreateOrderPayload, ICreateOrderResult, IOrgDetails, IOffer, IBaseBooking, ISimardPaymentInfo } from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function createOrder(requester: IOrgDetails, payload: IPostCreateOrderPayload): Promise<ICreateOrderResult> {
  const appConfig = await AppConfig.getInstance().getConfig()

  const paymentInfo: ISimardPaymentInfo = await getPaymentInfo(payload.guaranteeId)

  console.log('--------------')
  console.log(paymentInfo)
  console.log('--------------')

  if (paymentInfo.creditorOrgId !== appConfig.WT_ROOMS_ORGID) {
    throw new CError(BAD_REQUEST, 'Guarantee not meant for Rooms organization.')
  }

  const offer: IOffer = await readOfferByOfferId(payload.offerId)
  const orderId = uuidv4()
  const baseBooking: IBaseBooking = {
    orderId,
    hotelId: offer.offer.pricePlansReferences.BAR.accommodation,
    roomTypeId: offer.offer.pricePlansReferences.BAR.roomType,
    checkInDate: offer.arrival,
    checkOutDate: offer.departure,
    guestName: payload.travellerName || '',
    guestEmail: payload.travellerEmail || '',
    phoneNumber: payload.travellerPhone || '',
  }
  await createBooking(baseBooking)
  await deleteOfferByOfferId(payload.offerId)

  if (baseBooking.guestEmail.length > 0) {
    await emailNewBooking(requester.organization.did, orderId, baseBooking.guestEmail)
  }

  const result: ICreateOrderResult = {
    orderId,
    order: {
      passengers: payload.passengers,
      price: {
        currency: offer.offer.price.currency,
        private: offer.offer.price.public,
        public: offer.offer.price.public,
        commission: offer.offer.price.public,
        taxes: offer.offer.price.public,
      },
      restrictions: {
        exchangeFee: offer.offer.price.public,
        refundFee: offer.offer.price.public,
        exchangeable: false,
        refundable: false,
      },
      itinerary: {},
      options: [],
      status: 'OK',
      response: 'Committed',
      reservationNumber: orderId.split('-')[0].toUpperCase(),
    },
  }

  return result
}

export {
  createOrder,
}
