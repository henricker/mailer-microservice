import { Kafka } from 'kafkajs'
import { kafkaConfig } from '../config/kafka/kafka.config'

const kafka = new Kafka(kafkaConfig)
export default kafka
