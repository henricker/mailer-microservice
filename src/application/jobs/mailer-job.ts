import SMTPTransport from "nodemailer/lib/smtp-transport";
import JobContract, { IJobContractDataHandler } from "../../infra/bull/jobContract";
import { mailerOptions } from "../../infra/config/mailer/mailer.config";
import mailers from "../mailers";
import IPayloadMailer from "../mailers/interfaces/IPayloadMailer";

interface IMailerJobContractData {
  payload: IPayloadMailer,
  mailerOptions: SMTPTransport.Options
}

export default class MailerJob implements JobContract<IMailerJobContractData> {
  public key = 'mailer-job'

  public async handle({ data }: IJobContractDataHandler<IMailerJobContractData>): Promise<void> {
    try {
      const payload = data.payload
      const mailerClass = mailers[payload.template]
      const mailer = new mailerClass(mailerOptions, payload)
      await mailer.send()
    } catch(err) {
      err instanceof Error ? console.log(err.message): console.log(err)
    }
  }
}