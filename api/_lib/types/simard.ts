interface ISimardPay {
  jwt: string
  apiUrl: string
}

interface IPaymentInfo {
  status: string
}

export {
  ISimardPay,
  IPaymentInfo,
}
