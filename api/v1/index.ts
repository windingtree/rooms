import { NowRequest, NowResponse } from '@vercel/node'

const API_HOST_URL = process.env.API_HOST_URL

export default (request: NowRequest, response: NowResponse) => {
  response.redirect(307, `https://${API_HOST_URL}/api/doc`)
}
