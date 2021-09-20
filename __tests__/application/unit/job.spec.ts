import Bull from "bull";
import jobContract, { IJobContractDataHandler } from "../../../src/infra/bull/jobContract";
import QueuesBull from "../../../src/infra/bull/queue";


interface dataTesting {
  name: string
}
class TestingJob implements jobContract<dataTesting> {
  public key = 'testing-job'
  async handle({ data }: IJobContractDataHandler<dataTesting>): Promise<void> {}
}

describe('#Any job that implements IJobContract', () => {
  describe('#handle', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })
    test('Should call handle method when add on queue jobs', async () => {
      const testJob = new TestingJob()


      jest.spyOn(testJob as any, 'handle')
      
      //Simulate a event processing job to execute function
      jest.spyOn(Bull.prototype as any, 'process').mockImplementation(async handle => {
        if(typeof handle === 'function')
          await handle.apply(testJob, [{name: 'henricker'}])
      })
  

      const queues = new QueuesBull([testJob])

      await queues.add('testing-job', { name: 'henricker' })
      await queues.process()

      expect(testJob.handle).toBeCalledWith({name: 'henricker'})
    })
  })
})