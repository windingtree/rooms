import { HotelRepo } from '../HotelRepo'
import { IHotelCollectionDbData, IHotelCollection } from '../../../../_lib/types'

async function readHotels(this: HotelRepo): Promise<IHotelCollection> {
  const result: IHotelCollectionDbData = []
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
  readHotels,
}
