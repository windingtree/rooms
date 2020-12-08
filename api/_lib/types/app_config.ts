interface IAppConfig {
  SENDGRID_CALLBACK_URL: string
  SENDGRID_API_KEY: string

  WT_VERIFICATION_CODE: string
  WT_THEGRAPH_API_URL: string
  WT_ROOMS_ORGID: string
  WT_SIMARD_ORGID: string
  WT_SIMARD_API_URL: string

  WT_ROOMS_PRIVATE_KEY: string

  API_TEST_ENABLED: string
  API_TEST_EMAIL: string
  API_TEST_ONE_TIME_PASSWORD: string
  API_TEST_SESSION_TOKEN: string

  ENABLE_LOGIN_WITHOUT_SENDGRID: string
}

interface IAppConfigDbItem {
  key: keyof IAppConfig
  value: string
  encrypted: boolean
}

export {
  IAppConfig,
  IAppConfigDbItem,
}
