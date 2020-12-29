import { OfferRepo } from '../OfferRepo'
import { CError } from '../../../../_lib/tools'
import { CONSTANTS } from '../../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = CONSTANTS.HTTP_STATUS

async function deleteOfferByOfferId(this: OfferRepo, offerId: string): Promise<void> {
  let result
  try {
    const collection = await this.getCollection()
    const filter = { offerId }

    result = await collection.deleteOne(filter)
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while deleting a '${this.ENTITY_NAME}'.`, err)
  }

  if (!result || !result.deletedCount) {
    throw new CError(NOT_FOUND, `Could not delete a '${this.ENTITY_NAME}'.`)
  }
}

export {
  deleteOfferByOfferId,
}
