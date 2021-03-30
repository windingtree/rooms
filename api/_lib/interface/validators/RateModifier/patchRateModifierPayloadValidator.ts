import { NowRequest } from '@vercel/node'

import {
    validateOptionalString,
    validateMongoObjectId,
} from '../_helpers'

import { CONSTANTS } from '../../../common/constants'
import { CError } from '../../../common/tools'
import { IPatchRateModifierPayload } from '../../../common/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function patchRateModifierPayloadValidator(request: NowRequest): Promise<IPatchRateModifierPayload> {
    if (!request.body) {
        throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
    }

    const payload: IPatchRateModifierPayload = {}

    const ALLOWED_PROPS: Array<keyof IPatchRateModifierPayload> = [
        'hotelId',
        'type',
        'description',
        'enabled',
        'priority',
        'criteriaType',
        'priceModifierType',
        'priceModifierAmount',
        'combinable',
        'condition',
        'rooms'
    ]

    for (const [key] of Object.entries(request.body)) {
        if (!ALLOWED_PROPS.includes(key as keyof IPatchRateModifierPayload)) {
            throw new CError(BAD_REQUEST, `Property '${key}' on 'rateModifier' is not updatable.`)
        }
    }

    const hotelId = request.body.hotelId
    await validateMongoObjectId('hotelId', hotelId)
    await validateOptionalString('hotelId', hotelId)
    if (typeof hotelId !== 'undefined') payload.hotelId = hotelId

    const type = request.body.type
    await validateOptionalString('type', type)
    if (typeof type !== 'undefined') payload.type = type

    const description = request.body.description
    await validateOptionalString('description', description)
    if (typeof description !== 'undefined') payload.description = description
    if ('enabled' in request.body) {
      payload.enabled = !!request.body.enabled
    }
    if (request.body.priority) {
        payload.priority = request.body.priority
    }
    if (request.body.criteriaType) {
        payload.criteriaType = request.body.criteriaType
    }
    if (request.body.priceModifierType) {
        payload.priceModifierType = request.body.priceModifierType
    }
    if (request.body.priceModifierAmount) {
        payload.priceModifierAmount = request.body.priceModifierAmount
    }
    if ('combinable' in request.body) {
      payload.combinable = !!request.body.combinable
    }
    if (request.body.condition) {
        payload.condition = request.body.condition;
    }
    if (request.body.rooms) {
        payload.rooms = request.body.rooms;
    }
    return payload
}


export { patchRateModifierPayloadValidator }
