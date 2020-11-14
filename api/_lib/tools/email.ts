import sgMail from '@sendgrid/mail'

import { CError } from '../tools'
import { AppConfig } from '../infra/config'

async function emailOneTimePassword(email: string, oneTimePassword: string): Promise<void> {
  const appConfig = await AppConfig.getInstance().getConfig()

  try {
    sgMail.setApiKey(appConfig.SENDGRID_API_KEY)
  } catch (err) {
    throw new CError(500, `Could not set Send Grid API key '${appConfig.SENDGRID_API_KEY}'.`)
  }

  const link = `${appConfig.SENDGRID_CALLBACK_URL}/${oneTimePassword}`

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
