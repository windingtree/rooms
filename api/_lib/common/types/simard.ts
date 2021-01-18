interface ISimardPaymentInfo {
  amount: string|number
  creditorOrgId: string
  currency: string
  debtorOrgId: string
  expiration: string
}

interface ISimardGuaranteeClaim {
  settlementId: string
}

export { ISimardPaymentInfo, ISimardGuaranteeClaim }
