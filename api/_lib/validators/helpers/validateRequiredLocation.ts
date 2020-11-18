import { CError } from '../../tools'
import { IHotelLocation } from '../../types'

async function validateRequiredLocation(propName: string, _value: unknown): Promise<IHotelLocation> {
  let value: IHotelLocation

  if (typeof _value === 'object' && _value !== null) {
    value = { lat: 0, lng: 0 }

    if (typeof (_value as IHotelLocation).lat === 'number') {
      value.lat = (_value as IHotelLocation).lat
    } else {
      throw new CError(
        500,
        `Property '${propName}.lat' is required. It must have a value of type 'number'.`
      )
    }

    if (typeof (_value as IHotelLocation).lng === 'number') {
      value.lng = (_value as IHotelLocation).lng
    } else {
      throw new CError(
        500,
        `Property '${propName}.lng' is required. It must have a value of type 'number'.`
      )
    }
  } else {
    throw new CError(500, `Property '${propName}' is required. It must have a value of type 'object'.`)
  }

  return value
}

export {
  validateRequiredLocation,
}
