import { OfferRepo } from '../OfferRepo'
import { IOfferDbData, IOffer } from '../../../common/types'

async function readOfferByOfferId(this: OfferRepo, offerId: string): Promise<IOffer> {
  let result: IOfferDbData|null
  try {
    const collection = await this.getCollection()
    const query = { offerId }
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

export { readOfferByOfferId }
