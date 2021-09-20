import { Request, Response } from "express";
import { mailerOptions } from "../../../infra/config/mailer/mailer.config";
import { MailerJob } from "../../jobs";
import queues from "../../jobs/queue";
import mailers from "../../mailers";

export default class MailerController {
  public async showMailerTemplates(request: Request, response: Response) {
    return response.json({templates: Object.keys(mailers)})
  }

  public async sendMail(request: Request, response: Response) {

    const { payload } = request.body

    if(!payload)
      return response.status(400).json({ error: [{ message: 'invalid payload'}] })

    if(!payload.template || payload.template === '' || !Object.keys(mailers).find((key) => key === payload.template))
      return response.status(404).json({ error: [ { message: 'template not found' } ] })

    if(!payload.contact || !payload.contact.name || !payload.contact.email)
      return response.status(404).json({ error: [{ message: 'invalid contact'}]})
      
    const mailerJob = new MailerJob()
    queues.add(mailerJob.key, { payload, mailerOptions })

    return response.send()
  }
}
