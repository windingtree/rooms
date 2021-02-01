import { HotelRepo } from '../HotelRepo'
import { IHotelCollectionDbData, IHotelCollection, ILocationRectangleDbType } from '../../../common/types'

async function readHotelsByLocationRectangle(this: HotelRepo, rectangle: ILocationRectangleDbType): Promise<IHotelCollection> {
  const polygon: Array<Array<number>> = [
    [ rectangle.north, rectangle.east ],
    [ rectangle.north, rectangle.west ],
    [ rectangle.south, rectangle.west ],
    [ rectangle.south, rectangle.east ],
  ]

  const result: IHotelCollectionDbData = []
  try {
    const collection = await this.getCollection()
    const query = {
      location: {
        '$geoWithin': {
          '$polygon': polygon
        }
      }
    }
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

export { readHotelsByLocationRectangle }
