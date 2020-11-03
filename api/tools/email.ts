import sgMail from '@sendgrid/mail'

import { CError, disableApiRequestsHere } from '.'
import { SENDGRID_API_KEY, SENDGRID_CALLBACK_URL } from '../constants'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

async function emailOneTimePassword(email: string, oneTimePassword: string): Promise<void> {
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

export {
  emailOneTimePassword,
}
