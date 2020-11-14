interface IDecodedAuthToken {
  [field: string]: string
  email: string
  oneTimePassword: string
  sessionToken: string
}

export {
  IDecodedAuthToken,
}
