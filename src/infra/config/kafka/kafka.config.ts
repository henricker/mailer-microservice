import { KafkaConfig } from 'kafkajs'
import env from '../../../../env'

export const kafkaConfig: KafkaConfig = {
  clientId: env.ENV_KAFKA_CLIEND_ID,
  brokers: [ String(env.ENV_KAFKA_BROKER) ]
}