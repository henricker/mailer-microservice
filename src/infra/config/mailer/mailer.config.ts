import SMTPTransport from 'nodemailer/lib/smtp-transport'

export const mailerOptions: SMTPTransport.Options = {
  host: 'smtp.mailtrap.io',
  port: 587,
  secure: false,
  auth: {
    user: '331ecbcca43b57',
    pass: '553bbf325c4600',
  },
}

