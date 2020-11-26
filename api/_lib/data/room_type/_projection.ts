import { IRoomTypeDbRecord } from '../../../_lib/types'

function buildProjection(): { [key: string]: 1 } {
  const allowedFields: Array<keyof IRoomTypeDbRecord> = [
    '_id',
    'hotelId',
    'type',
    'quantity',
    'price',
    'amenities',
    'imageUrl',
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
