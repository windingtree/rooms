import { ObjectID } from 'mongodb'

type TRateModifierDbDataFields =
  | '_id'
  | 'hotelId'
  | 'type'
  | 'description'
  | 'enabled'
  | 'priority'
  | 'criteriaType'
  | 'priceModifierType'
  | 'priceModifierAmount'
  | 'combinable'
  | 'condition'
  | 'rooms'

type IRateModifierDbDataProjection = {
  [key in TRateModifierDbDataFields]?: 1
}


interface IBaseRateModifier {
  hotelId: string
  type: string
  description: string
  enabled: boolean
  priority: number
  criteriaType: IRateModifierConditionType
  priceModifierType: string
  priceModifierAmount: number
  combinable: boolean
  condition:IRateModifierConditionPayload
  rooms:Array<string>
}

interface IRateModifier extends IBaseRateModifier {
  id: string
}

type IRateModifierCollection = Array<IRateModifier>

interface IPostRateModifierPayload {
  hotelId: string
  type?: string
  description?: string
  enabled?: boolean
  priority?: number
  criteriaType?: string
  priceModifierType?: string
  priceModifierAmount?: number
  combinable?: boolean,
  condition?:IRateModifierConditionPayload
  rooms?:Array<string>
}

interface IPatchRateModifierPayload {
  hotelId?: string
  type?: string
  description?: string
  enabled?: boolean
  priority?: number
  criteriaType?: string
  priceModifierType?: string
  priceModifierAmount?: number
  combinable?: boolean,
  condition?:IRateModifierConditionPayload
  rooms?:Array<string>
}

interface IBaseRateModifierDbData {
  hotelId: ObjectID|null
  type: string
  description: string
  enabled: boolean
  priority: number
  criteriaType: IRateModifierConditionType
  priceModifierType: string
  priceModifierAmount: number
  combinable: boolean
  condition:IRateModifierConditionPayload
  rooms:Array<ObjectID>
}

interface IRateModifierDbData extends IBaseRateModifierDbData {
  _id: ObjectID|null
}

interface IPatchRateModifierPayloadDbData {
  hotelId?: ObjectID|null
  type?: string
  description?: string
  enabled?: boolean
  priority?: number
  criteriaType?: IRateModifierConditionType
  priceModifierType?: string
  priceModifierAmount?: number
  combinable?: boolean
  condition?:IRateModifierConditionPayload
  rooms?:Array<ObjectID>
}

type IRateModifierCollectionDbData = Array<IRateModifierDbData>

enum IRateModifierConditionType {
  DATE_RANGE = 'DATE_RANGE',
  DAY_OF_WEEK = 'DAYOFWEEK',
  LENGTH_OF_STAY = 'LENGTH_OF_STAY',
  UNSPECIFIED = 'UNSPECIFIED',
}
enum IRateModifierDiscountType {
  PERCENTAGE = 'percentage',
  ABSOLUTE = 'absolute'
}

interface IRateModifierConditionPayload {
  minStay?:number|null
  maxStay?:number|null
  monday?:boolean|null
  tuesday?:boolean|null
  wednesday?:boolean|null
  thursday?:boolean|null
  friday?:boolean|null
  saturday?:boolean|null
  sunday?:boolean|null
  startDate?:Date|null
  endDate?:Date|null
  promoCode?:string|null
}

export {
  TRateModifierDbDataFields,
  IRateModifierDbDataProjection,
  IBaseRateModifier,
  IRateModifier,
  IRateModifierCollection,
  IPostRateModifierPayload,
  IPatchRateModifierPayload,
  IBaseRateModifierDbData,
  IRateModifierDbData,
  IPatchRateModifierPayloadDbData,
  IRateModifierCollectionDbData,
  IRateModifierConditionPayload,
  IRateModifierConditionType,
  IRateModifierDiscountType
}
