import { Collection } from 'mongodb'

import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { THotelDbDataFields, IHotelDbDataProjection, IHotelDbData } from '../../../_lib/types'

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

import { MongoDataMapper } from './mapper'

class HotelRepo {
  protected ENTITY_NAME
  protected COLLECTION_NAME

  protected mapper

  public createHotel
  public deleteHotel
  public deleteHotelByOwnerId
  public readHotel
  public readHotelByOwnerId
  public readHotels
  public readHotelsByOwnerId
  public readHotelsByLocationRectangle
  public updateHotel
  public updateHotelByOwnerId

  constructor() {
    this.ENTITY_NAME = 'hotel'
    this.COLLECTION_NAME = 'hotels'

    this.mapper = new MongoDataMapper()

    this.createHotel = createHotel
    this.deleteHotel = deleteHotel
    this.deleteHotelByOwnerId = deleteHotelByOwnerId
    this.readHotel = readHotel
    this.readHotelByOwnerId = readHotelByOwnerId
    this.readHotels = readHotels
    this.readHotelsByOwnerId = readHotelsByOwnerId
    this.readHotelsByLocationRectangle = readHotelsByLocationRectangle
    this.updateHotel = updateHotel
    this.updateHotelByOwnerId = updateHotelByOwnerId
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
