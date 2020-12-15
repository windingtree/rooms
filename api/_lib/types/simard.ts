interface ISimardPaymentInfo {
  amount: string
  creditorOrgId: string
  currency: string
  debtorOrgId: string
  expiration: string
}

interface ISimardGuaranteeClaim {
  settlementId: string
}

export {
  ISimardPaymentInfo,
  ISimardGuaranteeClaim,
}
