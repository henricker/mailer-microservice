import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import hbs from 'nodemailer-express-handlebars'
import { resolve } from 'path';

export default abstract class BaseMailer {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>

  constructor(private authConfig: SMTPTransport.Options) {
    this.transporter = createTransport(authConfig)
    this.transporter.use('compile', hbs({
      viewEngine: {
        extname: '.hbs',
      },
      viewPath: resolve(__dirname, '..', 'application', 'resources', 'views', 'mails')
    }))
  }

  protected abstract prepare(transporter: Transporter): Promise<void>

  async send() {
    await this.prepare(this.transporter)
  }
}