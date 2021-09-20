import Bull from "bull"
import { setTimeout } from "timers/promises"
import jobContract, { IJobContractDataHandler } from "../../src/infra/bull/jobContract"
import QueuesBull from "../../src/infra/bull/queue"

interface dataTesting {
  name: string,
  age: number
}

class JobTesting implements jobContract<dataTesting> {
  public key = 'testing-job'
  async handle({ data }: IJobContractDataHandler<dataTesting>): Promise<void> {
    await setTimeout(100)
    console.log('AAAAAAAAAAAAI PAPAI')
  }
}

describe('#QueuesBull', () => {
  describe('#add', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })
    test('Should add job on queue and call add method of bull instance', async () => {
      const queues = new QueuesBull([new JobTesting(), new JobTesting()])
      jest.spyOn(Bull.prototype as any, 'add')

      await queues.add('testing-job', { name: 'henricker', age: 21 })
      expect(Bull.prototype.add).toBeCalled()
    })
    test('Should return error when there is no work with the name passed as parameter', async () => {
      try {
        const queues = new QueuesBull([new JobTesting(), new JobTesting()])
        await queues.add('testing-job', { name: 'henricker', age: 21 })
      } catch(err) {
        err instanceof Error ? expect(err.message).toBe('queue not found') : ''
      }
    })
  })
  describe('#process', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })
    test("Must call the bull instance's method process when the queues call its method process", async () => {
      const jobTesting = new JobTesting()
      const queues = new QueuesBull([jobTesting])
      jest.spyOn(Bull.prototype as any, 'add').mockImplementation()
      jest.spyOn(Bull.prototype as any, 'process').mockImplementation()

      await queues.add('testing-job', { name: 'henricker', age: 21 })
      await queues.process()
    
      const handleCalled = Bull.prototype.process.mock.calls[0][0]
      expect(handleCalled.toString()).toStrictEqual(jobTesting.handle.bind(jobTesting).toString())
    })
    test("Musl call the bull instance's method 3 times when queues has 3 jobs", async () => {
      const queues = new QueuesBull([new JobTesting(), new JobTesting(), new JobTesting()])
      jest.spyOn(Bull.prototype as any, 'add').mockImplementation()
      jest.spyOn(Bull.prototype as any, 'process').mockImplementation()

      await queues.add('testing-job', { name: 'henricker', age: 21 })
      await queues.process()
    
      const handleCalled = Bull.prototype.process.mock.calls[0][0]
      expect(Bull.prototype.process).toHaveBeenCalledTimes(3)
    })
  })
})