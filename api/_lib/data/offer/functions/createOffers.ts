import { OfferRepo } from '../OfferRepo'
import { CError } from '../../../../_lib/tools'
import { IOfferCollection, IOfferCollectionDbData } from '../../../../_lib/types'
import { CONSTANTS } from '../../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

async function createOffers(this: OfferRepo, data: IOfferCollection): Promise<void> {
  const dbData: IOfferCollectionDbData = this.mapper.fromEntityCollection(data)

  let result
  try {
    const collection = await this.getCollection()

    result = await collection.insertMany(dbData)
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while creating a new '${this.ENTITY_NAME}'.`, err)
  }

  if (!result) {
    throw new CError(INTERNAL_SERVER_ERROR, `Could not create a new '${this.ENTITY_NAME}'.`)
  }
}

export {
  createOffers,
}
