import sgMail from '@sendgrid/mail'

import { CError } from '../../_lib/tools'
import { AppConfig } from '../../_lib/infra/config'
import { CONSTANTS } from '../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR, BAD_GATEWAY } = CONSTANTS.HTTP_STATUS

async function emailNewBooking(did: string, bookingId: string, email: string): Promise<void> {
  const appConfig = await AppConfig.getInstance().getConfig()

  try {
    sgMail.setApiKey(appConfig.SENDGRID_API_KEY)
  } catch (err) {
    throw new CError(INTERNAL_SERVER_ERROR, `Could not set Send Grid API key '${appConfig.SENDGRID_API_KEY}'.`)
  }

  const msg = {
    to: email,
    from: 'Rooms booking <auth@em.windingtree.com>',
    subject: `Booking ${bookingId} created`,
    text: `Organization with DID "${did}" just successfully created a booking in Rooms project. Booking ID is "${bookingId}".`,
    html: `` +
      `<p>` +
        `Organization with DID "${did}" just successfully created a booking in Rooms project. Booking ID is "${bookingId}".` +
      `</p>`,
  }

  try {
    await sgMail.send(msg)
  } catch (err) {
    throw new CError(BAD_GATEWAY, `Could not send booking confirmation to ${email}.`)
  }
}

export {
  emailNewBooking,
}
