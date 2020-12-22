import { HotelRepo } from '../HotelRepo'
import { CError } from '../../../../_lib/tools'
import { IHotelCollectionDbData, IHotelCollection } from '../../../../_lib/types'
import { CONSTANTS } from '../../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

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
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while retrieving a '${this.ENTITY_NAME}' collection.`, err)
  }

  return this.mapper.toEntityCollection(result)
}

export {
  readHotels,
}
