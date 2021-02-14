import { RateModifierRepo } from '../../data/rate_modifier/RateModifierRepo'

import { CONSTANTS } from '../../common/constants'
import { IProfile, IStatus } from '../../common/types'

const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const repo = new RateModifierRepo()

async function deleteRateModifier(requester: IProfile, rateModifierId: string): Promise<IStatus> {
  // TODO: Need to implement logic based on roles.

  if (requester.role === SUPER_ADMIN) {
    await repo.deleteRateModifierById(rateModifierId)
  } else {
    await repo.deleteRateModifierByHotelId(rateModifierId, requester.hotelId)
  }

  return { status: 'OK' }
}

export { deleteRateModifier }
