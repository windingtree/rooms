import { NowRequest, NowResponse } from '@vercel/node'
import { v4 as uuidv4 } from 'uuid'
import sgMail from '@sendgrid/mail'
import { ObjectID } from 'mongodb'

import { genericApiMethodHandler, DB, CError, errorHandler } from '../tools'
import { checkSendOneTimePass } from '../validators'
import { SENDGRID_API_KEY, SENDGRID_CALLBACK_URL, ROOMS_DB_NAME } from '../constants'

async function sendMail(email: string, oneTimePassword: string): Promise<void> {
  try {
    sgMail.setApiKey(SENDGRID_API_KEY)
  } catch (err) {
    throw new CError(500, `Could not set Send Grid API key '${SENDGRID_API_KEY}'.`)
  }

  const link = `${SENDGRID_CALLBACK_URL}/${oneTimePassword}`

  const msg = {
    to: email,
    from: 'Rooms auth <auth@em.windingtree.com>',
    subject: 'One time password for rooms app',
    text: `Please use "${oneTimePassword}", or click the following link ${link}.`,
    html: `` +
      `<p>Please use:</p>` +
      `<strong>${oneTimePassword}</strong>` +
      `<p>` +
        `or click the following link ` +
        `<a href="${link}">${link}</a>.` +
      `</p>`,
  }

  try {
    await sgMail.send(msg)
  } catch (err) {
    throw new CError(502, `Could not send one time password to ${email}.`)
  }
}

async function updateOneTimePassword(id: string, sessionToken: string): Promise<string> {
  const dbClient = await DB.getInstance().getDbClient()

  const oneTimePassword = uuidv4()
  let result
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection('owners')

    const filter = { _id: new ObjectID(id) }
    const options = { upsert: false }
    const updateDoc = {
      $set: Object.assign({}, { oneTimePassword, sessionToken })
    }

    result = await collection.updateOne(filter, updateDoc, options)
  } catch (err) {
    throw new CError(500, 'An error occurred while updating an owner.')
  }

  if (!result || !result.matchedCount) {
    throw new CError(500, `Could not find an owner to update with ID '${id}'.`)
  }

  return oneTimePassword
}

async function getOneTimePassword(email: string, sessionToken: string): Promise<string> {
  const dbClient = await DB.getInstance().getDbClient()

  let oneTimePassword: string
  let ownerRecord
  try {
    const database = dbClient.db(ROOMS_DB_NAME)
    const collection = database.collection('owners')

    const query = { email }
    const options = {
      projection: { _id: 1, email: 1 },
    }

    ownerRecord = await collection.findOne(query, options)
  } catch (err) {
    throw new CError(500, 'Could not get an owner record.')
  }

  if (!ownerRecord) {
    oneTimePassword = uuidv4()

    const newOwner = { email, oneTimePassword, sessionToken }

    let result
    try {
      const database = dbClient.db(ROOMS_DB_NAME)
      const collection = database.collection('owners')

      result = await collection.insertOne(newOwner)
    } catch (err) {
      throw new CError(500, 'An error occurred while creating a new owner.')
    }

    if (!result) {
      throw new CError(500, 'An error occurred while creating a new owner.')
    }
  } else {
    oneTimePassword = await updateOneTimePassword(ownerRecord._id, sessionToken)
  }

  return oneTimePassword
}

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  try {
    checkSendOneTimePass(request)
  } catch (err) {
    return errorHandler(response, err)
  }

  const email: string = request.body.email
  const sessionToken: string = request.body.sessionToken

  let oneTimePassword: string
  try {
    oneTimePassword = await getOneTimePassword(email, sessionToken)
  } catch (err) {
    return errorHandler(response, err)
  }

  try {
    await sendMail(email, oneTimePassword)
  } catch (err) {
    return errorHandler(response, err)
  }

  response.status(200).json({ email: email, oneTimePassword: 'sent' })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
