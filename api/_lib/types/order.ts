interface IPostCreateOrderPassenger {
  type: string
  civility: string
  lastnames: Array<string>
  firstnames: Array<string>
  gender: string
  birthdate: string
  contactInformation: Array<string>
}

interface IPostCreateOrderPayloadPassengers {
  [key: string]: IPostCreateOrderPassenger
}

interface IPostCreateOrderPayload {
  offerId: string
  travellerName?: string
  travellerPhone?: string
  travellerEmail?: string
  passengers: IPostCreateOrderPayloadPassengers
}

interface ICreateOrderResultDetailsPrice {
  currency: string
  private: number
  public: number
  commission: number
  taxes: number
}

interface ICreateOrderResultDetailsRestrictions {
  refundable: boolean
  exchangeable: boolean
  refundFee: number
  exchangeFee: number
}

interface ICreateOrderResultDetails {
  passengers: IPostCreateOrderPayloadPassengers
  price: ICreateOrderResultDetailsPrice,
  restrictions: ICreateOrderResultDetailsRestrictions
  itinerary: unknown,
  options: Array<unknown>,
  status: string
}

interface ICreateOrderResult {
  orderId: string
  order: ICreateOrderResultDetails
}

export {
  IPostCreateOrderPassenger,
  IPostCreateOrderPayloadPassengers,
  IPostCreateOrderPayload,
  ICreateOrderResult,
}
