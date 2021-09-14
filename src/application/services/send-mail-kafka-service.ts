import { EachMessagePayload } from "kafkajs";
import { mailerOptions } from "../../infra/config/mailer/mailer.config";
import KafkaService from "../../infra/kafka/service-kafka";
import MailerJob from "../jobs/mailer-job";
import queues from "../jobs/queue";
import IPayloadMailer from "../mailers/interfaces/IPayloadMailer";

export default class SendMailKafkaService implements KafkaService  {
  async handler(payloadTopic: EachMessagePayload): Promise<void> {
    try {
      const payloadString = payloadTopic.message.value!.toString()
      const payload: IPayloadMailer = JSON.parse(payloadString)
      const mailerJob = new MailerJob()
      queues.add(mailerJob.key, { payload, mailerOptions })
    } catch(err) {
      console.log(`Error for message: ${payloadTopic.message.value?.toString()}`)
      console.error(err)
    }
  }
}