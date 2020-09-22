interface IDecodedAuthToken {
  [field: string]: string;
  email: string;
  oneTimePassword: string;
}

export {
  IDecodedAuthToken
}
