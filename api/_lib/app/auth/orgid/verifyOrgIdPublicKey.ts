import { JWK, JWT } from 'jose'

import { AppConfig } from '../../../app/config'

import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'
import { IOrgDetails } from '../../../common/types'

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
  } catch (err: unknown) {
    throw new CError(UNAUTHORIZED, 'Error while retrieving public key.', err)
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
  } catch (err: unknown) {
    throw new CError(UNAUTHORIZED, 'Could not load the public key as JWK.', err)
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
  } catch (err: unknown) {
    throw new CError(UNAUTHORIZED, 'Could not verify the public key.', err)
  }
}

export { verifyOrgIdPublicKey }
