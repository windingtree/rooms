import * as moment from 'moment'

import {
  getObjectId,
  getObjectIdString,
} from '../../../_lib/tools'
import {
  IBaseOfferDbRecord,
  IOfferDbRecord,
  IOfferCollectionDbRecord,
  IPatchOfferPayloadDbData,

  IBaseOffer,
  IOffer,
  IOfferCollection,
  IPatchOfferPayload,
} from '../../../_lib/types'

function baseOfferDbRecordMapper(baseOffer: IBaseOffer): IBaseOfferDbRecord {
  const baseOfferDbRecord: IBaseOfferDbRecord = {
    offerId: baseOffer.offerId,
    arrival: moment.utc(baseOffer.arrival).toDate(),
    departure: moment.utc(baseOffer.departure).toDate(),
    offer: {
      pricePlansReferences: {
        BAR: {
          accommodation: getObjectId(baseOffer.offer.pricePlansReferences.BAR.accommodation),
          roomType: getObjectId(baseOffer.offer.pricePlansReferences.BAR.roomType),
        }
      },
      price: {
        currency: baseOffer.offer.price.currency,
        public: baseOffer.offer.price.public,
        taxes: baseOffer.offer.price.taxes,
      },
    },
    createdAt: moment.utc(baseOffer.createdAt).toDate(),
    debtorOrgId: baseOffer.debtorOrgId,
  }

  return baseOfferDbRecord
}

function offerDbRecordMapper(offer: IOffer): IOfferDbRecord {
  const offerDbRecord: IOfferDbRecord = {
    _id: getObjectId(offer.id),
    offerId: offer.offerId,
    arrival: moment.utc(offer.arrival).toDate(),
    departure: moment.utc(offer.departure).toDate(),
    offer: {
      pricePlansReferences: {
        BAR: {
          accommodation: getObjectId(offer.offer.pricePlansReferences.BAR.accommodation),
          roomType: getObjectId(offer.offer.pricePlansReferences.BAR.roomType),
        }
      },
      price: {
        currency: offer.offer.price.currency,
        public: offer.offer.price.public,
        taxes: offer.offer.price.taxes,
      },
    },
    createdAt: moment.utc(offer.createdAt).toDate(),
    debtorOrgId: offer.debtorOrgId,
  }

  return offerDbRecord
}

function offerCollectionDbRecordMapper(offerCollection: IOfferCollection): IOfferCollectionDbRecord {
  const offerDbRecordCollection: IOfferCollectionDbRecord = []
  offerCollection.forEach((offer) => {
    offerDbRecordCollection.push(offerDbRecordMapper(offer))
  })

  return offerDbRecordCollection
}

function patchOfferPayloadDbDataMapper(patchOfferPayload: IPatchOfferPayload): IPatchOfferPayloadDbData {
  const patchOfferPayloadDbData: IPatchOfferPayloadDbData = {}
  const prop: keyof IPatchOfferPayload = 'offer'

  if (typeof patchOfferPayload[prop] !== 'undefined') {
    patchOfferPayloadDbData[prop] = patchOfferPayload[prop]
  }

  return patchOfferPayloadDbData
}

function baseOfferMapper(baseOfferDbRecord: IBaseOfferDbRecord): IBaseOffer {
  const offer: IBaseOffer = {
    offerId: baseOfferDbRecord.offerId,
    arrival: moment.utc(baseOfferDbRecord.arrival).format(),
    departure: moment.utc(baseOfferDbRecord.departure).format(),
    offer: {
      pricePlansReferences: {
        BAR: {
          accommodation: getObjectIdString(baseOfferDbRecord.offer.pricePlansReferences.BAR.accommodation),
          roomType: getObjectIdString(baseOfferDbRecord.offer.pricePlansReferences.BAR.roomType),
        },
      },
      price: {
        currency: baseOfferDbRecord.offer.price.currency,
        public: baseOfferDbRecord.offer.price.public,
        taxes: baseOfferDbRecord.offer.price.taxes,
      },
    },
    createdAt: moment.utc(baseOfferDbRecord.createdAt).format(),
    debtorOrgId: baseOfferDbRecord.debtorOrgId,
  }

  return offer
}

function offerMapper(offerDbRecord: IOfferDbRecord): IOffer {
  const offer: IOffer = {
    id: getObjectIdString(offerDbRecord._id),
    arrival: moment.utc(offerDbRecord.arrival).format(),
    departure: moment.utc(offerDbRecord.departure).format(),
    offerId: offerDbRecord.offerId,
    offer: {
      pricePlansReferences: {
        BAR: {
          accommodation: getObjectIdString(offerDbRecord.offer.pricePlansReferences.BAR.accommodation),
          roomType: getObjectIdString(offerDbRecord.offer.pricePlansReferences.BAR.roomType),
        },
      },
      price: {
        currency: offerDbRecord.offer.price.currency,
        public: offerDbRecord.offer.price.public,
        taxes: offerDbRecord.offer.price.taxes,
      },
    },
    createdAt: moment.utc(offerDbRecord.createdAt).format(),
    debtorOrgId: offerDbRecord.debtorOrgId,
  }

  return offer
}

function offerCollectionMapper(offerDbRecordCollection: IOfferCollectionDbRecord): IOfferCollection {
  const offerCollection: IOfferCollection = []
  offerDbRecordCollection.forEach((offerDbRecord) => {
    offerCollection.push(offerMapper(offerDbRecord))
  })

  return offerCollection
}

export {
  baseOfferDbRecordMapper,
  offerDbRecordMapper,
  offerCollectionDbRecordMapper,

  baseOfferMapper,
  offerMapper,
  offerCollectionMapper,

  patchOfferPayloadDbDataMapper,
}
