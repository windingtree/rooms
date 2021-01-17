import { Collection } from 'mongodb'

import { MongoDB } from '../../infra/mongo'
import { ENV } from '../../common/env'
import { BaseDataRepo } from '../../common/tools'
import { THotelDbDataFields, IHotelDbDataProjection, IHotelDbData } from '../../common/types'

import {
  createHotel,
  deleteHotel,
  deleteHotelByOwnerId,
  readHotel,
  readHotelByOwnerId,
  readHotels,
  readHotelsByOwnerId,
  readHotelsByLocationRectangle,
  updateHotel,
  updateHotelByOwnerId,
} from './functions'

import { HotelMongoDataMapper } from './HotelMongoDataMapper'

class HotelRepo extends BaseDataRepo {
  protected mapper = new HotelMongoDataMapper()

  public createHotel = createHotel
  public deleteHotel = deleteHotel
  public deleteHotelByOwnerId = deleteHotelByOwnerId
  public readHotel = readHotel
  public readHotelByOwnerId = readHotelByOwnerId
  public readHotels = readHotels
  public readHotelsByOwnerId = readHotelsByOwnerId
  public readHotelsByLocationRectangle = readHotelsByLocationRectangle
  public updateHotel = updateHotel
  public updateHotelByOwnerId = updateHotelByOwnerId

  constructor() {
    super()

    this.ENTITY_NAME = 'hotel'
    this.COLLECTION_NAME = 'hotels'
  }

  protected getProjection(): IHotelDbDataProjection {
    const allowedFields: Array<THotelDbDataFields> = [
      '_id',
      'ownerId',
      'name',
      'description',
      'address',
      'location',
      'imageUrl',
      'email',
    ]

    return allowedFields.reduce((projection: IHotelDbDataProjection, field) => {
      projection[field] = 1

      return projection
    }, {})
  }

  protected async getCollection(): Promise<Collection<IHotelDbData>> {
    const dbClient = await MongoDB.getInstance().getDbClient()
    const database = dbClient.db(ENV.ROOMS_DB_NAME)

    return database.collection(this.COLLECTION_NAME)
  }
}

export {
  HotelRepo,
}
