import { Collection } from 'mongodb'

import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { BaseDataRepo } from '../../../_lib/tools'
import { TRoomTypeDbDataFields, IRoomTypeDbDataProjection, IRoomTypeDbData } from '../../../_lib/types'

import {
  createRoomType,
  deleteRoomType,
  deleteRoomTypeByHotelId,
  readRoomType,
  readRoomTypeByHotelId,
  readRoomTypes,
  readRoomTypesByHotelId,
  updateRoomType,
  updateRoomTypeByHotelId,
} from './functions'

import { RoomTypeMongoDataMapper } from './RoomTypeMongoDataMapper'

class RoomTypeRepo extends BaseDataRepo {
  protected mapper = new RoomTypeMongoDataMapper()

  public createRoomType = createRoomType
  public deleteRoomType = deleteRoomType
  public deleteRoomTypeByHotelId = deleteRoomTypeByHotelId
  public readRoomType = readRoomType
  public readRoomTypeByHotelId = readRoomTypeByHotelId
  public readRoomTypes = readRoomTypes
  public readRoomTypesByHotelId = readRoomTypesByHotelId
  public updateRoomType = updateRoomType
  public updateRoomTypeByHotelId = updateRoomTypeByHotelId

  constructor() {
    super()

    this.ENTITY_NAME = 'room_type'
    this.COLLECTION_NAME = 'room_types'
  }

  protected getProjection(): IRoomTypeDbDataProjection {
    const allowedFields: Array<TRoomTypeDbDataFields> = [
      '_id',
      'hotelId',
      'type',
      'description',
      'quantity',
      'price',
      'devConPrice',
      'amenities',
      'imageUrl',
    ]

    return allowedFields.reduce((projection: IRoomTypeDbDataProjection, field) => {
      projection[field] = 1

      return projection
    }, {})
  }

  protected async getCollection(): Promise<Collection<IRoomTypeDbData>> {
    const dbClient = await MongoDB.getInstance().getDbClient()
    const database = dbClient.db(ENV.ROOMS_DB_NAME)

    return database.collection(this.COLLECTION_NAME)
  }
}

export {
  RoomTypeRepo,
}
