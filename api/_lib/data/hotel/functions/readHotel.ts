import { HotelRepo } from '../HotelRepo'
import { IHotelDbData, IHotel } from '../../../common/types'

async function readHotel(this: HotelRepo, hotelId: string): Promise<IHotel> {
  let result: IHotelDbData|null
  try {
    const collection = await this.getCollection()
    const query = { _id: this.mapper.toObjectId(hotelId) }
    const options = { projection: this.getProjection() }

    result = await collection.findOne(query, options)
  } catch (err: unknown) {
    throw this.errorInternalEntityRead(err)
  }

  if (!result) {
    throw this.errorEntityNotFound()
  }

  return this.mapper.toEntity(result)
}

export {
  readHotel,
}
