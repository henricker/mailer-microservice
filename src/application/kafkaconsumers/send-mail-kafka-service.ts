import { EachMessagePayload } from "kafkajs";
import { mailerOptions } from "../../infra/config/mailer/mailer.config";
import KafkaService from "../../infra/kafka/service-kafka";
import MailerJob from "../jobs/mailer-job";
import queues from "../jobs/queue";
import IPayloadMailer from "../mailers/interfaces/IPayloadMailer";

class SendMailKafkaService implements KafkaService  {
  public topic = 'mailer-event'
  async handler(payloadTopic: EachMessagePayload): Promise<void> {
    try {
      const payloadString = payloadTopic.message.value!.toString()
      const payload: IPayloadMailer = JSON.parse(payloadString)

      if(!payload.contact || !payload.contact.email || !payload.contact.name)
        throw new Error('invalid contact')

      const mailerJob = new MailerJob()
      queues.add(mailerJob.key, { payload, mailerOptions })
    } catch(err) {
      console.error(`Error for message: ${payloadTopic.message.value?.toString()}`)
      console.error(err instanceof Error ? err.message : err)
    }
  }
}

export default new SendMailKafkaService()