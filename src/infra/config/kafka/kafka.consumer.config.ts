import { ConsumerConfig } from 'kafkajs'

export const consumerConfig: ConsumerConfig = {
  allowAutoTopicCreation: true,
  groupId: 'mailer-consumer'
}