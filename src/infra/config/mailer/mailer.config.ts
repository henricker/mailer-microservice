import SMTPTransport from 'nodemailer/lib/smtp-transport'
import env from '../../../../env'

export const mailerOptions: SMTPTransport.Options = {
  host: env.ENV_MAILER_HOST,
  port: Number(env.ENV_MAILER_PORT),
  secure: Boolean(env.ENV_MAILER_SECURE),
  auth: {
    user: env.ENV_MAILER_AUTH_PASS,
    pass: env.ENV_MAILER_AUTH_PASS,
  },
}

