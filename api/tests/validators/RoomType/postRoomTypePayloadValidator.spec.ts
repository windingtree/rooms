import 'mocha'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

import { v4 as uuidv4 } from 'uuid'
import { NowRequest } from '@vercel/node'

import { createRequestObject } from '../../_tools'

import { CError } from '../../../_lib/tools'
import { postRoomTypePayloadValidator } from '../../../_lib/validators/RoomType'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('validators :: postRoomTypePayloadValidator', () => {
  let request: NowRequest
  let requestBody: { [key: string]: string|number|null|undefined }

  beforeEach(() => {
    requestBody = {
      hotelId: '',
      type: '',
    }

    request = createRequestObject(requestBody)
  })

  it('missing "type" in body should cause validator to throw', async () => {
    requestBody.type = undefined

    await expect(postRoomTypePayloadValidator(request)).to.be.rejected

    try {
      await postRoomTypePayloadValidator(request)
    } catch (err) {
      expect(err).to.deep.equal(
        new CError(BAD_REQUEST, `Property 'type' is required. It must have a value of type 'string'.`)
      )
    }
  })

  it('payload.type should be set to proper value', async () => {
    const value = uuidv4()
    requestBody.type = value

    const payload = await postRoomTypePayloadValidator(request)

    expect(payload.type).to.equal(value)
  })

  it('missing "hotelId" in body should cause validator to throw', async () => {
    requestBody.hotelId = undefined

    await expect(postRoomTypePayloadValidator(request)).to.be.rejected

    try {
      await postRoomTypePayloadValidator(request)
    } catch (err) {
      expect(err).to.deep.equal(
        new CError(BAD_REQUEST, `Property 'hotelId' is required. It must have a value of type 'string'.`)
      )
    }
  })

  it('payload.hotelId should be set to proper value', async () => {
    const value = uuidv4()
    requestBody.hotelId = value

    const payload = await postRoomTypePayloadValidator(request)

    expect(payload.hotelId).to.equal(value)
  })
})
