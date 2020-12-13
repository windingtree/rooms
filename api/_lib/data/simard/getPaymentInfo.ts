import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { generateOrgIdJwt } from '../../../_lib/app/auth/orgid'
import { AppConfig } from '../../../_lib/infra/config'
import { CError } from '../../../_lib/tools'
import { CONSTANTS } from '../../infra/constants'
import { IPaymentInfo } from '../../../_lib/types'

const { BAD_GATEWAY } = CONSTANTS.HTTP_STATUS

async function getPaymentInfo(guaranteeId: string): Promise<IPaymentInfo> {
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

  console.log('-------')
  console.log(`Simard request options: ${JSON.stringify(options)}\n`)
  console.log('-------')

  let response: AxiosResponse
  try {
    response = await axios(options)

    console.log('-------')
    if (response && response.data) {
      console.log(`Simard response.data: ${JSON.stringify(response.data)}\n`)
    } else if (response) {
      console.log(`Simard response: ${JSON.stringify(response)}\n`)
    } else {
      console.log('Simard response: ', response)
    }
    console.log('-------')
  } catch (error) {
    console.log('-------')
    console.error(`Simard error: ${JSON.stringify(error)}\n`)
    console.log('-------')
    throw new CError(BAD_GATEWAY, `Simard Pay did not verify guaranteeId '${guaranteeId}'`)
  }

  return {
    status: 'OK',
  }
}

export {
  getPaymentInfo,
}
