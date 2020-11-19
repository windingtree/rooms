import { JWK, JWT } from 'jose'

import { CError } from '../../../../_lib/tools'
import { AppConfig } from '../../../../_lib/infra/config'
import { CONSTANTS } from '../../../../_lib/infra/constants'
import { IOrgDetails } from '../../../../_lib/types'

const { UNAUTHORIZED } = CONSTANTS.HTTP_STATUS

async function verifyOrgIdPublicKey(
  orgDetails: IOrgDetails, bearerToken: string, publicKeyFragment: string
): Promise<void> {
  const appConfig = await AppConfig.getInstance().getConfig()

  let publicKey
  try {
    // Retrieve the Public Key PEM
    publicKey = orgDetails.organization.publicKey.filter(
      p => p.id.match(RegExp(`#${publicKeyFragment}$`, 'g'))
    )[0]
  } catch (err) {
    throw new CError(UNAUTHORIZED, 'Error while retrieving public key.')
  }

  if (!publicKey) {
    throw new CError(UNAUTHORIZED, 'Public key definition not found in the DID document.')
  }

  const pubKeyToVerify = '-----BEGIN PUBLIC KEY-----\n' + publicKey.publicKeyPem + '\n-----END PUBLIC KEY-----'

  // Load Public Key as a JWK
  let pubKey
  try {
    pubKey = JWK.asKey(
      pubKeyToVerify,
      {
        alg: 'ES256K',
        use: 'sig',
      }
    )
  } catch (err) {
    throw new CError(UNAUTHORIZED, 'Could not load the public key as JWK.')
  }

  const jwtOptions = {
    typ: 'JWT',
    aud: appConfig.WT_ROOMS_ORGID,
  }

  try {
    // Throws if the verification fails
    JWT.verify(
      bearerToken,
      pubKey,
      jwtOptions
    )
  } catch (err) {
    throw new CError(UNAUTHORIZED, 'Could not verify the public key.')
  }
}

export {
  verifyOrgIdPublicKey,
}
