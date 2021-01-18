interface IAccommodationsRoomType {
  [key:string]: unknown
}

interface IAccommodation {
  [key:string]: unknown

  roomTypes: IAccommodationsRoomType
}

interface IAccommodations {
  [key:string]: IAccommodation
}

interface IPricePlans {
  [key:string]: unknown
}

interface IOffers {
  [key:string]: unknown
}

interface IPassengers {
  [key:string]: unknown
}

interface IOfferSearchResults {
  accommodations: IAccommodations
  pricePlans: IPricePlans
  offers: IOffers
  passengers: IPassengers
}

export { IOfferSearchResults }
