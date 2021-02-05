import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { generateOrgIdJwt } from '../../app/auth/orgid'
import { AppConfig } from '../../app/config'

import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'
import { ISimardGuaranteeClaim } from '../../common/types'

const { BAD_GATEWAY } = CONSTANTS.HTTP_STATUS

async function claimGuarantee(guaranteeId: string): Promise<ISimardGuaranteeClaim> {
  const appConfig = await AppConfig.getInstance().getConfig()

  const roomsPrivateKey = appConfig.WT_ROOMS_PRIVATE_KEY
  const roomsPrivateKeyFragment = appConfig.WT_ROOMS_PRIVATE_KEY_FRAGMENT
  const roomsOrgId = appConfig.WT_ROOMS_ORGID
  const simardOrgId = appConfig.WT_SIMARD_ORGID
  const jwtToken = generateOrgIdJwt(roomsPrivateKey, roomsOrgId, simardOrgId, roomsPrivateKeyFragment)

  const simardApiUrl = appConfig.WT_SIMARD_API_URL
  const options: AxiosRequestConfig = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
    url: `${simardApiUrl}/balances/guarantees/${guaranteeId}/claim`,
  }

  let response: AxiosResponse
  try {
    response = await axios(options)
  } catch (err: unknown) {
    throw new CError(BAD_GATEWAY, `Simard Pay could not handle claim of guarantee with ID '${guaranteeId}'`, err)
  }

  if (!response || !response.data) {
    throw new CError(BAD_GATEWAY, `Simard Pay returned a bad response for claim of guarantee with ID '${guaranteeId}'`)
  }

  const { settlementId } = { ...(response.data as ISimardGuaranteeClaim) }

  return {
    settlementId,
  }
}

export { claimGuarantee }
