import { EachMessagePayload } from "kafkajs";
import { mailerOptions } from "../../infra/config/mailer/mailer.config";
import KafkaService from "../../infra/kafka/service-kafka";
import mailers from "../mailers";
import IPayloadMailer from "../mailers/IPayloadMailer";

export default class SendMailKafkaService implements KafkaService  {
  constructor() {}

  async handler(payloadTopic: EachMessagePayload): Promise<void> {
    const payloadString = payloadTopic.message.value?.toString()
    if(!payloadString) return

    const payload: IPayloadMailer = JSON.parse(payloadString)
    const mailer = new mailers[payload.handleMailer](mailerOptions, payload)
    await mailer.send()
  }
}

  // testing {"contact":{"name":"henricker","email":"henricker@email.com"},"handleMailer":"welcome-user"}