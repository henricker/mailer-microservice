import { readFile } from "fs/promises";
import { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { resolve } from "path";
import BaseMailer from "../../infra/mailer/basemailer";
import handlebars from 'handlebars';
import IPayloadMailer from "./IPayloadMailer";

export default class WelcomeUserMailer extends BaseMailer {
  constructor(authConfig: SMTPTransport.Options, private payload: IPayloadMailer) {    
    super(authConfig)
  }

  async prepare(transporter: Transporter): Promise<void> {

    const templateFileContent = (await readFile(resolve(
      __dirname, 
      '..',  
      'resources', 
      'views', 
      'mails', 
      'welcome-user.edge'
    ))).toString('utf-8')

    const mailTemplateParse = handlebars.compile(templateFileContent)

    const html = mailTemplateParse({
      name: this.payload.contact.name,
      email: this.payload.contact.email
    })

    await transporter.sendMail({
      from: 'TGL BETS 🍀 <tgl@suport.com>',
      to: this.payload.contact.email,
      subject: 'Welcome to TGL BETS!',
      html
    })
  }
}