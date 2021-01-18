import { OfferRepo } from '../OfferRepo'

async function deleteOfferByOfferId(this: OfferRepo, offerId: string): Promise<void> {
  let result
  try {
    const collection = await this.getCollection()
    const filter = { offerId }

    result = await collection.deleteOne(filter)
  } catch (err: unknown) {
    throw this.errorInternalEntityDelete(err)
  }

  if (!result || !result.deletedCount) {
    throw this.errorEntityNotFound()
  }
}

export { deleteOfferByOfferId }
