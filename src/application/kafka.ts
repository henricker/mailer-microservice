import { ConsumerSubscribeTopic } from 'kafkajs'
import { consumerConfig } from '../infra/config/kafka/kafka.consumer.config'
import Consumer from '../infra/kafka/consumer'
import kafka from '../infra/kafka/kafka'
import * as kafkaServices from './kafkaconsumers/' 

(async () => {
  const consumer = new Consumer(kafka.consumer(consumerConfig))
  await consumer.connect()
  
  const topics = Object.values(kafkaServices).map((service) => {
    const topic: ConsumerSubscribeTopic = {
      topic: service.topic
    }
    return topic
  })

  await consumer.subscribe(topics)
  Object.values(kafkaServices).forEach(async (service) => await consumer.run(service))
})()
