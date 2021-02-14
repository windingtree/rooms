import { ObjectID } from 'mongodb'


type TRateModifierDbDataFields =
  | '_id'
  | 'hotelId'
  | 'type'
  | 'description'
  | 'enabled'

type IRateModifierDbDataProjection = {
  [key in TRateModifierDbDataFields]?: 1
}

interface IBaseRateModifier {
  hotelId: string
  type: string
  description: string
  enabled: boolean
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
}

interface IPatchRateModifierPayload {
  hotelId?: string
  type?: string
  description?: string
  enabled?: boolean
}

interface IBaseRateModifierDbData {
  hotelId: ObjectID|null
  type: string
  description: string
  enabled: boolean
}

interface IRateModifierDbData extends IBaseRateModifierDbData {
  _id: ObjectID|null
}

interface IPatchRateModifierPayloadDbData {
  hotelId?: ObjectID|null
  type?: string
  description?: string
  enabled?: boolean
}

type IRateModifierCollectionDbData = Array<IRateModifierDbData>

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
}
