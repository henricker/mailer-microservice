import nodemailer, { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import hbs, { NodemailerExpressHandlebarsOptions } from 'nodemailer-express-handlebars'

export default abstract class BaseMailer {
  protected transporter: Transporter

  constructor(
      private authConfig: SMTPTransport.Options, 
      private compileOptions: NodemailerExpressHandlebarsOptions
    ) {
    this.transporter = nodemailer.createTransport(authConfig)
    this.transporter.use('compile', hbs(compileOptions))
  }

  abstract prepare(mail: Mail.Options): Promise<void>
}