import { Consumer as KafkaConsumer, ConsumerSubscribeTopic, Message } from 'kafkajs'

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

  async run(handle: Function) {
    await this.kafkaConsumer.run({
      eachMessage: async ({ message, partition, topic }) => handle({ message, partition, topic })
    })
  }
}