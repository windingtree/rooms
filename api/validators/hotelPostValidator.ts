import { NowRequest } from '@vercel/node'

import { disableApiRequestsHere, CError } from '../tools'
import { IHotelPostData, IHotelPostDataLocation } from '../types'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function hotelPostValidator(request: NowRequest): Promise<IHotelPostData> {
  if (!request.body) {
    throw new CError(500, 'must provide a valid body with request')
  }

  if (
    (typeof request.body.name !== 'string')
  ) {
    throw new CError(500, 'Must provide a valid "name" value. It should be of type "string".')
  }

  if (
    (typeof request.body.address !== 'string')
  ) {
    throw new CError(500, 'Must provide a valid "address" value. It should be of type "string".')
  }

  if (
    (typeof request.body.location === 'undefined')
  ) {
    throw new CError(500, 'must provide a valid "location" value')
  }

  const name: string = request.body.name
  const address: string = request.body.address
  const location: IHotelPostDataLocation = {
    lat: request.body.location.lat,
    lng: request.body.location.lng,
  }

  const hotelPostData: IHotelPostData = {
    name,
    address,
    location,
  }

  return hotelPostData
}

export {
  hotelPostValidator,
}
