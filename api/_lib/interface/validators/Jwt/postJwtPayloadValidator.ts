// node/npm imports
import { NowRequest } from '@vercel/node'

// interface layer imports
import { validateRequiredString } from '../../validators/_helpers'

// common imports
import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'
import { IProfileAuthData } from '../../../common/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function postJwtPayloadValidator(request: NowRequest): Promise<IProfileAuthData> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
  }

  const payload: IProfileAuthData = {
    email: '',
    sessionToken: '',
    oneTimePassword: '',
  }

  const ALLOWED_PROPS: Array<keyof IProfileAuthData> = [
    'email',
    'sessionToken',
    'oneTimePassword',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key as keyof IProfileAuthData)) {
      throw new CError(BAD_REQUEST, `Property '${key}' in POST 'login' request is unexpected.`)
    }
  }

  const email = request.body.email
  await validateRequiredString('email', email)
  payload.email = email

  const sessionToken = request.body.sessionToken
  await validateRequiredString('sessionToken', sessionToken)
  payload.sessionToken = sessionToken

  const oneTimePassword = request.body.oneTimePassword
  await validateRequiredString('oneTimePassword', oneTimePassword)
  payload.oneTimePassword = oneTimePassword

  return payload
}

export { postJwtPayloadValidator }
