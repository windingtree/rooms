interface IStatus {
  status: 'OK'
}

interface IHealthStatusMongo {
  status: string
  latency: string|undefined
  err?: unknown
}

interface IHealthStatus {
  mongo: IHealthStatusMongo
  app_version: string
}

interface IOtpStatus {
  email: string
  oneTimePassword: string
}

export {
  IStatus,
  IHealthStatusMongo,
  IHealthStatus,
  IOtpStatus,
}
