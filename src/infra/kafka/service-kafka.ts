import { EachMessagePayload } from "kafkajs";

export default interface KafkaService {
  handler(payloadTopic: EachMessagePayload): Promise<void> 
}