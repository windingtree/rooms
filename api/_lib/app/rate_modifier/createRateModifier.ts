import { RateModifierRepo } from '../../data/rate_modifier/RateModifierRepo'

import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'
import {
  IBaseRateModifier,
  IPostRateModifierPayload,
  IProfile,
  IRateModifier,
  IRateModifierConditionType
} from '../../common/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS
const { SUPER_ADMIN } = CONSTANTS.PROFILE_ROLE

const repository = new RateModifierRepo()

async function createRateModifier(requester: IProfile, payload: IPostRateModifierPayload): Promise<IRateModifier> {
  // TODO: Need to verify things in `payload`, and also implement logic based on roles.

  if (
    (requester.role !== SUPER_ADMIN) &&
    (requester.hotelId !== payload.hotelId)
  ) {
    throw new CError(
      BAD_REQUEST,
      `User with role ${requester.role} is not allowed to create a Rate Modifiers for a hotel which is not his.`
    )
  }

  const record: IBaseRateModifier = {
    hotelId: payload.hotelId,
    type: toValueOrEmpty(payload.type),
    description: toValueOrEmpty(payload.description),
    enabled: !!payload.enabled,
    criteriaType:rateModifierConditionTypeFromString(payload.criteriaType),
    priceModifierType:'',
    priceModifierAmount:0,
    combinable:true,
    priority:3,
    condition:{},
    rooms:[]
  }
  const rateModifierId: string = await repository.createRateModifier(record)
  return Object.assign({}, record, { id: rateModifierId })
}

function rateModifierConditionTypeFromString(criteriaType?:string):IRateModifierConditionType|null{
  if(!criteriaType)
    {return null;}
  switch(criteriaType){
    case IRateModifierConditionType.DAY_OF_WEEK:
      return IRateModifierConditionType.DAY_OF_WEEK;
    case IRateModifierConditionType.DATE_RANGE:
      return IRateModifierConditionType.DATE_RANGE;
    case IRateModifierConditionType.LENGTH_OF_STAY:
      return IRateModifierConditionType.LENGTH_OF_STAY;
    default:
      throw new CError(
          BAD_REQUEST,
          `Unknown criteriaType value ${criteriaType}`
      )
  }

}

function toValueOrEmpty (param?:string){
  if(param !== undefined)
    {return param;}
  return ''
}
export { createRateModifier }
