import Bull, { Queue } from 'bull';
import { queueOptions } from '../config/bull/bull.config';
import JobContract, { IJobContract } from './jobContract';

interface IQueueBull{ 
  bull: Queue<any>; 
  name: string; 
  handle: ({data}: IJobContract<any>) => Promise<Object>
}

export default class QueuesBull {
  
  public queues: IQueueBull[]
  
  constructor(jobs: JobContract<any>[]){
    this.queues = jobs.map(job => ({
      bull: new Bull(job.key, queueOptions),
      name: job.key,
      handle: job.handle.bind(job)
    }))
  }

  public add(name: string, data: any) {
    const queue = this.queues.find(queue => queue.name === name)
    return queue?.bull.add(data)
  }

  process(): void {
    this.queues.forEach(queue => {
      queue.bull.process(queue.handle)

      queue.bull.on('failed', (job, err) => {
        console.log('Job failed', queue.name, job.data)
        console.log(err)
      })
    })
  }
}