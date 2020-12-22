import { HotelRepo } from '../HotelRepo'
import { CError } from '../../../../_lib/tools'
import { IPatchHotelPayloadDbData, IPatchHotelPayload } from '../../../../_lib/types'
import { CONSTANTS } from '../../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = CONSTANTS.HTTP_STATUS

async function updateHotelByOwnerId(this: HotelRepo, hotelId: string, ownerId: string, data: IPatchHotelPayload): Promise<void> {
  const dbData: IPatchHotelPayloadDbData = this.mapper.fromPatchEntityPayload(data)

  let result
  try {
    const collection = await this.getCollection()
    const filter = { _id: this.mapper.toObjectId(hotelId), ownerId: this.mapper.toObjectId(ownerId) }
    const options = { upsert: false }
    const updateDoc = { $set: dbData }

    result = await collection.updateOne(filter, updateDoc, options)
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while updating a '${this.ENTITY_NAME}'.`, err)
  }

  if (!result || !result.matchedCount) {
    throw new CError(NOT_FOUND, `Could not update a '${this.ENTITY_NAME}'.`)
  }
}

export {
  updateHotelByOwnerId,
}
