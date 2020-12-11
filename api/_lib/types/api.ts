import { NowRequest, NowResponse } from '@vercel/node'

import {
  IBooking,
  IBookingCollection,
  IProfile,
  IProfileCollection,
  IHotel,
  IHotelCollection,
  IRoomType,
  IRoomTypeCollection,
  IOfferSearchResults,
  ICreateOrderResult,
  IOrgDetails,
  IStatus,
  IHealthStatus,
  IOtpStatus,
} from '../../_lib/types'

type TAvailableResultTypes =
  |IBooking
  |IBookingCollection
  |IProfile
  |IProfileCollection
  |IHotel
  |IHotelCollection
  |IRoomType
  |IRoomTypeCollection
  |IOfferSearchResults
  |ICreateOrderResult
  |IOrgDetails
  |IStatus
  |IHealthStatus
  |IOtpStatus
  |string

type TMethodFunc = (request: NowRequest, response: NowResponse) => Promise<TAvailableResultTypes>

interface IMethodHandlerHash {
  // All available HTTP methods. As defined in RFC 7231, and RFC 5789.
  GET?: TMethodFunc
  HEAD?: TMethodFunc
  POST?: TMethodFunc
  PUT?: TMethodFunc
  DELETE?: TMethodFunc
  CONNECT?: TMethodFunc
  OPTIONS?: TMethodFunc
  TRACE?: TMethodFunc
  PATCH?: TMethodFunc
}

export {
  TMethodFunc,
  IMethodHandlerHash,
}
