import { Collection } from 'mongodb'

import { MongoDB } from '../../../_lib/infra/mongo'
import { ENV } from '../../../_lib/infra/env'
import { BaseDataRepo } from '../../../_lib/tools'
import { TOfferDbDataFields, IOfferDbDataProjection, IOfferDbData } from '../../../_lib/types'

import {
  createOffers,
  readOfferByOfferId,
  deleteOfferByOfferId,
} from './functions'

import { OfferMongoDataMapper } from './OfferMongoDataMapper'

class OfferRepo extends BaseDataRepo {
  protected mapper = new OfferMongoDataMapper()

  public createOffers = createOffers
  public readOfferByOfferId = readOfferByOfferId
  public deleteOfferByOfferId = deleteOfferByOfferId

  constructor() {
    super()

    this.ENTITY_NAME = 'offer'
    this.COLLECTION_NAME = 'offers'
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
