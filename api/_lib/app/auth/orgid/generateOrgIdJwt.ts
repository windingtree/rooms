import { JWK, JWT } from 'jose'

import { CError } from '../../../../_lib/tools'
import { CONSTANTS } from '../../../infra/constants'
import { IOrgJwtTokenOptions } from '../../../../_lib/types'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

function genOptions(
  privKey: string,
  origin: string,
  recipient: string,
  fragment = 'webserver',
  time = '1 year',
  scope: string | undefined = undefined
): IOrgJwtTokenOptions {
  return {
    priv: privKey,
    alg: 'ES256K',
    iss: `did:orgid:${origin}`,
    aud: `did:orgid:${recipient}`,
    fragment: fragment,
    exp: time,
    scope: scope,
  }
}

function createToken(options: IOrgJwtTokenOptions) {
  let priv
  try {
    priv = JWK.asKey(
      options.priv,
      {
        alg: options.alg,
        use: 'sig',
      }
    )
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, 'Could not generate JWT token.', err)
  }

  let token: string
  try {
    token = JWT.sign(
      {
        ...(options.scope ? { scope: options.scope } : {})
      },
      priv,
      {
        audience: options.aud,
        ...(options.iss ? { issuer: `${options.iss}${options.fragment ? '#' + options.fragment : ''}` } : {}),
        expiresIn: options.exp,
        kid: false,
        header: { typ: 'JWT' }
      }
    )
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, 'Could not generate JWT token.', err)
  }

  return token
}

function generateOrgIdJwt(privPem: string, originOrgId: string, recipientOrgId: string, fragment: string): string {
  const _privPem = `-----BEGIN EC PRIVATE KEY-----\n${privPem}\n-----END EC PRIVATE KEY-----`
  const options = genOptions(_privPem, originOrgId, recipientOrgId, fragment)

  return createToken(options)
}

export {
  generateOrgIdJwt,
}
