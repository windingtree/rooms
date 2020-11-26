import { IHotelDbRecord } from '../../../_lib/types'

function buildProjection(): { [key: string]: 1 } {
  const allowedFields: Array<keyof IHotelDbRecord> = [
    '_id',
    'ownerId',
    'name',
    'address',
    'location',
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
