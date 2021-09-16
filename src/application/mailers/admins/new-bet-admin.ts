import { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import BaseMailer from "../../../infra/mailer/basemailer";
import IPayloadMailerAdmin from "../interfaces/IPayloadMailer";
import HandlebarsCompilerService from "../../../infra/handlebars/handlebars";

export default class NewBetAdminMailer extends BaseMailer {
  constructor(authConfig: SMTPTransport.Options, private payload: IPayloadMailerAdmin) {    
    super(authConfig)
  }

  async prepare(transporter: Transporter): Promise<void> {

    const hbs = new HandlebarsCompilerService('new-bets-admin')
    const html = await hbs.compile({
      name: this.payload.contact.name,
      games: this.payload.games!.gamesRelatory,
      totalPrice: this.payload.games!.totalPrice
    })

    await transporter.sendMail({
      from: 'TGL BETS 🍀 <tgl@suport.com>',
      to: this.payload.contact.email,
      subject: 'Bets placed!',
      html
    })
  }
}