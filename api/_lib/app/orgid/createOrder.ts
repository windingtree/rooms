import { v4 as uuidv4 } from 'uuid'
import * as moment from 'moment'

import { getPaymentInfo, claimGuarantee } from '../../../_lib/data/simard'
import { OfferRepo } from '../../../_lib/data/offer/OfferRepo'
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
} from '../../../_lib/types'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

const offerRepo = new OfferRepo()

async function createOrder(requester: IOrgDetails, payload: IPostCreateOrderPayload): Promise<ICreateOrderResult> {
  const paymentInfo: ISimardPaymentInfo = await getPaymentInfo(payload.guaranteeId)

  const appConfig = await AppConfig.getInstance().getConfig()

  if (paymentInfo.creditorOrgId !== appConfig.WT_ROOMS_ORGID) {
    throw new CError(
      BAD_REQUEST,
      'Guarantee not meant for Rooms organization.',
      new Error(`appConfig.WT_ROOMS_ORGID = ${appConfig.WT_ROOMS_ORGID}; paymentInfo.creditorOrgId = ${paymentInfo.creditorOrgId}.`)
    )
  }

  const offer: IOffer = await offerRepo.readOfferByOfferId(payload.offerId)

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
    (
      (typeof paymentInfo.amount === 'number') &&
      (paymentInfo.amount < offer.offer.price.public)
    ) ||
    (
      (typeof paymentInfo.amount === 'string') &&
      (
        (Number.isNaN(parseFloat(paymentInfo.amount))) ||
        (parseFloat(paymentInfo.amount) < offer.offer.price.public)
      )
    )
  ) {
    throw new CError(
      BAD_REQUEST,
      'Invalid Guarantee amount.',
      new Error(`offer.offer.price.public = ${offer.offer.price.public}; paymentInfo.amount = ${paymentInfo.amount}.`)
    )
  } else if (
    (!moment.utc(paymentInfo.expiration).isValid()) ||
    (moment.utc(paymentInfo.expiration).diff(moment.utc(new Date()), 'hours') <= 72)
  ) {
    throw new CError(
      BAD_REQUEST,
      'Guarantee expiration is too short.',
      new Error(`paymentInfo.expiration = ${paymentInfo.expiration}.`)
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
  await offerRepo.deleteOfferByOfferId(payload.offerId)

  await claimGuarantee(payload.guaranteeId)

  if (typeof offer.hotelEmail === 'string' && offer.hotelEmail.length > 0) {
    await emailNewBooking(requester.organization.did, orderId, offer.hotelEmail)
  }

  const result: ICreateOrderResult = {
    orderId,
    order: {
      passengers: payload.passengers,
      price: {
        currency: offer.offer.price.currency,
        public: offer.offer.price.public,
      },
      restrictions: {
        exchangeable: false,
        refundable: false,
      },
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
