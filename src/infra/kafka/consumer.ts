import { Consumer as KafkaConsumer, ConsumerSubscribeTopic } from 'kafkajs'
import KafkaService from './service-kafka'

export default class Consumer {

  constructor(private kafkaConsumer: KafkaConsumer) {}

  async connect(): Promise<void> {
    await this.kafkaConsumer.connect()
  }

  async disconnect(): Promise<void> {
    await this.kafkaConsumer.disconnect()
  }

  async subscribe(topics: ConsumerSubscribeTopic[]): Promise<void> {
    topics.forEach(async (options) => await this.kafkaConsumer.subscribe({ ...options  }))
  }

  async run(service: KafkaService) {
    await this.kafkaConsumer.run({
      eachMessage: async ({ message, partition, topic }) => {
        if(topic !== service.topic)
          return
          
        service.handler({ message, partition, topic })
      }
    })
  }
}