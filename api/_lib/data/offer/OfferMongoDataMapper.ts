import {
  BaseMongoDataMapper,
} from '../../common/tools'
import {
  IBaseOfferDbData,
  IBaseOfferCollectionDbData,
  IOfferDbData,
  IOfferCollectionDbData,
  IPatchOfferPayloadDbData,

  IBaseOffer,
  IBaseOfferCollection,
  IOffer,
  IOfferCollection,
  IPatchOfferPayload,
} from '../../common/types'

class OfferMongoDataMapper extends BaseMongoDataMapper {
  fromBaseEntity(baseOffer: IBaseOffer): IBaseOfferDbData {
    return {
      offerId: baseOffer.offerId,
      arrival: this.toDate(baseOffer.arrival),
      departure: this.toDate(baseOffer.departure),
      offer: {
        pricePlansReferences: {
          BAR: {
            accommodation: this.toObjectId(baseOffer.offer.pricePlansReferences.BAR.accommodation),
            roomType: this.toObjectId(baseOffer.offer.pricePlansReferences.BAR.roomType),
          }
        },
        price: {
          currency: baseOffer.offer.price.currency,
          public: baseOffer.offer.price.public,
          taxes: baseOffer.offer.price.taxes,
        },
      },
      createdAt: this.toDate(baseOffer.createdAt),
      debtorOrgId: baseOffer.debtorOrgId,
      hotelEmail: baseOffer.hotelEmail,
    }
  }

  toBaseEntity(baseOfferDbRecord: IBaseOfferDbData): IBaseOffer {
    return {
      offerId: baseOfferDbRecord.offerId,
      arrival: this.fromDate(baseOfferDbRecord.arrival),
      departure: this.fromDate(baseOfferDbRecord.departure),
      offer: {
        pricePlansReferences: {
          BAR: {
            accommodation: this.fromObjectId(baseOfferDbRecord.offer.pricePlansReferences.BAR.accommodation),
            roomType: this.fromObjectId(baseOfferDbRecord.offer.pricePlansReferences.BAR.roomType),
          },
        },
        price: {
          currency: baseOfferDbRecord.offer.price.currency,
          public: baseOfferDbRecord.offer.price.public,
          taxes: baseOfferDbRecord.offer.price.taxes,
        },
      },
      createdAt: this.fromDate(baseOfferDbRecord.createdAt),
      debtorOrgId: baseOfferDbRecord.debtorOrgId,
      hotelEmail: baseOfferDbRecord.hotelEmail,
    }
  }

  fromPatchEntityPayload(patchOfferPayload: IPatchOfferPayload): IPatchOfferPayloadDbData {
    const availProps: Array<keyof IPatchOfferPayload> = [
      'arrival',
      'departure',
      'hotelEmail',
    ]

    return availProps.reduce((patchOfferPayloadDbData: IPatchOfferPayloadDbData, prop): IPatchOfferPayloadDbData => {
      if (!patchOfferPayload[prop]) {
        return patchOfferPayloadDbData
      }

      switch (prop) {
        case 'arrival':
        case 'departure':
          patchOfferPayloadDbData[prop] = this.toDate((patchOfferPayload[prop] as string))
          break
        case 'hotelEmail':
          patchOfferPayloadDbData[prop] = patchOfferPayload[prop]
          break
      }

      return patchOfferPayloadDbData
    }, {})
  }

  fromEntity(offer: IOffer): IOfferDbData {
    return Object.assign({ _id: this.toObjectId(offer.id) }, this.fromBaseEntity(offer))
  }

  toEntity(offerDbRecord: IOfferDbData): IOffer {
    return Object.assign({ id: this.fromObjectId(offerDbRecord._id) }, this.toBaseEntity(offerDbRecord))
  }

  fromBaseEntityCollection(baseOfferCollection: IBaseOfferCollection): IBaseOfferCollectionDbData {
    return baseOfferCollection.map((baseOffer: IBaseOffer): IBaseOfferDbData => {
      return this.fromBaseEntity(baseOffer)
    })
  }

  toBaseEntityCollection(baseOfferCollectionDbData: IBaseOfferCollectionDbData): IBaseOfferCollection {
    return baseOfferCollectionDbData.map((baseOfferDbData: IBaseOfferDbData): IBaseOffer => {
      return this.toBaseEntity(baseOfferDbData)
    })
  }

  fromEntityCollection(offerCollection: IOfferCollection): IOfferCollectionDbData {
    return offerCollection.map((offer: IOffer): IOfferDbData => {
      return this.fromEntity(offer)
    })
  }

  toEntityCollection(offerCollectionDbData: IOfferCollectionDbData): IOfferCollection {
    return offerCollectionDbData.map((offerDbData: IOfferDbData): IOffer => {
      return this.toEntity(offerDbData)
    })
  }
}

export {
  OfferMongoDataMapper,
}
