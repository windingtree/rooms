import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { generateOrgIdJwt } from '../../../_lib/app/auth'
import { AppConfig } from '../../../_lib/infra/config'
import { IPaymentInfo } from '../../../_lib/types'

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

  console.log('')
  console.log(`Simard request options: ${JSON.stringify(options)}`)

  let response: AxiosResponse
  try {
    response = await axios(options)

    if (response && response.data) {
      console.log(`Simard response.data: ${JSON.stringify(response.data)}`)
    } else if (response) {
      console.log(`Simard response: ${JSON.stringify(response)}`)
    } else {
      console.log('Simard response: ', response)
    }

    console.log('-------')
  } catch (error) {
    console.error(`Simard error: ${JSON.stringify(error)}`)
    console.log('-------')
  }

  return {
    status: 'OK',
  }
}

export {
  getPaymentInfo,
}
