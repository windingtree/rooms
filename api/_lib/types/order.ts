interface IPostCreateOrderPassenger {
  type: string
  civility: string
  lastnames: Array<string>
  firstnames: Array<string>
  gender: string
  birthdate: string
  contactInformation: Array<string>
}

interface IPostCreateOrderPayload {
  offerId: string
  travellerName?: string
  travellerPhone?: string
  travellerEmail?: string
}

interface ICreateOrderResult {
  status: string
}

export {
  IPostCreateOrderPassenger,
  IPostCreateOrderPayload,
  ICreateOrderResult,
}
