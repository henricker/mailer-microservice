import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default abstract class BaseMailer {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>

  constructor(private authConfig: SMTPTransport.Options) {
    this.transporter = createTransport(authConfig)
  }

  protected abstract prepare(transporter: Transporter): Promise<void>

  async send() {
    await this.prepare(this.transporter)
  }
}