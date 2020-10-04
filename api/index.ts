import { NowRequest, NowResponse } from '@vercel/node'

import { API_HOST_URL } from './tools/constants'

export default (request: NowRequest, response: NowResponse) => {
  console.log('API_HOST_URL = ', API_HOST_URL)

  response.redirect(307, `https://${API_HOST_URL}/api/doc`)
}
