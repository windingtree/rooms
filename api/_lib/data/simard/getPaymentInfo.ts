// node/npm imports
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

// application layer imports
import { generateOrgIdJwt } from '../../app/auth/orgid'
import { AppConfig } from '../../app/config'

// common imports
import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'
import { ISimardPaymentInfo } from '../../common/types'

const { BAD_GATEWAY } = CONSTANTS.HTTP_STATUS

async function getPaymentInfo(guaranteeId: string): Promise<ISimardPaymentInfo> {
  const appConfig = await AppConfig.getInstance().getConfig()

  const roomsPrivateKey = appConfig.WT_ROOMS_PRIVATE_KEY
  const roomsOrgId = appConfig.WT_ROOMS_ORGID
  const simardOrgId = appConfig.WT_SIMARD_ORGID
  const jwtToken = generateOrgIdJwt(roomsPrivateKey, roomsOrgId, simardOrgId, 'webserver')

  const simardApiUrl = appConfig.WT_SIMARD_API_URL
  const options: AxiosRequestConfig = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
    url: `${simardApiUrl}/balances/guarantees/${guaranteeId}`,
  }

  let response: AxiosResponse
  try {
    response = await axios(options)
  } catch (err: unknown) {
    throw new CError(BAD_GATEWAY, `Simard Pay did not verify guaranteeId '${guaranteeId}'`, err)
  }

  if (!response || !response.data) {
    throw new CError(BAD_GATEWAY, `Simard Pay returned a bad response for guaranteeId '${guaranteeId}'`)
  }

  const { amount, creditorOrgId, currency, debtorOrgId, expiration } = {...(response.data as ISimardPaymentInfo)}

  return {
    amount,
    creditorOrgId,
    currency,
    debtorOrgId,
    expiration,
  }
}

export { getPaymentInfo }
