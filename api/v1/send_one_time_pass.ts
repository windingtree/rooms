import { NowRequest, NowResponse } from '@vercel/node'
import { v4 as uuidv4 } from 'uuid'
import sgMail from '@sendgrid/mail'
import { ObjectID } from 'mongodb'

import { genericApiMethodHandler, DB } from '../tools'
import { SENDGRID_API_KEY } from '../constants'

async function sendMail(email: string, oneTimePassword: string): Promise<void> {
  try {
    sgMail.setApiKey(SENDGRID_API_KEY)
  } catch (err) {
    throw `Could not set Send Grid API key '${SENDGRID_API_KEY}'.`
  }

  const msg = {
    to: email,
    from: 'Rooms auth <auth@em.windingtree.com>',
    subject: 'One time password for rooms app',
    text: `Please use ${oneTimePassword}`,
    html: `Please use <strong>${oneTimePassword}</strong>`,
  }

  try {
    await sgMail.send(msg)
  } catch (err) {
    throw `Could not send one time password to ${email}.`
  }
}

async function updateOneTimePassword(id: string): Promise<string> {
  const dbClient = await DB.getInstance().getDbClient()
  if (dbClient === null) {
    throw 'Could not connect to the database.'
  }

  const oneTimePassword = uuidv4()
  let result
  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('owners')

    const filter = { _id: new ObjectID(id) }
    const options = { upsert: false }
    const updateDoc = {
      $set: Object.assign({}, { oneTimePassword })
    }

    result = await collection.updateOne(filter, updateDoc, options)
  } catch (err) {
    throw 'An error occurred while updating an owner.'
  }

  if (!result || !result.matchedCount) {
    throw `Could not find an owner to update with ID '${id}'.`
  }

  return oneTimePassword
}

async function POST(request: NowRequest, response: NowResponse): Promise<void> {
  if (!request.body) {
    response.status(500).json({ err: 'request must contain a valid body object' })
    return
  }

  const emailProp = request.body.email
  if (!emailProp || typeof emailProp !== 'string' || emailProp.length === 0) {
    response.status(500).json({ err: 'owner email not specified' })
    return
  }
  const email: string = (emailProp as string)

  const dbClient = await DB.getInstance().getDbClient()
  if (dbClient === null) {
    response.status(500).json({ err: 'Could not connect to the database.' })
    return
  }

  let oneTimePassword: string
  try {
    const database = dbClient.db('rooms-staging')
    const collection = database.collection('owners')

    const query = { email }
    const options = {
      sort: { rating: -1 },
      projection: { _id: 1, email: 1, oneTimePassword: 1 },
    }

    const ownerRecord = await collection.findOne(query, options)

    if (!ownerRecord) {
      oneTimePassword = uuidv4()

      const newOwner = { email, oneTimePassword }
      const result = await collection.insertOne(newOwner)

      if (!result) {
        throw 'An error occurred while creating a new owner.'
      }
    } else {
      oneTimePassword = await updateOneTimePassword(ownerRecord._id)
    }
  } catch (err) {
    response.status(500).json({ err })
    return
  }

  try {
    await sendMail(email, oneTimePassword)
  } catch (err) {
    response.status(500).json({ err })
    return
  }

  response.status(200).json({ email: email, oneTimePassword: 'sent' })
}

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  await genericApiMethodHandler(request, response, { POST })
}
