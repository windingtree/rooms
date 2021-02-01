import { IBaseBookingDbData, IBaseBooking } from '../../../common/types'

import { BookingRepo } from '../BookingRepo'

async function createBooking(this: BookingRepo, data: IBaseBooking): Promise<string> {
  const dbData: IBaseBookingDbData = this.mapper.fromBaseEntity(data)

  let result
  try {
    const collection = await this.getCollection()

    result = await collection.insertOne(dbData)
  } catch (err: unknown) {
    throw this.errorInternalEntityCreate(err)
  }

  if (!result.insertedId) {
    throw this.errorInternalEntityCreate()
  }

  return this.mapper.fromObjectId(result.insertedId)
}

export { createBooking }
