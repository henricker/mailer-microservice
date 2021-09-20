import { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import BaseMailer from "../../../infra/mailer/base-mailer";
import IPayloadMailer from "../interfaces/IPayloadMailer";
import HandlebarsCompilerService from "../../../infra/handlebars/handlebars";

export default class WeeklyReportsAdminMailer extends BaseMailer {
  constructor(authConfig: SMTPTransport.Options, private payload: IPayloadMailer) {    
    super(authConfig)
  }

  async prepare(transporter: Transporter): Promise<void> {

    if(!this.payload.contact || !this.payload.contact.name || !this.payload.contact.email)
      throw new Error('invalid contact')

    if(!this.payload.games || this.payload.games.gamesRelatory.length === 0 || !this.payload.games.totalPrice)
      throw new Error('invalid relatory')

    const hbs = new HandlebarsCompilerService(this.payload.template)
    const html = await hbs.compile({
      name: this.payload.contact.name,
      games: this.payload.games!.gamesRelatory,
      totalPrice: this.payload.games!.totalPrice
    })

    await transporter.sendMail({
      from: 'TGL BETS 🍀 <tgl@suport.com>',
      to: this.payload.contact.email,
      subject: 'Weekly reports',
      html
    })
  }
}