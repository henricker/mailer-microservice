import SMTPTransport from 'nodemailer/lib/smtp-transport'
import env from '../../../../env'

export const mailerOptions: SMTPTransport.Options = {
  host: env.ENV_MAILER_HOST,
  port: Number(env.ENV_MAILER_PORT),
  secure: false,
  auth: {
    user: env.ENV_MAILER_AUTH_USER,
    pass: env.ENV_MAILER_AUTH_PASS,
  },
}

