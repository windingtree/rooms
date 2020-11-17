import { JWK, JWT } from 'jose'

import { CError } from '../../../tools'
import { AppConfig } from '../../../infra/config'
import { IOrgDetails } from '../../../types'

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
    throw new CError(401, 'Error while retrieving public key.')
  }

  if (!publicKey) {
    throw new CError(401, 'Public key definition not found in the DID document.')
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
    throw new CError(401, 'Could not load the public key as JWK.')
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
    throw new CError(401, 'Could not verify the public key.')
  }
}

export {
  verifyOrgIdPublicKey,
}
