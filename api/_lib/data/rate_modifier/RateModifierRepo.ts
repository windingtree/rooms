import { Collection } from 'mongodb'
import { MongoDB } from '../../infra/mongo'
import { ENV } from '../../common/env'
import { BaseDataRepo } from '../../common/tools'
import {
  TRateModifierDbDataFields,
  IRateModifierDbDataProjection,
  IRateModifierDbData,
  IRateModifierCollection,
  IRateModifierCollectionDbData,
  IBaseRateModifier,
  IBaseRateModifierDbData,
  IPatchRateModifierPayload, IPatchRateModifierPayloadDbData, IRateModifier
} from '../../common/types'


import { RateModifierMongoDataMapper } from './RateModifierMongoDataMapper'

class RateModifierRepo extends BaseDataRepo {
  protected mapper = new RateModifierMongoDataMapper()

  constructor() {
    super()

    this.ENTITY_NAME = 'rate_modifier'
    this.COLLECTION_NAME = 'rate_modifiers'
  }

  protected getProjection(): IRateModifierDbDataProjection {
    const allowedFields: Array<TRateModifierDbDataFields> = [
      '_id',
      'hotelId',
      'type',
      'description',
      'enabled',
      'priority',
      'criteriaType',
      'priceModifierType',
      'priceModifierAmount',
      'combinable',
      'condition',
      'rooms'
    ]

    return allowedFields.reduce((projection: IRateModifierDbDataProjection, field) => {
      projection[field] = 1

      return projection
    }, {})
  }

  protected async getCollection(): Promise<Collection<IRateModifierDbData>> {
    const dbClient = await MongoDB.getInstance().getDbClient()
    const database = dbClient.db(ENV.ROOMS_DB_NAME)

    return database.collection(this.COLLECTION_NAME)
  }

  /**
   * Return rate modifiers matching with provided search criteria (which are optional)
   * @param hotelId If provider, only rate modifiers that belong to specified hotel will be returned
   * @private
   */
  private async getRateModifiers(hotelId?:string):Promise<IRateModifierCollection>{
    const result: IRateModifierCollectionDbData = []
    try {
      const collection = await this.getCollection()
      //create search query (hotelId is optional - thus only add that if it was provided as a parameter)
      const query = {
        ...(hotelId!==undefined && { hotelId:this.mapper.toObjectId(hotelId) })
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

  /**
   * Return rate modifiers that belong to a hotel specified as a parameter
   * @param hotelId
   */
  public async getRateModifiersByHotelId(hotelId:string):Promise<IRateModifierCollection>{
    return this.getRateModifiers(hotelId);
  }

  /**
   * Return all available rate modifiers
   */
  public async getAllRateModifiers():Promise<IRateModifierCollection>{
    return this.getRateModifiers();
  }


  public async createRateModifier(data: IBaseRateModifier): Promise<string> {
    const record: IBaseRateModifierDbData = this.mapper.fromBaseEntity(data)

    let result
    try {
      const collection = await this.getCollection()
      result = await collection.insertOne(record)
    } catch (err: unknown) {
      throw this.errorInternalEntityCreate(err)
    }

    if (!result.insertedId) {
      throw this.errorInternalEntityCreate()
    }
    return this.mapper.fromObjectId(result.insertedId)
  }

  private async deleteRateModifier(rateModifierId: string, hotelId?: string): Promise<void> {
    let result
    try {
      const collection = await this.getCollection()
      const filter = {
        _id: this.mapper.toObjectId(rateModifierId),
        ...(hotelId!==undefined && { hotelId:this.mapper.toObjectId(hotelId) })
      }
      result = await collection.deleteOne(filter)
    } catch (err: unknown) {
      throw this.errorInternalEntityDelete(err)
    }

    if (!result || !result.deletedCount) {
      throw this.errorEntityNotFound()
    }
  }

  public async deleteRateModifierByHotelId(rateModifierId:string,hotelId:string):Promise<void>{
    return this.deleteRateModifier(rateModifierId,hotelId);
  }
  public async deleteRateModifierById(rateModifierId:string):Promise<void>{
    return this.deleteRateModifier(rateModifierId,undefined);
  }

  private async readRateModifier(rateModifierId: string, hotelId?: string): Promise<IRateModifier> {
    let result: IRateModifierDbData|null
    try {
      const collection = await this.getCollection()
      const query = {
        _id: this.mapper.toObjectId(rateModifierId),
        ...(hotelId!==undefined && { hotelId:this.mapper.toObjectId(hotelId) })
      }
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

  public async readRateModifierById(rateModifierId: string):Promise<IRateModifier>{
    return this.readRateModifier(rateModifierId,undefined)
  }
  public async readRateModifierByHotelId(rateModifierId: string, hotelId:string):Promise<IRateModifier>{
    return this.readRateModifier(rateModifierId,hotelId)
  }


  private async updateRateModifier(rateModifierId: string, data: IPatchRateModifierPayload, hotelId?: string): Promise<void> {
    const dbData: IPatchRateModifierPayloadDbData = this.mapper.fromPatchEntityPayload(data)

    let result
    try {
      const collection = await this.getCollection()
      const filter = {
        _id: this.mapper.toObjectId(rateModifierId),
        ...(hotelId !== undefined && { hotelId: this.mapper.toObjectId(hotelId) })
      }
      const options = { upsert: false }
      const updateDoc = { $set: dbData }

      result = await collection.updateOne(filter, updateDoc, options)
    } catch (err: unknown) {
      throw this.errorInternalEntityUpdate(err)
    }

    if (!result || !result.matchedCount) {
      throw this.errorEntityNotFound()
    }
  }
  public async updateRateModifierById(rateModifierId: string, data: IPatchRateModifierPayload): Promise<void> {
    return this.updateRateModifier(rateModifierId,data,undefined);
  }
  public async updateRateModifierByHotelId(rateModifierId: string, hotelId: string, data: IPatchRateModifierPayload, ): Promise<void> {
    return this.updateRateModifier(rateModifierId,data,hotelId);
  }
}

export { RateModifierRepo }
