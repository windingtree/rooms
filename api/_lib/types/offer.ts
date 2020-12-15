import { ObjectID } from 'mongodb'

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
  arrival: string
  departure: string
  offer: IOfferDetails
}

interface IBaseOfferDbRecord {
  offerId: string
  arrival: Date
  departure: Date
  offer: IOfferDetailsDbRecord
  createdAt: Date
  debtorOrgId: string
  hotelEmail: string
}

interface IOfferDbRecord extends IBaseOfferDbRecord {
  _id: ObjectID|null
}

type IOfferCollectionDbRecord = Array<IOfferDbRecord>

interface IPatchOfferPayloadDbData {
  offer?: IOfferDetails
}

export {
  IBaseOffer,
  IOffer,
  IOfferCollection,

  IBaseOfferDbRecord,
  IOfferDbRecord,
  IOfferCollectionDbRecord,

  IPostOfferPayload,
  IPatchOfferPayload,

  IPatchOfferPayloadDbData,
}
