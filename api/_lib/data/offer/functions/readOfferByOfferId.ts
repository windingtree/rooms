import { OfferRepo } from '../OfferRepo'
import { CError } from '../../../../_lib/tools'
import { IOfferDbData, IOffer } from '../../../../_lib/types'
import { CONSTANTS } from '../../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = CONSTANTS.HTTP_STATUS

async function readOfferByOfferId(this: OfferRepo, offerId: string): Promise<IOffer> {
  let result: IOfferDbData|null
  try {
    const collection = await this.getCollection()
    const query = { offerId }
    const options = { projection: this.getProjection() }

    result = await collection.findOne(query, options)
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, `An error occurred while retrieving a '${this.ENTITY_NAME}'.`, err)
  }

  if (!result) {
    throw new CError(NOT_FOUND, `Could not retrieve a '${this.ENTITY_NAME}'.`)
  }

  return this.mapper.toEntity(result)
}

export {
  readOfferByOfferId,
}
