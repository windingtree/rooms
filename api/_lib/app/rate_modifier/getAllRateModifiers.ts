import { RateModifierRepo } from '../../data/rate_modifier/RateModifierRepo'

import { CONSTANTS } from '../../common/constants'
import { IProfile, IRateModifierCollection } from '../../common/types'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const repository = new RateModifierRepo()

async function getAllRateModifiers(requester: IProfile): Promise<IRateModifierCollection> {
  // TODO: Need to implement logic based on roles.

  let roomTypeCollection: IRateModifierCollection

  if (requester.role === SUPER_ADMIN) {
    roomTypeCollection = await repository.getAllRateModifiers()
  } else {
    roomTypeCollection = await repository.getRateModifiersByHotelId(requester.hotelId)
  }

  return roomTypeCollection
}

export { getAllRateModifiers }
