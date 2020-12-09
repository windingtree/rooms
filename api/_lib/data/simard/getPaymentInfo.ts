import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { CError } from '../../../_lib/tools'
import { CONSTANTS } from '../../infra/constants'
import { IPaymentInfo } from '../../../_lib/types'

const { BAD_GATEWAY } = CONSTANTS.HTTP_STATUS

async function getPaymentInfo(simardApiUrl: string, jwtToken: string, guaranteeId: string): Promise<IPaymentInfo> {
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
  } catch (error) {
    throw new CError(BAD_GATEWAY, `Simard Pay did not verify guaranteeId '${guaranteeId}'`)
  }

  return {
    status: 'OK',
  }
}

export {
  getPaymentInfo,
}
