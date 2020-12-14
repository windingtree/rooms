import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

import { v4 as uuidv4 } from 'uuid'
import { NowRequest } from '@vercel/node'

import { createRequestObject } from '../../../_tests/_tools'
import { IRequestBody } from '../../../_tests/_types'

import { CError } from '../../../_lib/tools'
import { postRoomTypePayloadValidator as sut } from '../../../_lib/validators/RoomType'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('validators :: RoomType :: postRoomTypePayloadValidator', () => {
  let request: NowRequest
  let requestBody: IRequestBody

  beforeEach(() => {
    requestBody = {
      hotelId: '',
      type: '',
    }

    request = createRequestObject(requestBody)
  })

  describe('check of "type" property in body', () => {
    describe('should throw if value is', () => {
      it('undefined', async () => {
        requestBody.type = undefined

        await expect(sut(request)).to.be.rejected

        try {
          await sut(request)
        } catch (err) {
          expect(err).to.deep.equal(
            new CError(BAD_REQUEST, `Property 'type' is required. It must have a value of type 'string'.`)
          )
        }
      })

      it('null', async () => {
        requestBody.type = null

        await expect(sut(request)).to.be.rejected

        try {
          await sut(request)
        } catch (err) {
          expect(err).to.deep.equal(
            new CError(BAD_REQUEST, `Property 'type' is required. It must have a value of type 'string'.`)
          )
        }
      })

      it('number', async () => {
        requestBody.type = 42

        await expect(sut(request)).to.be.rejected

        try {
          await sut(request)
        } catch (err) {
          expect(err).to.deep.equal(
            new CError(BAD_REQUEST, `Property 'type' is required. It must have a value of type 'string'.`)
          )
        }
      })

      it('object', async () => {
        requestBody.type = { a: 'a' }

        await expect(sut(request)).to.be.rejected

        try {
          await sut(request)
        } catch (err) {
          expect(err).to.deep.equal(
            new CError(BAD_REQUEST, `Property 'type' is required. It must have a value of type 'string'.`)
          )
        }
      })

      it('function', async () => {
        requestBody.type = () => 42

        await expect(sut(request)).to.be.rejected

        try {
          await sut(request)
        } catch (err) {
          expect(err).to.deep.equal(
            new CError(BAD_REQUEST, `Property 'type' is required. It must have a value of type 'string'.`)
          )
        }
      })
    })

    describe('should pass', () => {
      it('if a proper value is provided', async () => {
        const value = uuidv4()
        requestBody.type = value

        const payload = await sut(request)

        expect(payload.type).to.equal(value)
      })
    })
  })

  describe('check of "hotelId" property in body', () => {
    describe('should throw if value is', () => {
      it('undefined', async () => {
        requestBody.hotelId = undefined

        await expect(sut(request)).to.be.rejected

        try {
          await sut(request)
        } catch (err) {
          expect(err).to.deep.equal(
            new CError(BAD_REQUEST, `Property 'hotelId' is required. It must have a value of type 'string'.`)
          )
        }
      })

      it('null', async () => {
        requestBody.hotelId = null

        await expect(sut(request)).to.be.rejected

        try {
          await sut(request)
        } catch (err) {
          expect(err).to.deep.equal(
            new CError(BAD_REQUEST, `Property 'hotelId' is required. It must have a value of type 'string'.`)
          )
        }
      })

      it('number', async () => {
        requestBody.hotelId = 42

        await expect(sut(request)).to.be.rejected

        try {
          await sut(request)
        } catch (err) {
          expect(err).to.deep.equal(
            new CError(BAD_REQUEST, `Property 'hotelId' is required. It must have a value of type 'string'.`)
          )
        }
      })

      it('object', async () => {
        requestBody.hotelId = { a: 'a' }

        await expect(sut(request)).to.be.rejected

        try {
          await sut(request)
        } catch (err) {
          expect(err).to.deep.equal(
            new CError(BAD_REQUEST, `Property 'hotelId' is required. It must have a value of type 'string'.`)
          )
        }
      })

      it('function', async () => {
        requestBody.hotelId = () => 42

        await expect(sut(request)).to.be.rejected

        try {
          await sut(request)
        } catch (err) {
          expect(err).to.deep.equal(
            new CError(BAD_REQUEST, `Property 'hotelId' is required. It must have a value of type 'string'.`)
          )
        }
      })
    })

    describe('should pass', () => {
      it('if a proper value is provided', async () => {
        const value = uuidv4()
        requestBody.hotelId = value

        const payload = await sut(request)

        expect(payload.hotelId).to.equal(value)
      })
    })
  })

  describe('check of other non-required properties', () => {
    it('should not set them on payload object if they are undefined', async () => {
      const payload = await sut(request)

      expect(payload.quantity).to.equal(undefined)
      expect(payload.price).to.equal(undefined)
      expect(payload.amenities).to.equal(undefined)
      expect(payload.imageUrl).to.equal(undefined)
    })

    it('should throw if unsupported non-required property is provided', async () => {
      const nonSupportedProperty = uuidv4()
      requestBody[nonSupportedProperty] = uuidv4()

      await expect(sut(request)).to.be.rejected

      try {
        await sut(request)
      } catch (err) {
        expect(err).to.deep.equal(
          new CError(BAD_REQUEST, `Property '${nonSupportedProperty}' on 'roomType' is not settable.`)
        )
      }
    })

    describe('check of "quantity" property in body', () => {
      describe('should throw if value is', () => {
        it('null', async () => {
          requestBody.quantity = null

          await expect(sut(request)).to.be.rejected

          try {
            await sut(request)
          } catch (err) {
            expect(err).to.deep.equal(
              new CError(BAD_REQUEST, `Property 'quantity' is optional. If provided, it must have a value of type 'number'.`)
            )
          }
        })

        it('string', async () => {
          requestBody.quantity = '42'

          await expect(sut(request)).to.be.rejected

          try {
            await sut(request)
          } catch (err) {
            expect(err).to.deep.equal(
              new CError(BAD_REQUEST, `Property 'quantity' is optional. If provided, it must have a value of type 'number'.`)
            )
          }
        })

        it('object', async () => {
          requestBody.quantity = { a: 'a' }

          await expect(sut(request)).to.be.rejected

          try {
            await sut(request)
          } catch (err) {
            expect(err).to.deep.equal(
              new CError(BAD_REQUEST, `Property 'quantity' is optional. If provided, it must have a value of type 'number'.`)
            )
          }
        })

        it('function', async () => {
          requestBody.quantity = () => 42

          await expect(sut(request)).to.be.rejected

          try {
            await sut(request)
          } catch (err) {
            expect(err).to.deep.equal(
              new CError(BAD_REQUEST, `Property 'quantity' is optional. If provided, it must have a value of type 'number'.`)
            )
          }
        })
      })

      describe('should pass', () => {
        it('if a proper value is provided', async () => {
          const value = Math.random()
          requestBody.quantity = value

          const payload = await sut(request)

          expect(payload.quantity).to.equal(value)
        })
      })
    })

    describe('check of "price" property in body', () => {
      describe('should throw if value is', () => {
        it('null', async () => {
          requestBody.price = null

          await expect(sut(request)).to.be.rejected

          try {
            await sut(request)
          } catch (err) {
            expect(err).to.deep.equal(
              new CError(BAD_REQUEST, `Property 'price' is optional. If provided, it must have a value of type 'number'.`)
            )
          }
        })

        it('string', async () => {
          requestBody.price = '42'

          await expect(sut(request)).to.be.rejected

          try {
            await sut(request)
          } catch (err) {
            expect(err).to.deep.equal(
              new CError(BAD_REQUEST, `Property 'price' is optional. If provided, it must have a value of type 'number'.`)
            )
          }
        })

        it('object', async () => {
          requestBody.price = { a: 'a' }

          await expect(sut(request)).to.be.rejected

          try {
            await sut(request)
          } catch (err) {
            expect(err).to.deep.equal(
              new CError(BAD_REQUEST, `Property 'price' is optional. If provided, it must have a value of type 'number'.`)
            )
          }
        })

        it('function', async () => {
          requestBody.price = () => 42

          await expect(sut(request)).to.be.rejected

          try {
            await sut(request)
          } catch (err) {
            expect(err).to.deep.equal(
              new CError(BAD_REQUEST, `Property 'price' is optional. If provided, it must have a value of type 'number'.`)
            )
          }
        })
      })

      describe('should pass', () => {
        it('if a proper value is provided', async () => {
          const value = Math.random()
          requestBody.price = value

          const payload = await sut(request)

          expect(payload.price).to.equal(value)
        })
      })
    })

    describe('check of "amenities" property in body', () => {
      describe('should throw if value is', () => {
        it('null', async () => {
          requestBody.amenities = null

          await expect(sut(request)).to.be.rejected

          try {
            await sut(request)
          } catch (err) {
            expect(err).to.deep.equal(
              new CError(BAD_REQUEST, `Property 'amenities' is optional. If provided, it must have a value of type 'string'.`)
            )
          }
        })

        it('number', async () => {
          requestBody.amenities = 42

          await expect(sut(request)).to.be.rejected

          try {
            await sut(request)
          } catch (err) {
            expect(err).to.deep.equal(
              new CError(BAD_REQUEST, `Property 'amenities' is optional. If provided, it must have a value of type 'string'.`)
            )
          }
        })

        it('object', async () => {
          requestBody.amenities = { a: 'a' }

          await expect(sut(request)).to.be.rejected

          try {
            await sut(request)
          } catch (err) {
            expect(err).to.deep.equal(
              new CError(BAD_REQUEST, `Property 'amenities' is optional. If provided, it must have a value of type 'string'.`)
            )
          }
        })

        it('function', async () => {
          requestBody.amenities = () => 42

          await expect(sut(request)).to.be.rejected

          try {
            await sut(request)
          } catch (err) {
            expect(err).to.deep.equal(
              new CError(BAD_REQUEST, `Property 'amenities' is optional. If provided, it must have a value of type 'string'.`)
            )
          }
        })
      })

      describe('should pass', () => {
        it('if a proper value is provided', async () => {
          const value = uuidv4()
          requestBody.amenities = value

          const payload = await sut(request)

          expect(payload.amenities).to.equal(value)
        })
      })
    })

    describe('check of "imageUrl" property in body', () => {
      describe('should throw if value is', () => {
        it('null', async () => {
          requestBody.imageUrl = null

          await expect(sut(request)).to.be.rejected

          try {
            await sut(request)
          } catch (err) {
            expect(err).to.deep.equal(
              new CError(BAD_REQUEST, `Property 'imageUrl' is optional. If provided, it must have a value of type 'string'.`)
            )
          }
        })

        it('number', async () => {
          requestBody.imageUrl = 42

          await expect(sut(request)).to.be.rejected

          try {
            await sut(request)
          } catch (err) {
            expect(err).to.deep.equal(
              new CError(BAD_REQUEST, `Property 'imageUrl' is optional. If provided, it must have a value of type 'string'.`)
            )
          }
        })

        it('object', async () => {
          requestBody.imageUrl = { a: 'a' }

          await expect(sut(request)).to.be.rejected

          try {
            await sut(request)
          } catch (err) {
            expect(err).to.deep.equal(
              new CError(BAD_REQUEST, `Property 'imageUrl' is optional. If provided, it must have a value of type 'string'.`)
            )
          }
        })

        it('function', async () => {
          requestBody.imageUrl = () => 42

          await expect(sut(request)).to.be.rejected

          try {
            await sut(request)
          } catch (err) {
            expect(err).to.deep.equal(
              new CError(BAD_REQUEST, `Property 'imageUrl' is optional. If provided, it must have a value of type 'string'.`)
            )
          }
        })
      })

      describe('should pass', () => {
        it('if a proper value is provided', async () => {
          const value = uuidv4()
          requestBody.imageUrl = value

          const payload = await sut(request)

          expect(payload.imageUrl).to.equal(value)
        })
      })
    })
  })
})
