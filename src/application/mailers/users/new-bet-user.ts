import { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import BaseMailer from "../../../infra/mailer/base-mailer";
import IPayloadMailer from "../interfaces/IPayloadMailer";
import HandlebarsCompilerService from "../../../infra/handlebars/handlebars";

export default class NewBetUserMailer extends BaseMailer {
  constructor(authConfig: SMTPTransport.Options, private payload: IPayloadMailer) {    
    super(authConfig)
  }

  async prepare(transporter: Transporter): Promise<void> {
    const hbs = new HandlebarsCompilerService('new-bet-user')
    const html = await hbs.compile({
      name: this.payload.contact.name,
      bets: this.payload.bets!.arrayBets,
      totalPrice: this.payload.bets?.totalPrice
    })

    await transporter.sendMail({
      from: 'TGL BETS 🍀 <tgl@suport.com>',
      to: this.payload.contact.email,
      subject: 'Bets placed!',
      html
    })
  }
}