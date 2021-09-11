import kafka from "./kafka";
import { Consumer as KafkaConsumer, ConsumerSubscribeTopic, Message } from 'kafkajs'
import { consumerConfig } from "../config/kafka/kafka.consumer.config";

class Consumer {
  private consumer: KafkaConsumer
  constructor() {
    this.consumer = kafka.consumer(consumerConfig)
  }

  async connect(): Promise<void> {
    await this.consumer.connect()
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect()
  }

  async subscribe(topics: ConsumerSubscribeTopic[]): Promise<void> {
    topics.forEach(async (options) => await this.consumer.subscribe({ ...options  }))
  }

  async run(handle: Function) {
    await this.consumer.run({
      eachMessage: async ({ message, partition, topic }) => handle({ message, partition, topic })
    })
  }
}

export default new Consumer()