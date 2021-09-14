import { consumerConfig } from '../infra/config/kafka/kafka.consumer.config'
import Consumer from '../infra/kafka/consumer'
import kafka from '../infra/kafka/kafka'
import SendMailKafkaService from './services/send-mail-kafka-service'

(async () => {
  const mailService = new SendMailKafkaService()
  const consumer = new Consumer(kafka.consumer(consumerConfig))
  await consumer.connect()
  await consumer.subscribe([
    {
      topic: 'mailer-event'
    }
  ])
  await consumer.run(mailService.handler.bind(mailService))
})()
