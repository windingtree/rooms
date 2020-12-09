import { AppConfig } from '../../../_lib/infra/config'
import { generateOrgIdJwt } from '../../../_lib/app/auth/orgid'
import { CError } from '../../../_lib/tools'
import { CONSTANTS } from '../../../_lib/infra/constants'
import { ISimardPay } from '../../../_lib/types'

const { INTERNAL_SERVER_ERROR, BAD_GATEWAY } = CONSTANTS.HTTP_STATUS

class SimardPay {
  private static _instance: SimardPay = new SimardPay()
  private _simard: ISimardPay|null = null

  constructor() {
    if (SimardPay._instance) {
      throw new CError(
        INTERNAL_SERVER_ERROR,
        'SimardPay class instantiation failed. Use SimardPay.getInstance() instead of new operator.'
      )
    }
    SimardPay._instance = this
  }

  public static getInstance(): SimardPay {
    return SimardPay._instance
  }

  private async createSimard(): Promise<void> {
    if (this._simard) {
      return
    }

    try {
      const appConfig = await AppConfig.getInstance().getConfig()

      const roomsPrivateKey = appConfig.WT_ROOMS_PRIVATE_KEY
      const roomsOrgId = appConfig.WT_ROOMS_ORGID
      const simardOrgId = appConfig.WT_SIMARD_ORGID

      const simardApiUrl = appConfig.WT_SIMARD_API_URL

      const jwtToken = generateOrgIdJwt(roomsPrivateKey, roomsOrgId, simardOrgId, 'webserver')

      this._simard = {
        jwt: jwtToken,
        apiUrl: simardApiUrl,
      }
    } catch (err) {
      this._simard = null
      return
    }
  }

  public async getSimard(): Promise<ISimardPay> {
    await SimardPay._instance.createSimard()

    if (this._simard === null) {
      throw new CError(BAD_GATEWAY, 'Could not get SimardPay from the database.')
    }

    return this._simard
  }
}

export {
  SimardPay,
}
