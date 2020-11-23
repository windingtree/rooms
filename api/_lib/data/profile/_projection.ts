import { IProfileDbRecord } from '../../../_lib/types'

function buildProjection(): { [key: string]: 1 } {
  const allowedFields: Array<keyof IProfileDbRecord> = [
    '_id',
    'email',
    'name',
    'phone',
    'oneTimePassword',
    'sessionToken',
    'role',
    'hotelId',
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
