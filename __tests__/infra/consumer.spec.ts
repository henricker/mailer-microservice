import Consumer from '../../src/infra/kafka/consumer'
import kafka from '../../src/infra/kafka/kafka'

describe('#Consumer', () => {
  const consumer = kafka.consumer({ groupId: 'sadasdas'} )
  describe('#connect', () => {
    test('should be called connect method of kafkaConsumer', async () => {
      jest.spyOn(consumer, 'connect').mockImplementation()
      const kafkaConsumer = new Consumer(consumer)

      await kafkaConsumer.connect()
      expect(consumer.connect).toHaveBeenCalled()
    })
  })
  describe('#disconnect', () => {
    test('should be called disconnect method of kafkaConsumer', async () => {
      jest.spyOn(consumer, 'disconnect').mockImplementation()
      const kafkaConsumer = new Consumer(consumer)

      await kafkaConsumer.disconnect()
      expect(consumer.disconnect).toHaveBeenCalled()
    })
  })
  describe('#subscribe', () => {
    test('must call the subscribe method three times when three topics are approved.', async () => {
      jest.spyOn(consumer, 'subscribe').mockImplementation()
      const kafkaConsumer = new Consumer(consumer)
      await kafkaConsumer.subscribe([{ topic: 'event-mailer' }, { topic: 'topic-event' }, { topic: 'kafka-event' }])
      expect(consumer.subscribe).toHaveBeenCalledTimes(3)
    })

    test('must call the subscribe method with kafka-topic by params', async () => {
      jest.spyOn(consumer, 'subscribe').mockImplementation()
      const kafkaConsumer = new Consumer(consumer)
      await kafkaConsumer.subscribe([{ topic: 'kafka-event' }])
      expect(consumer.subscribe).toHaveBeenCalledWith({ topic: 'kafka-event' })
    })
  })
  describe('#run', () => {
    test('must call the run method of consumer when kafkaConsumer call method run', async () => {
      jest.spyOn(consumer, 'run').mockImplementation()
      const handle = jest.fn()
      const kafkaConsumer = new Consumer(consumer)
      await kafkaConsumer.run(handle)
      expect(consumer.run).toHaveBeenCalled()
    })
  })
})