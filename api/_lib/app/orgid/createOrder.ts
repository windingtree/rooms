import { v4 as uuidv4 } from 'uuid'

import { getPaymentInfo, claimGuarantee } from '../../../_lib/data/simard'
import { readOfferByOfferId, deleteOfferByOfferId } from '../../../_lib/data/offer'
import { createBooking } from '../../../_lib/data/booking'
import { AppConfig } from '../../../_lib/infra/config'
import { emailNewBooking, CError } from '../../../_lib/tools'
import {
  IPostCreateOrderPayload,
  ICreateOrderResult,
  IOrgDetails,
  IOffer,
  IBaseBooking,
  ISimardPaymentInfo,
  ISimardGuaranteeClaim,
} from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function createOrder(requester: IOrgDetails, payload: IPostCreateOrderPayload): Promise<ICreateOrderResult> {
  const paymentInfo: ISimardPaymentInfo = await getPaymentInfo(payload.guaranteeId)

  console.log('--------------')
  console.log('Simard :: paymentInfo')
  console.log(paymentInfo)
  console.log('--------------')

  const appConfig = await AppConfig.getInstance().getConfig()

  if (paymentInfo.creditorOrgId !== appConfig.WT_ROOMS_ORGID) {
    throw new CError(
      BAD_REQUEST,
      'Guarantee not meant for Rooms organization.',
      new Error(`appConfig.WT_ROOMS_ORGID = ${appConfig.WT_ROOMS_ORGID}; paymentInfo.creditorOrgId = ${paymentInfo.creditorOrgId}.`)
    )
  }

  const offer: IOffer = await readOfferByOfferId(payload.offerId)

  if (paymentInfo.debtorOrgId !== offer.debtorOrgId) {
    throw new CError(
      BAD_REQUEST,
      'Guarantee not created by offer requestor.',
      new Error(`offer.debtorOrgId = ${offer.debtorOrgId}; paymentInfo.debtorOrgId = ${paymentInfo.debtorOrgId}.`)
    )
  } else if (paymentInfo.currency !== offer.offer.price.currency) {
    throw new CError(
      BAD_REQUEST,
      'Invalid Guarantee currency.',
      new Error(`offer.offer.price.currency = ${offer.offer.price.currency}; paymentInfo.currency = ${paymentInfo.currency}.`)
    )
  } else if (
    Number.isNaN(parseFloat(paymentInfo.amount)) ||
    parseFloat(paymentInfo.amount) < offer.offer.price.public
  ) {
    throw new CError(
      BAD_REQUEST,
      'Invalid Guarantee amount.',
      new Error(`offer.offer.price.public = ${offer.offer.price.public}; paymentInfo.amount = ${paymentInfo.amount}.`)
    )
  }

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

  const guaranteeClaim: ISimardGuaranteeClaim = await claimGuarantee(payload.guaranteeId)

  console.log('--------------')
  console.log('Simard :: guaranteeClaim')
  console.log(guaranteeClaim)
  console.log('--------------')

  if (baseBooking.guestEmail.length > 0) {
    await emailNewBooking(requester.organization.did, orderId, baseBooking.guestEmail)
  }

  const result: ICreateOrderResult = {
    orderId,
    order: {
      passengers: payload.passengers,
      price: {
        currency: offer.offer.price.currency,
        private: 0,
        public: offer.offer.price.public,
        commission: 0,
        taxes: 0,
      },
      restrictions: {
        exchangeFee: 0,
        refundFee: 0,
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
