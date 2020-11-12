import { NowRequest } from '@vercel/node'

import { CError } from '../tools'
import { IUpdateHotelData } from '../types'

async function hotelDataValidatorUpdate(request: NowRequest): Promise<IUpdateHotelData> {
  if (!request.body) {
    throw new CError(500, 'Must provide a valid body with request.')
  }

  const updateHotelData: IUpdateHotelData = {}

  const ALLOWED_PROPS = [
    'ownerId',
    'name',
    'address',
    'location',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key)) {
      throw new CError(500, `Property '${key}' on 'hotel' is not updatable.`)
    }
  }

  if (typeof request.body.ownerId === 'string') {
    updateHotelData.ownerId = request.body.ownerId
  } else if (typeof request.body.ownerId !== 'undefined') {
    throw new CError(500, 'Property \'ownerId\' must have a value of type \'string\'.')
  }

  if (typeof request.body.name === 'string') {
    updateHotelData.name = request.body.name
  } else if (typeof request.body.name !== 'undefined') {
    throw new CError(500, 'Property \'name\' must have a value of type \'string\'.')
  }

  if (typeof request.body.address === 'string') {
    updateHotelData.address = request.body.address
  } else if (typeof request.body.address !== 'undefined') {
    throw new CError(500, 'Property \'address\' must have a value of type \'string\'.')
  }

  if (typeof request.body.location === 'object' && request.body.location !== null) {
    updateHotelData.location = { lat: 0, lng: 0 }

    if (typeof request.body.location.lat === 'number') {
      updateHotelData.location.lat = request.body.location.lat
    } else {
      throw new CError(500, 'Property \'location.lat\' must have a value of type \'number\'.')
    }

    if (typeof request.body.location.lng === 'number') {
      updateHotelData.location.lng = request.body.location.lng
    } else {
      throw new CError(500, 'Property \'location.lng\' must have a value of type \'number\'.')
    }
  } else if (typeof request.body.location !== 'undefined') {
    throw new CError(500, 'Property \'location\' must have a value of type \'object\'.')
  }

  return updateHotelData
}

export {
  hotelDataValidatorUpdate,
}
