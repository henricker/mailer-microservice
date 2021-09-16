import { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import BaseMailer from "../../../infra/mailer/basemailer";
import IPayloadMailer from "../interfaces/IPayloadMailer";
import HandlebarsCompilerService from "../../../infra/handlebars/handlebars";

export default class ForgotPasswordUserMailer extends BaseMailer {
  constructor(authConfig: SMTPTransport.Options, private payload: IPayloadMailer) {    
    super(authConfig)
  }

  async prepare(transporter: Transporter): Promise<void> {

    const hbs = new HandlebarsCompilerService('forgot-password')
    const html = await hbs.compile({
      name: this.payload.contact.name,
      token: this.payload.contact.remember_me_token
    })

    await transporter.sendMail({
      from: 'TGL BETS 🍀 <tgl@suport.com>',
      to: this.payload.contact.email,
      subject: 'Forgot password',
      html
    })
  }
}