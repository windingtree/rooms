interface IDecodedAuthToken {
  [field: string]: string
  email: string
  oneTimePassword: string
}

interface IUserAuthDetails {
  userIsAuthorized: boolean
  email: string
  oneTimePassword: string
}

export {
  IDecodedAuthToken,
  IUserAuthDetails,
}
