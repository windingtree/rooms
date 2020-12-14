import sgMail from '@sendgrid/mail'

import { CError } from '../../_lib/tools'
import { AppConfig } from '../../_lib/infra/config'
import { CONSTANTS } from '../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR, BAD_GATEWAY } = CONSTANTS.HTTP_STATUS

async function emailOneTimePassword(email: string, oneTimePassword: string): Promise<void> {
  const appConfig = await AppConfig.getInstance().getConfig()

  try {
    sgMail.setApiKey(appConfig.SENDGRID_API_KEY)
  } catch (err: unknown) {
    throw new CError(INTERNAL_SERVER_ERROR, `Could not set Send Grid API key '${appConfig.SENDGRID_API_KEY}'.`, err)
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
  } catch (err: unknown) {
    throw new CError(BAD_GATEWAY, `Could not send one time password to ${email}.`, err)
  }
}

export {
  emailOneTimePassword,
}
