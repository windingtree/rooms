import { Collection } from 'mongodb'

import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { TOfferDbDataFields, IOfferDbDataProjection, IOfferDbData } from '../../../_lib/types'

import {
  createOffers,
  readOfferByOfferId,
  deleteOfferByOfferId,
} from './functions'

import { MongoDataMapper } from './mapper'

class OfferRepo {
  protected ENTITY_NAME
  protected COLLECTION_NAME

  protected mapper

  public createOffers
  public readOfferByOfferId
  public deleteOfferByOfferId

  constructor() {
    this.ENTITY_NAME = 'offer'
    this.COLLECTION_NAME = 'offers'

    this.mapper = new MongoDataMapper()

    this.createOffers = createOffers
    this.readOfferByOfferId = readOfferByOfferId
    this.deleteOfferByOfferId = deleteOfferByOfferId
  }

  protected getProjection(): IOfferDbDataProjection {
    const allowedFields: Array<TOfferDbDataFields> = [
      '_id',
      'offerId',
      'arrival',
      'departure',
      'offer',
      'createdAt',
      'debtorOrgId',
      'hotelEmail',
    ]

    return allowedFields.reduce((projection: IOfferDbDataProjection, field) => {
      projection[field] = 1

      return projection
    }, {})
  }

  protected async getCollection(): Promise<Collection<IOfferDbData>> {
    const dbClient = await MongoDB.getInstance().getDbClient()
    const database = dbClient.db(ENV.ROOMS_DB_NAME)

    return database.collection(this.COLLECTION_NAME)
  }
}

export {
  OfferRepo,
}
