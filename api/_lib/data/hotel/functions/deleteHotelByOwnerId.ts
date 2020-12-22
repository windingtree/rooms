import { HotelRepo } from '../HotelRepo'
import { CError } from '../../../../_lib/tools'
import { CONSTANTS } from '../../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = CONSTANTS.HTTP_STATUS

async function deleteHotelByOwnerId(this: HotelRepo, hotelId: string, ownerId: string): Promise<void> {
  let result
  try {
    const collection = await this.getCollection()
    const filter = { _id: this.mapper.toObjectId(hotelId), ownerId: this.mapper.toObjectId(ownerId) }

    result = await collection.deleteOne(filter)
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while deleting a '${this.ENTITY_NAME}'.`, err)
  }

  if (!result || !result.deletedCount) {
    throw new CError(NOT_FOUND, `Could not delete a '${this.ENTITY_NAME}'.`)
  }
}

export {
  deleteHotelByOwnerId,
}
