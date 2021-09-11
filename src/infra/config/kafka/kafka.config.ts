import { KafkaConfig } from 'kafkajs'

export const kafkaConfig: KafkaConfig = {
  clientId: 'mail-sender',
  brokers: ['localhost:9092']
}