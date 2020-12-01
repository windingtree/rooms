import { readOfferByOfferId, deleteOfferByOfferId } from '../../../_lib/data/offer'
import { createBooking } from '../../../_lib/data/booking'
import { emailNewBooking } from '../../../_lib/tools'
import { IPostCreateOrderPayload, ICreateOrderResult, IOrgDetails, IOffer, IBaseBooking, IBooking } from '../../../_lib/types'

async function createOrder(requester: IOrgDetails, payload: IPostCreateOrderPayload): Promise<ICreateOrderResult> {
  const result: ICreateOrderResult = {
    status: 'OK',
  }

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

  return result
}

export {
  createOrder,
}
