import { NowRequest } from '@vercel/node'

import {
  validateRequiredString,
} from '../../../interface/validators/_helpers'

import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'
import { IPostUploadImagePayload } from '../../../common/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function postUploadImagePayloadValidator(request: NowRequest): Promise<IPostUploadImagePayload> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
  }

  const payload: IPostUploadImagePayload = {
    file: ''
  }

  const ALLOWED_PROPS: Array<keyof IPostUploadImagePayload> = [
    'file',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key as keyof IPostUploadImagePayload)) {
      throw new CError(BAD_REQUEST, `Property '${key}' on 'UploadImage' is not settable.`)
    }
  }

  const file = request.body.file
  await validateRequiredString('file', file)
  payload.file = file

  return payload
}

export { postUploadImagePayloadValidator }
