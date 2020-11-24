import { IRoomTypeDbRecord } from '../../../_lib/types'

function buildProjection(): { [key: string]: 1 } {
  const allowedFields: Array<keyof IRoomTypeDbRecord> = [
    '_id',
    'ownerId',
    'hotelId',
    'type',
    'quantity',
    'price',
    'amenities',
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
