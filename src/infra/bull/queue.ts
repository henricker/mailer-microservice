import Bull, { Job, JobPromise, Queue } from 'bull';
import { queueOptions } from '../config/bull/bull.config';
import JobContract from './jobContract';

interface IQueueBull{ 
  bull: Queue<any>; 
  name: string; 
  handle: ({data}: any) => Promise<void>
}

export default class QueuesBull {
  
  private queues: IQueueBull[]
  
  constructor(jobs: JobContract<any>[]){
    this.queues = jobs.map(job => ({
      bull: new Bull(job.key, queueOptions),
      name: job.key,
      handle: job.handle.bind(job)
    }))
  }

  public add(name: string, data: any) {
    const queue = this.queues.find(queue => queue.name === name)

    if(!queue)
      throw new Error('queue not found')

    return queue?.bull.add(data, { 
      attempts: 5, 
      removeOnComplete: true, 
      removeOnFail: true, 
      delay: 500 
    })
  }

  async process(): Promise<void> {
    this.queues.forEach(async queue => {
      queue!.bull.on('active', (job, jobPromise) => this.onStart(job, queue, jobPromise))
      queue!.bull.on('failed', (job, err) => this.onFailed(job, err, queue))
      queue!.bull.on('completed', (job, result) => this.onComplete(job, result, queue))
      await queue.bull.process(queue.handle)
    })
  }

  private onFailed(job: Job, err: Error, queue: IQueueBull): void {
    console.log(`${queue.name} Job failed`)
    console.error(err.message)
  }

  private onComplete(job: Job, result: any, queue: IQueueBull): void {
    console.log(`${queue.name} Job finish with success!`)
  }

  private onStart(job: Job, queue: IQueueBull, jobPromise?: JobPromise,) {
    console.log(`${queue.name} Job starting...`, )
  }
}