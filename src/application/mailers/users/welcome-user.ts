import { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import BaseMailer from "../../../infra/mailer/basemailer";
import IPayloadMailer from "../interfaces/IPayloadMailer";
import HandlebarsCompilerService from "../../handlebars/handlebars";

export default class WelcomeUserMailer extends BaseMailer {
  constructor(authConfig: SMTPTransport.Options, private payload: IPayloadMailer) {    
    super(authConfig)
  }

  async prepare(transporter: Transporter): Promise<void> {
    const hbs = new HandlebarsCompilerService('remember-user-to-bet.hbs')
    const html = await hbs.compile({
      name: this.payload.contact.name
    })

    await transporter.sendMail({
      from: 'TGL BETS 🍀 <tgl@suport.com>',
      to: this.payload.contact.email,
      subject: 'Welcome to TGL BETS!',
      html
    })
  }
}