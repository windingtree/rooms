import { IBookingDbRecord } from '../../../_lib/types'

function buildProjection(): { [key: string]: 1 } {
  const allowedFields: Array<keyof IBookingDbRecord> = [
    '_id',
    'hotelId',
    'checkInDate',
    'checkOutDate',
    'guestName',
    'guestEmail',
    'phoneNumber',
    'roomTypeId',
  ]

  const projection: { [key: string]: 1 } = {}

  allowedFields.forEach((field) => {
    projection[field] = 1
  })

  return projection
}

export {
  buildProjection,
}
