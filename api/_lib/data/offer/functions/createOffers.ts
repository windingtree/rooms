import { OfferRepo } from '../OfferRepo'
import { IBaseOfferCollection, IBaseOfferCollectionDbData } from '../../../common/types'

async function createOffers(this: OfferRepo, data: IBaseOfferCollection): Promise<void> {
  const dbData: IBaseOfferCollectionDbData = this.mapper.fromBaseEntityCollection(data)

  let result
  try {
    const collection = await this.getCollection()

    result = await collection.insertMany(dbData)
  } catch (err: unknown) {
    throw this.errorInternalEntityCollectionCreate(err)
  }

  if (!result.insertedCount) {
    throw this.errorInternalEntityCollectionCreate()
  }
}

export { createOffers }
