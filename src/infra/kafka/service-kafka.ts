import { EachMessagePayload } from "kafkajs";

export default interface KafkaService {
  topic: string
  handler(payloadTopic: EachMessagePayload): Promise<void> 
}