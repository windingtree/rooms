import { ENTITY_NAME, COLLECTION_NAME } from './_entity'
import { projection } from './_projection'
import { mapper } from './_mapper'
import { CError } from '../../../_lib/tools'
import { IHotelDbData, IHotelCollectionDbData, IHotelCollection, ILocationRectangleDbType } from '../../../_lib/types'
import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

async function readHotelsByLocationRectangle(rectangle: ILocationRectangleDbType): Promise<IHotelCollection> {
  const dbClient = await MongoDB.getInstance().getDbClient()

  const polygon: Array<Array<number>> = [
    [
      rectangle.north,
      rectangle.east,
    ],
    [
      rectangle.north,
      rectangle.west,
    ],
    [
      rectangle.south,
      rectangle.east,
    ],
    [
      rectangle.south,
      rectangle.west,
    ],
  ]

  let result: IHotelCollectionDbData
  try {
    const database = dbClient.db(ENV.ROOMS_DB_NAME)
    const collection = database.collection(COLLECTION_NAME)
    const query = {
      location: {
        '$geoWithin': {
          '$polygon': polygon
        }
      }
    }
    const options = { projection }

    const cursor = collection.find(query, options)

    if ((await cursor.count()) === 0) {
      return []
    }
    result = []
    await cursor.forEach((item: IHotelDbData) => {
      result.push(item)
    })
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while retrieving a '${ENTITY_NAME}' collection.`, err)
  }

  return mapper.toEntityCollection(result)
}

export {
  readHotelsByLocationRectangle,
}
