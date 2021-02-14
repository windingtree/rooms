import { RateModifierRepo } from '../../data/rate_modifier/RateModifierRepo'

import { CONSTANTS } from '../../common/constants'
import { IProfile, IRateModifier } from '../../common/types'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const repo = new RateModifierRepo()

async function getRateModifier(requester: IProfile, rateModifierId: string): Promise<IRateModifier> {
  // TODO: Need to implement logic based on roles.

  let rateModifier: IRateModifier

  if (requester.role === SUPER_ADMIN) {
    rateModifier = await repo.readRateModifierById(rateModifierId)
  } else {
    rateModifier = await repo.readRateModifierByHotelId(rateModifierId, requester.hotelId)
  }

  return rateModifier
}

export { getRateModifier }
