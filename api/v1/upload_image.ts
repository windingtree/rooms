import { NowRequest, NowResponse } from '@vercel/node'

import { genericApiMethodHandler, authorizeRequest } from '../_lib/interface'
import { postUploadImagePayloadValidator } from '../_lib/interface/validators'

import { authenticateClientAppRequest } from '../_lib/app/auth/client_app'
import { uploadImageToS3 } from '../_lib/app/upload_image'

import { IProfile, IUploadImage, IPostUploadImagePayload } from '../_lib/common/types'

async function POST(request: NowRequest): Promise<IUploadImage> {
  const requester: IProfile = await authenticateClientAppRequest(request)

  await authorizeRequest(requester.role, { method: 'POST', route: 'upload_image' })

  const payload: IPostUploadImagePayload = await postUploadImagePayloadValidator(request)

  return await uploadImageToS3(requester, payload)
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
