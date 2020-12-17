import { IHotelDbData } from '../../../_lib/types'

function buildProjection(): { [key: string]: 1 } {
  const allowedFields: Array<keyof IHotelDbData> = [
    '_id',
    'ownerId',
    'name',
    'description',
    'address',
    'location',
    'imageUrl',
    'email',
  ]

  const projection: { [key: string]: 1 } = {}

  allowedFields.forEach((field) => {
    projection[field] = 1
  })

  return projection
}

const projection = buildProjection()

export {
  projection,
}
