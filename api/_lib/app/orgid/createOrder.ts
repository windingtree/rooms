import { readOfferByOfferId, deleteOfferByOfferId } from '../../../_lib/data/offer'
import { createBooking } from '../../../_lib/data/booking'
import { emailNewBooking } from '../../../_lib/tools'
import { IPostCreateOrderPayload, ICreateOrderResult, IOrgDetails, IOffer, IBaseBooking } from '../../../_lib/types'

async function createOrder(requester: IOrgDetails, payload: IPostCreateOrderPayload): Promise<ICreateOrderResult> {
  const offer: IOffer = await readOfferByOfferId(payload.offerId)
  const baseBooking: IBaseBooking = {
    hotelId: offer.offer.pricePlansReferences.BAR.accommodation,
    roomTypeId: offer.offer.pricePlansReferences.BAR.roomType,
    checkInDate: '',
    checkOutDate: '',
    guestName: payload.travellerName || '',
    guestEmail: payload.travellerEmail || '',
    phoneNumber: payload.travellerPhone || '',
  }
  const bookingId: string = await createBooking(baseBooking)
  await deleteOfferByOfferId(payload.offerId)

  if (baseBooking.guestEmail.length > 0) {
    await emailNewBooking(requester.organization.did, bookingId, baseBooking.guestEmail)
  }

  const result: ICreateOrderResult = {
    orderId: bookingId,
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
    },
  }

  return result
}

export {
  createOrder,
}
