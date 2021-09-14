import { EachMessagePayload } from "kafkajs";
import { mailerOptions } from "../../infra/config/mailer/mailer.config";
import KafkaService from "../../infra/kafka/service-kafka";
import mailers from "../mailers";
import IPayloadMailer from "../mailers/interfaces/IPayloadMailer";

export default class SendMailKafkaService implements KafkaService  {
  constructor() {}

  async handler(payloadTopic: EachMessagePayload): Promise<void> {
    try {
      const payloadString = payloadTopic.message.value!.toString()
      const payload: IPayloadMailer = JSON.parse(payloadString) 
      const mailerClass = mailers[payload.template]
      const mailer = new mailerClass(mailerOptions, payload)
      await mailer.send()
    } catch(err) {
      console.log(`Error for message: ${payloadTopic.message.value?.toString()}`)
      console.error(err)
    }
  }
}