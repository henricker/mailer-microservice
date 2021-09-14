import consumer from '../infra/kafka/consumer'
import SendMailKafkaService from './services/send-mail-kafka-service'

(async () => {
  const mailService = new SendMailKafkaService()
  await consumer.connect()
  await consumer.subscribe([
    {
      topic: 'mailer-event'
    }
  ])
  await consumer.run(mailService.handler.bind(mailService))
})()
