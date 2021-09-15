import { readFile } from "fs/promises";
import { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { resolve } from "path";
import BaseMailer from "../../../infra/mailer/basemailer";
import handlebars from 'handlebars';
import IPayloadMailerAdmin from "../interfaces/IPayloadMailer";

export default class NewBetAdminMailer extends BaseMailer {
  constructor(authConfig: SMTPTransport.Options, private payload: IPayloadMailerAdmin) {    
    super(authConfig)
  }

  async prepare(transporter: Transporter): Promise<void> {

    const templateFileContent = (await readFile(resolve(
      __dirname, 
      '..',
      '..',  
      'resources', 
      'views', 
      'mails', 
      'new-bets-admin.hbs',
    ))).toString('utf-8')

    const mailTemplateParse = handlebars.compile(templateFileContent)

    const html = mailTemplateParse({
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