import { BookingRepo } from '../BookingRepo'
import { IBookingCollectionDbData, IBookingCollection } from '../../../common/types'

async function readBookings(this: BookingRepo): Promise<IBookingCollection> {
  const result: IBookingCollectionDbData = []
  try {
    const collection = await this.getCollection()
    const query = {}
    const options = { projection: this.getProjection() }

    const cursor = collection.find(query, options)
    if ((await cursor.count()) === 0) {
      return []
    }
    await cursor.forEach((item) => {
      result.push(item)
    })
  } catch (err: unknown) {
    throw this.errorInternalEntityCollectionRead(err)
  }

  return this.mapper.toEntityCollection(result)
}

export {
  readBookings,
}
