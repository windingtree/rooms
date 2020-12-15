import { IOfferDbRecord } from '../../../_lib/types'

function buildProjection(): { [key: string]: 1 } {
  const allowedFields: Array<keyof IOfferDbRecord> = [
    '_id',
    'offerId',
    'arrival',
    'departure',
    'offer',
    'createdAt',
    'debtorOrgId',
    'hotelEmail',
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
