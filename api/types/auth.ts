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

interface IAnyObject {

}

export {
  IUserAuthDetails,
  IDecodedAuthToken,
  IAnyObject,
}
