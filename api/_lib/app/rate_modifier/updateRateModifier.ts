import { RateModifierRepo } from '../../data/rate_modifier/RateModifierRepo'

import { CONSTANTS } from '../../common/constants'
import { IProfile, IPatchRateModifierPayload, IRateModifier } from '../../common/types'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const repo = new RateModifierRepo()

async function updateRateModifier(requester: IProfile, rateModifierId: string, data: IPatchRateModifierPayload): Promise<IRateModifier> {
  // TODO: Need to implement logic based on roles.

  let roomType: IRateModifier

  if (requester.role === SUPER_ADMIN) {
    await repo.updateRateModifierById(rateModifierId, data)
    roomType = await repo.readRateModifierById(rateModifierId)
  } else {
    await repo.updateRateModifierByHotelId(rateModifierId, requester.hotelId, data)
    roomType = await repo.readRateModifierByHotelId(rateModifierId, requester.hotelId)
  }

  return roomType
}

export { updateRateModifier }
