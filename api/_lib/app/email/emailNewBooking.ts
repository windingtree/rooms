import sgMail from '@sendgrid/mail'

import { AppConfig } from '../../app/config'

import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'
import {
  IOrgDetailsOrganization,
} from '../../common/types'

const { INTERNAL_SERVER_ERROR, BAD_GATEWAY } = CONSTANTS.HTTP_STATUS

function outlinedHtmlText(text: string): string {
  return `` +
    `<span style="background-color: #F1EE98; border: 1px solid black; font-weight: bold; padding: 0.2em 0.5em;">` +
    `${text}` +
    `</span>`
}

async function emailNewBooking(
  organization: IOrgDetailsOrganization,
  orderId: string,
  reservationNumber: string,
  checkInDate: string,
  checkOutDate: string,
  guestName: string,
  guestEmail: string,
  phoneNumber: string,
  email: string
): Promise<void> {
  const appConfig = await AppConfig.getInstance().getConfig()

  try {
    sgMail.setApiKey(appConfig.SENDGRID_API_KEY)
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, `Could not set Send Grid API key '${appConfig.SENDGRID_API_KEY}'.`, err)
  }

  const text = `
    An organization (DID "${organization.did}", owner "${organization.owner}") created a booking in Rooms project.\n
    Internal Rooms project order ID is "${orderId}".\n
    \n
    Booking details:\n
    - reservation number: "${reservationNumber}"\n
    - check in date: "${checkInDate}"\n
    - check out date: "${checkOutDate}"\n
    - guest name: "${guestName}"\n
    - guest email: "${guestEmail}"\n
    - phone number: "${phoneNumber}"\n
  `
  const html = `
    <p style="line-height: 2em;">
      An organization (DID ${outlinedHtmlText(organization.did)}, owner ${outlinedHtmlText(organization.owner)}) created a booking in Rooms project.
    </p>
    <p style="line-height: 2em;">
      Internal Rooms project order ID is ${outlinedHtmlText(orderId)}.
    </p>
    <br style="line-height: 2em;" />
    <p style="line-height: 2em;">
      Booking details:
    </p>
    <ul style="line-height: 2em;">
      <li style="margin: 0.8em 0; line-height: 2em;">reservation number: ${outlinedHtmlText(reservationNumber)}</li>
      <li style="margin: 0.8em 0; line-height: 2em;">check in date: ${outlinedHtmlText(checkInDate)}</li>
      <li style="margin: 0.8em 0; line-height: 2em;">check out date: ${outlinedHtmlText(checkOutDate)}</li>
      <li style="margin: 0.8em 0; line-height: 2em;">guest name: ${outlinedHtmlText(guestName)}</li>
      <li style="margin: 0.8em 0; line-height: 2em;">guest email: ${outlinedHtmlText(guestEmail)}</li>
      <li style="margin: 0.8em 0; line-height: 2em;">phone number: ${outlinedHtmlText(phoneNumber)}</li>
    </ul>
  `

  const msg = {
    to: email,
    from: 'Rooms project <auth@em.windingtree.com>',
    subject: `Reservation ${reservationNumber} was created in Rooms project`,
    text,
    html,
  }

  try {
    await sgMail.send(msg)
  } catch (err: unknown) {
    throw new CError(BAD_GATEWAY, `Could not send booking confirmation to ${email}.`, err)
  }
}

export { emailNewBooking }
