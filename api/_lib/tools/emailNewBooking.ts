import sgMail from '@sendgrid/mail'

import { CError } from '../../_lib/tools'
import { AppConfig } from '../../_lib/infra/config'
import { CONSTANTS } from '../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR, BAD_GATEWAY } = CONSTANTS.HTTP_STATUS

async function emailNewBooking(did: string, orderId: string, email: string): Promise<void> {
  const appConfig = await AppConfig.getInstance().getConfig()

  try {
    sgMail.setApiKey(appConfig.SENDGRID_API_KEY)
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, `Could not set Send Grid API key '${appConfig.SENDGRID_API_KEY}'.`, err)
  }

  const msg = {
    to: email,
    from: 'Rooms booking <auth@em.windingtree.com>',
    subject: `Your booking in Rooms project was created`,
    text: `Organization with DID "${did}" just successfully created a booking for you in Rooms project. Order ID is "${orderId}".`,
    html: `` +
      `<p>` +
        `Organization with DID "${did}" just successfully created a booking for you in Rooms project. Order ID is "${orderId}".` +
      `</p>`,
  }

  try {
    await sgMail.send(msg)
  } catch (err: unknown) {
    throw new CError(BAD_GATEWAY, `Could not send booking confirmation to ${email}.`, err)
  }
}

export {
  emailNewBooking,
}
