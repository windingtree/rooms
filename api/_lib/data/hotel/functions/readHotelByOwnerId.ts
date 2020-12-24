import { HotelRepo } from '../HotelRepo'
import { CError } from '../../../../_lib/tools'
import { IHotel } from '../../../../_lib/types'
import { CONSTANTS } from '../../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = CONSTANTS.HTTP_STATUS

async function readHotelByOwnerId(this: HotelRepo, hotelId: string, ownerId: string): Promise<IHotel> {
  let result
  try {
    const collection = await this.getCollection()
    const query = { _id: this.mapper.toObjectId(hotelId), ownerId: this.mapper.toObjectId(ownerId) }
    const options = { projection: this.getProjection() }

    result = await collection.findOne(query, options)
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while retrieving a '${this.ENTITY_NAME}'.`, err)
  }

  if (!result) {
    throw new CError(NOT_FOUND, `Could not retrieve a '${this.ENTITY_NAME}'.`)
  }

  return this.mapper.toEntity(result)
}

export {
  readHotelByOwnerId,
}
