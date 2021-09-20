import { consumerConfig } from '../infra/config/kafka/kafka.consumer.config'
import Consumer from '../infra/kafka/consumer'
import kafka from '../infra/kafka/kafka'
import * as kafkaServices from './kafkaconsumers/' 

(async () => {
  const consumer = new Consumer(kafka.consumer(consumerConfig))
  await consumer.connect()
  await consumer.subscribe([
    {
      topic: 'mailer-event'
    }
  ])
  Object.values(kafkaServices).forEach(async (service) => await consumer.run(service))
})()
