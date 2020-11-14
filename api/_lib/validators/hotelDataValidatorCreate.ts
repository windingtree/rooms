import { NowRequest } from '@vercel/node'

import { CError } from '../tools'
import { IBaseHotel } from '../types'

async function hotelDataValidatorCreate(request: NowRequest): Promise<IBaseHotel> {
  if (!request.body) {
    throw new CError(500, 'Must provide a valid body with request.')
  }

  const createHotelData: IBaseHotel = {
    ownerId: '',
    name: '',
    address: '',
    location: {
      lat: 0,
      lng: 0,
    },
  }

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
    createHotelData.ownerId = request.body.ownerId
  } else {
    throw new CError(500, 'Property \'ownerId\' must have a value of type \'string\'.')
  }

  if (typeof request.body.name === 'string') {
    createHotelData.name = request.body.name
  } else {
    throw new CError(500, 'Property \'name\' must have a value of type \'string\'.')
  }

  if (typeof request.body.address === 'string') {
    createHotelData.address = request.body.address
  } else {
    throw new CError(500, 'Property \'address\' must have a value of type \'string\'.')
  }

  if (typeof request.body.location === 'object' && request.body.location !== null) {
    createHotelData.location = { lat: 0, lng: 0 }

    if (typeof request.body.location.lat === 'number') {
      createHotelData.location.lat = request.body.location.lat
    } else {
      throw new CError(500, 'Property \'location.lat\' must have a value of type \'number\'.')
    }

    if (typeof request.body.location.lng === 'number') {
      createHotelData.location.lng = request.body.location.lng
    } else {
      throw new CError(500, 'Property \'location.lng\' must have a value of type \'number\'.')
    }
  } else {
    throw new CError(500, 'Property \'location\' must have a value of type \'object\'.')
  }

  return createHotelData
}

export {
  hotelDataValidatorCreate,
}
