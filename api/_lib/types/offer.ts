import { ObjectID } from 'mongodb'

type TOfferDbDataFields =
  | '_id'
  | 'offerId'
  | 'arrival'
  | 'departure'
  | 'offer'
  | 'createdAt'
  | 'debtorOrgId'
  | 'hotelEmail'

type IOfferDbDataProjection = {
  [key in TOfferDbDataFields]?: 1
}

interface IOfferPricePlan {
  accommodation: string
  roomType: string
}

interface IOfferPricePlanDbRecord {
  accommodation: ObjectID|null
  roomType: ObjectID|null
}

interface IOfferDetailsPricePlansReferences {
  BAR: IOfferPricePlan
}

interface IOfferDetailsPricePlansReferencesDbRecord {
  BAR: IOfferPricePlanDbRecord
}

interface IOfferDetailsPrice {
  currency: string
  public: number
  taxes: number
}

interface IOfferDetails {
  pricePlansReferences: IOfferDetailsPricePlansReferences
  price: IOfferDetailsPrice
}

interface IOfferDetailsDbRecord {
  pricePlansReferences: IOfferDetailsPricePlansReferencesDbRecord
  price: IOfferDetailsPrice
}

interface IBaseOffer {
  offerId: string
  arrival: string
  departure: string
  offer: IOfferDetails
  createdAt: string
  debtorOrgId: string
  hotelEmail: string
}

interface IOffer extends IBaseOffer {
  id: string
}

type IOfferCollection = Array<IOffer>

interface IPostOfferPayload {
  offerId: string
  arrival: string
  departure: string
  offer: IOfferDetails
  createdAt: string
  debtorOrgId: string
  hotelEmail: string
}

interface IPatchOfferPayload {
  arrival?: string
  departure?: string
  hotelEmail?: string
}

interface IBaseOfferDbData {
  offerId: string
  arrival: Date|null
  departure: Date|null
  offer: IOfferDetailsDbRecord
  createdAt: Date|null
  debtorOrgId: string
  hotelEmail: string
}

interface IOfferDbData extends IBaseOfferDbData {
  _id: ObjectID|null
}

type IOfferCollectionDbData = Array<IOfferDbData>

interface IPatchOfferPayloadDbData {
  arrival?: Date|null
  departure?: Date|null
  hotelEmail?: string
}

export {
  TOfferDbDataFields,
  IOfferDbDataProjection,
  IBaseOffer,
  IOffer,
  IOfferCollection,
  IBaseOfferDbData,
  IOfferDbData,
  IOfferCollectionDbData,
  IPostOfferPayload,
  IPatchOfferPayload,
  IPatchOfferPayloadDbData,
}
